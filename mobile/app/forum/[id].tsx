import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { useAuth } from '../../contexts/AuthContext';
import { getTopic, createReply } from '../../services/forum';
import { BumbarButton } from '../../components';
import { Typography } from '../../constants/Typography';
import Avatar from '../../components/Avatar';

export default function ForumTopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useBumbarTheme();
  const { user } = useAuth();
  const [topic, setTopic] = useState<any>(null);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => { getTopic(Number(id)).then(setTopic); }, [id]);
  useEffect(() => { load(); }, [load]);

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

  if (!topic) return null;

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      {topic.imageUrl && <Image source={{ uri: topic.imageUrl }} style={styles.coverImage} />}
      <Text style={[styles.title, { color: colors.text }]}>{topic.title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 }}>
        <Avatar name={topic.author?.name} url={topic.author?.avatarUrl} size={20} />
        <Text style={{ color: colors.textSecondary }}>por {topic.author?.name}</Text>
      </View>
      <Text style={[styles.body, { color: colors.text }]}>{topic.description}</Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Respostas</Text>
      {topic.replies?.map((r: any) => (
        <View key={r.id} style={[styles.reply, { borderColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <Avatar name={r.author?.name} url={r.author?.avatarUrl} size={28} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: colors.text }}>{r.author?.name}</Text>
              <Text style={{ color: colors.text, marginTop: 2 }}>{r.body}</Text>
            </View>
          </View>
        </View>
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
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48 },
  coverImage: { width: '100%', height: 180, borderRadius: 14, marginBottom: 16 },
  title: { ...Typography.presets.h1, marginBottom: 4 },
  body: { ...Typography.presets.body, lineHeight: 24, marginBottom: 24 },
  sectionTitle: { ...Typography.presets.h3, marginBottom: 10 },
  reply: { borderTopWidth: 1, paddingVertical: 10 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, minHeight: 80, textAlignVertical: 'top' },
});
