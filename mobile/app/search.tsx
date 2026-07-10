import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBumbarTheme } from '../hooks/useBumbarTheme';
import { search } from '../services/search';
import ContentCard from '../components/ContentCard';
import Avatar from '../components/Avatar';
import KeyboardDismissView from '../components/KeyboardDismissView';
import { ContentListSkeleton } from '../components/Skeleton';
import { Typography } from '../constants/Typography';

const ROLE_LABEL: Record<string, string> = { ADMIN: 'Administrador', USER: 'Membro' };

export default function SearchScreen() {
  const { colors } = useBumbarTheme();
  const router = useRouter();
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    const value = term.trim();
    if (!value) return;
    setLoading(true);
    setError('');
    try {
      const data = await search(value);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Não foi possível pesquisar.');
    } finally {
      setLoading(false);
    }
  };

  const total = results
    ? results.content.length + results.quizzes.length + results.topics.length + (results.users?.length || 0)
    : 0;

  return (
    <KeyboardDismissView style={{ backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.text }]}>Pesquisar</Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
          Encontra conteúdos, quizzes, tópicos do fórum e pessoas.
        </Text>

        <View style={[styles.searchBox, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            autoFocus
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="O que procuras?"
            placeholderTextColor={colors.textSecondary}
            value={term}
            onChangeText={setTerm}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>Pesquisar</Text>
          </TouchableOpacity>
        </View>

        {!!error && <Text style={{ color: colors.error, marginTop: 12 }}>{error}</Text>}
        {loading && <ContentListSkeleton count={2} />}

        {!loading && results && (
          <>
            <Text style={{ color: colors.textSecondary, marginVertical: 16 }}>
              {total === 0
                ? `Sem resultados para "${results.query}".`
                : `${total} resultado${total > 1 ? 's' : ''} para "${results.query}".`}
            </Text>

            {results.users?.length > 0 && (
              <View style={{ marginBottom: 24 }}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Pessoas</Text>
                {results.users.map((u: any) => (
                  <TouchableOpacity
                    key={u.id}
                    style={[styles.row, { borderColor: colors.border }]}
                    onPress={() => router.push(`/user/${u.id}`)}
                  >
                    <Avatar name={u.name} url={u.avatarUrl} size={40} />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={{ fontWeight: '700', color: colors.text }}>{u.name}</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                        {ROLE_LABEL[u.role] || u.role}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {results.content.length > 0 && (
              <View style={{ marginBottom: 24 }}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Conteúdos</Text>
                {results.content.map((item: any) => (
                  <ContentCard key={item.id} item={item} onPress={() => router.push(`/content/${item.id}`)} />
                ))}
              </View>
            )}

            {results.quizzes.length > 0 && (
              <View style={{ marginBottom: 24 }}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Quizzes</Text>
                {results.quizzes.map((quiz: any) => (
                  <TouchableOpacity
                    key={quiz.id}
                    style={[styles.row, { borderColor: colors.border }]}
                    onPress={() => router.push(`/quiz/${quiz.id}`)}
                  >
                    <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={{ fontWeight: '700', color: colors.text }}>{quiz.title}</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                        {quiz._count?.questions ?? 0} pergunta{(quiz._count?.questions ?? 0) === 1 ? '' : 's'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {results.topics.length > 0 && (
              <View style={{ marginBottom: 24 }}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Fórum</Text>
                {results.topics.map((topic: any) => (
                  <TouchableOpacity
                    key={topic.id}
                    style={[styles.row, { borderColor: colors.border }]}
                    onPress={() => router.push(`/forum/${topic.id}`)}
                  >
                    <Ionicons name="chatbubble-outline" size={22} color={colors.textSecondary} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{ fontWeight: '700', color: colors.text }}>{topic.title}</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                        {topic._count?.replies ?? 0} resposta{(topic._count?.replies ?? 0) === 1 ? '' : 's'} · por{' '}
                        {topic.author?.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {!loading && !results && (
          <Text style={{ color: colors.textSecondary, marginTop: 16 }}>Escreve algo acima para começar a pesquisar.</Text>
        )}
      </ScrollView>
    </KeyboardDismissView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48 },
  title: { ...Typography.presets.h1, marginBottom: 4 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15 },
  sectionTitle: { ...Typography.presets.h3, marginBottom: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
});
