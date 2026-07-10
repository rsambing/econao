import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { useAuth } from '../../contexts/AuthContext';
import { getTopic, createReply, updateReply, deleteReply, updateTopic, deleteTopic } from '../../services/forum';
import { uploadMedia } from '../../services/upload';
import { BumbarButton, BumbarOutlinedInput } from '../../components';
import KeyboardDismissView from '../../components/KeyboardDismissView';
import { Typography } from '../../constants/Typography';
import Avatar from '../../components/Avatar';
import CommentItem from '../../components/CommentItem';
import { DetailSkeleton } from '../../components/Skeleton';

export default function ForumTopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useBumbarTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [topic, setTopic] = useState<any>(null);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTheme, setEditTheme] = useState('');
  const [editImageUri, setEditImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const load = useCallback(() => { getTopic(Number(id)).then(setTopic); }, [id]);
  useEffect(() => { load(); }, [load]);

  const canManage = !!user && !!topic && (user.id === topic.author?.id || user.role === 'ADMIN');

  const startEditing = () => {
    setEditTitle(topic.title);
    setEditDescription(topic.description);
    setEditTheme(topic.theme || '');
    setEditImageUri(topic.imageUrl || null);
    setEditError('');
    setEditing(true);
  };

  const pickEditImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Autoriza o acesso às fotos para escolheres uma capa.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled || !result.assets?.[0]) return;
    setEditImageUri(result.assets[0].uri);
  };

  const handleSaveTopic = async () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      setEditError('Indica um título e uma descrição.');
      return;
    }
    setSaving(true);
    setEditError('');
    try {
      let imageUrl: string | null = editImageUri;
      if (editImageUri && editImageUri !== topic.imageUrl) {
        imageUrl = await uploadMedia(editImageUri, `topic-${Date.now()}.jpg`, 'image/jpeg');
      }
      await updateTopic(topic.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        theme: editTheme.trim() || null,
        imageUrl,
      });
      setEditing(false);
      load();
    } catch (err: any) {
      setEditError(err.message || 'Não foi possível guardar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTopic = () => {
    Alert.alert('Eliminar tópico', 'Eliminar este tópico e todas as respostas?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTopic(topic.id);
            router.replace('/forum');
          } catch (err: any) {
            Alert.alert('Erro', err.message || 'Não foi possível eliminar o tópico.');
          }
        },
      },
    ]);
  };

  const handleReply = async () => {
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      await createReply(Number(id), body);
      setBody('');
      load();
    } finally {
      setSubmitting(false);
    }
  };

  if (!topic) {
    return (
      <ScrollView style={{ backgroundColor: colors.background }}>
        <DetailSkeleton />
      </ScrollView>
    );
  }

  return (
    <KeyboardDismissView style={{ backgroundColor: colors.background }}>
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {canManage && !editing && (
        <View style={styles.manageRow}>
          <TouchableOpacity style={[styles.manageBtn, { borderColor: colors.border }]} onPress={startEditing}>
            <Ionicons name="pencil-outline" size={15} color={colors.text} />
            <Text style={{ color: colors.text, marginLeft: 6, fontWeight: '600' }}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.manageBtn, { borderColor: colors.error }]} onPress={handleDeleteTopic}>
            <Ionicons name="trash-outline" size={15} color={colors.error} />
            <Text style={{ color: colors.error, marginLeft: 6, fontWeight: '600' }}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}

      {editing ? (
        <View style={{ marginBottom: 24 }}>
          <BumbarOutlinedInput label="Título" value={editTitle} onChangeText={setEditTitle} leftIcon="text-outline" />
          <View style={{ height: 12 }} />
          <Text style={[styles.label, { color: colors.textSecondary }]}>Descrição</Text>
          <TextInput
            style={[styles.textArea, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]}
            value={editDescription}
            onChangeText={setEditDescription}
            multiline
          />
          <View style={{ height: 12 }} />
          <BumbarOutlinedInput
            label="Tema / categoria (opcional)"
            value={editTheme}
            onChangeText={setEditTheme}
            leftIcon="pricetag-outline"
          />
          <View style={{ height: 12 }} />
          <TouchableOpacity
            onPress={pickEditImage}
            style={[styles.imagePicker, { borderColor: colors.border, backgroundColor: colors.card }]}
          >
            {editImageUri ? (
              <Image source={{ uri: editImageUri }} style={styles.imagePreview} />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
                <Text style={{ color: colors.textSecondary, marginTop: 6 }}>Escolher foto de capa</Text>
              </View>
            )}
          </TouchableOpacity>
          {!!editError && <Text style={{ color: colors.error, marginTop: 12 }}>{editError}</Text>}
          <View style={{ height: 16 }} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <BumbarButton title={saving ? 'A guardar...' : 'Guardar alterações'} onPress={handleSaveTopic} loading={saving} variant="primary" />
            <BumbarButton title="Cancelar" onPress={() => setEditing(false)} variant="tertiary" disabled={saving} />
          </View>
        </View>
      ) : (
        <>
          {topic.imageUrl && <Image source={{ uri: topic.imageUrl }} style={styles.coverImage} />}
          <Text style={[styles.title, { color: colors.text }]}>{topic.title}</Text>
          <TouchableOpacity
            disabled={!topic.author?.id}
            onPress={() => router.push(`/user/${topic.author?.id}`)}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 }}
          >
            <Avatar name={topic.author?.name} url={topic.author?.avatarUrl} size={20} />
            <Text style={{ color: colors.textSecondary }}>por {topic.author?.name}</Text>
            {!!topic.theme && (
              <View style={[styles.themeBadge, { backgroundColor: colors.primary + '20' }]}>
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>{topic.theme}</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={[styles.body, { color: colors.text }]}>{topic.description}</Text>
        </>
      )}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Respostas</Text>
      {topic.replies?.map((r: any) => (
        <CommentItem
          key={r.id}
          item={r}
          onSave={async (replyId, body) => { await updateReply(replyId, body); load(); }}
          onDelete={async (replyId) => { await deleteReply(replyId); load(); }}
        />
      ))}
      {(!topic.replies || topic.replies.length === 0) && (
        <Text style={{ color: colors.textSecondary }}>Sê o primeiro a responder.</Text>
      )}

      {user ? (
        <View style={{ marginTop: 16 }}>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Escreve a tua contribuição..."
            placeholderTextColor={colors.textSecondary}
            value={body}
            onChangeText={setBody}
            multiline
          />
          <View style={{ height: 10 }} />
          <BumbarButton title="Enviar Resposta" onPress={handleReply} loading={submitting} variant="primary" fullWidth />
        </View>
      ) : (
        <Text style={{ color: colors.textSecondary, marginTop: 16 }}>Entra para responder.</Text>
      )}
    </ScrollView>
    </KeyboardDismissView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48 },
  coverImage: { width: '100%', height: 180, borderRadius: 14, marginBottom: 16 },
  title: { ...Typography.presets.h1, marginBottom: 4 },
  body: { ...Typography.presets.body, lineHeight: 24, marginBottom: 24 },
  sectionTitle: { ...Typography.presets.h3, marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, minHeight: 80, textAlignVertical: 'top' },
  manageRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  textArea: { borderWidth: 1, borderRadius: 10, padding: 12, minHeight: 90, textAlignVertical: 'top', fontSize: 15 },
  imagePicker: {
    borderWidth: 1,
    borderRadius: 12,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagePreview: { width: '100%', height: '100%' },
  themeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
});
