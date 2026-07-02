import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { useAuth } from '../../contexts/AuthContext';
import { getTopic, createReply } from '../../services/forum';
import { BumbarButton } from '../../components';
import { Typography } from '../../constants/Typography';

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
      <Text style={[styles.title, { color: colors.text }]}>{topic.title}</Text>
      <Text style={{ color: colors.textSecondary, marginBottom: 12 }}>por {topic.author?.name}</Text>
      <Text style={[styles.body, { color: colors.text }]}>{topic.description}</Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Respostas</Text>
      {topic.replies?.map((r: any) => (
        <View key={r.id} style={[styles.reply, { borderColor: colors.border }]}>
          <Text style={{ fontWeight: '700', color: colors.text }}>{r.author?.name}</Text>
          <Text style={{ color: colors.text, marginTop: 2 }}>{r.body}</Text>
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
  title: { ...Typography.presets.h1, marginBottom: 4 },
  body: { ...Typography.presets.body, lineHeight: 24, marginBottom: 24 },
  sectionTitle: { ...Typography.presets.h3, marginBottom: 10 },
  reply: { borderTopWidth: 1, paddingVertical: 10 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, minHeight: 80, textAlignVertical: 'top' },
});
