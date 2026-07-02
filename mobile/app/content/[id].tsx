import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { useAuth } from '../../contexts/AuthContext';
import { getContent, createComment } from '../../services/content';
import { BumbarButton } from '../../components';
import { Typography } from '../../constants/Typography';

const TYPE_LABEL: Record<string, string> = { VIDEO: 'Vídeo', TEXT: 'Texto', PODCAST: 'Podcast' };

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useBumbarTheme();
  const { user } = useAuth();
  const [content, setContent] = useState<any>(null);
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    getContent(Number(id)).then(setContent);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleComment = async () => {
    if (!commentBody.trim()) return;
    setSubmitting(true);
    try {
      await createComment(Number(id), commentBody);
      setCommentBody('');
      load();
    } finally {
      setSubmitting(false);
    }
  };

  if (!content) return null;

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.badge, { color: colors.primary, backgroundColor: colors.primary + '20' }]}>
        {TYPE_LABEL[content.type] || content.type}
      </Text>
      <Text style={[styles.title, { color: colors.text }]}>{content.title}</Text>
      <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
        {content.theme}{content.region ? ` · ${content.region}` : ''}
      </Text>
      <Text style={[styles.body, { color: colors.text }]}>{content.body}</Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Comentários</Text>
      {content.comments?.map((c: any) => (
        <View key={c.id} style={[styles.comment, { borderColor: colors.border }]}>
          <Text style={{ fontWeight: '700', color: colors.text }}>{c.author?.name}</Text>
          <Text style={{ color: colors.text, marginTop: 2 }}>{c.body}</Text>
        </View>
      ))}
      {(!content.comments || content.comments.length === 0) && (
        <Text style={{ color: colors.textSecondary }}>Sê o primeiro a comentar.</Text>
      )}

      {user ? (
        <View style={{ marginTop: 16 }}>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Escreve um comentário..."
            placeholderTextColor={colors.textSecondary}
            value={commentBody}
            onChangeText={setCommentBody}
            multiline
          />
          <View style={{ height: 10 }} />
          <BumbarButton title="Publicar Comentário" onPress={handleComment} loading={submitting} variant="primary" fullWidth />
        </View>
      ) : (
        <Text style={{ color: colors.textSecondary, marginTop: 16 }}>Entra para comentar.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48 },
  badge: { alignSelf: 'flex-start', fontSize: 12, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, marginBottom: 10 },
  title: { ...Typography.presets.h1, marginBottom: 6 },
  body: { ...Typography.presets.body, lineHeight: 24, marginBottom: 24 },
  sectionTitle: { ...Typography.presets.h3, marginBottom: 10 },
  comment: { borderTopWidth: 1, paddingVertical: 10 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, minHeight: 80, textAlignVertical: 'top' },
});
