import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { createTopic } from '../../services/forum';
import { uploadMedia } from '../../services/upload';
import { BumbarButton, BumbarOutlinedInput } from '../../components';
import KeyboardDismissView from '../../components/KeyboardDismissView';
import { Typography } from '../../constants/Typography';

export default function NewTopicScreen() {
  const { colors } = useBumbarTheme();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Autoriza o acesso às fotos para escolheres uma capa.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled || !result.assets?.[0]) return;
    setImageUri(result.assets[0].uri);
  };

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Indica um título e uma descrição.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      let imageUrl: string | undefined;
      if (imageUri) {
        setUploading(true);
        imageUrl = await uploadMedia(imageUri, `topic-${Date.now()}.jpg`, 'image/jpeg');
        setUploading(false);
      }
      const topic = await createTopic({
        title: title.trim(),
        description: description.trim(),
        theme: theme.trim() || undefined,
        imageUrl,
      });
      router.replace(`/forum/${topic.id}`);
    } catch (err: any) {
      setError(err.message || 'Não foi possível criar o tópico.');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <KeyboardDismissView style={{ backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.text }]}>Criar novo tópico</Text>

        <BumbarOutlinedInput label="Título" value={title} onChangeText={setTitle} leftIcon="text-outline" />
        <View style={{ height: 12 }} />
        <Text style={[styles.label, { color: colors.textSecondary }]}>Descrição</Text>
        <TextInput
          style={[styles.textArea, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]}
          placeholder="Escreve a descrição do tópico..."
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <View style={{ height: 12 }} />
        <BumbarOutlinedInput
          label="Tema / categoria (opcional)"
          value={theme}
          onChangeText={setTheme}
          leftIcon="pricetag-outline"
        />
        <View style={{ height: 16 }} />

        <TouchableOpacity
          onPress={pickImage}
          style={[styles.imagePicker, { borderColor: colors.border, backgroundColor: colors.card }]}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
              <Text style={{ color: colors.textSecondary, marginTop: 6 }}>Escolher foto de capa (opcional)</Text>
            </View>
          )}
        </TouchableOpacity>

        {!!error && <Text style={{ color: colors.error, marginTop: 12 }}>{error}</Text>}

        <View style={{ height: 20 }} />
        <BumbarButton
          title={uploading ? 'A enviar imagem...' : 'Publicar Tópico'}
          onPress={handleCreate}
          loading={submitting}
          variant="primary"
          size="large"
          fullWidth
        />
      </ScrollView>
    </KeyboardDismissView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48 },
  title: { ...Typography.presets.h1, marginBottom: 20 },
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
});
