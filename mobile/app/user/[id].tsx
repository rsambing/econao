import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { getPublicProfile } from '../../services/users';
import Avatar from '../../components/Avatar';
import { DetailSkeleton } from '../../components/Skeleton';
import { Typography } from '../../constants/Typography';

const ROLE_LABEL: Record<string, string> = { ADMIN: 'Administrador', USER: 'Membro' };

function formatJoin(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useBumbarTheme();
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setProfile(null);
    setError('');
    getPublicProfile(id).then(setProfile).catch((err: any) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.error }}>{error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <ScrollView style={{ backgroundColor: colors.background }}>
        <DetailSkeleton />
      </ScrollView>
    );
  }

  const { user, forumTopics, bestScores } = profile;

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Avatar name={user.name} url={user.avatarUrl} size={72} />
        <View style={{ marginLeft: 16, flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>
                {ROLE_LABEL[user.role] || user.role}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                Membro desde {formatJoin(user.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        <Ionicons name="chatbubbles-outline" size={15} /> Tópicos no fórum
      </Text>
      {forumTopics.length === 0 ? (
        <Text style={{ color: colors.textSecondary, marginBottom: 24 }}>Ainda não criou tópicos.</Text>
      ) : (
        forumTopics.map((t: any) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.row, { borderColor: colors.border }]}
            onPress={() => router.push(`/forum/${t.id}`)}
          >
            <Ionicons name="chatbubble-outline" size={18} color={colors.textSecondary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontWeight: '700', color: colors.text }}>{t.title}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                {t._count?.replies ?? 0} resposta{(t._count?.replies ?? 0) === 1 ? '' : 's'}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}

      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 8 }]}>
        <Ionicons name="trophy-outline" size={15} /> Melhores pontuações
      </Text>
      {bestScores.length === 0 ? (
        <Text style={{ color: colors.textSecondary }}>Ainda não completou quizzes.</Text>
      ) : (
        bestScores.map((s: any) => (
          <TouchableOpacity
            key={s.quizId}
            style={[styles.row, { borderColor: colors.border }]}
            onPress={() => router.push(`/quiz/${s.quizId}`)}
          >
            <Ionicons name="trophy-outline" size={18} color={colors.textSecondary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontWeight: '700', color: colors.text }}>{s.title}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Melhor pontuação: {s.score}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48 },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  name: { ...Typography.presets.h2, marginBottom: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
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
