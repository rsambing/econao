import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { useAuth } from '../../contexts/AuthContext';
import { listQuizzes, getRanking } from '../../services/quiz';
import { BumbarButton } from '../../components';
import { Typography } from '../../constants/Typography';
import { RowListSkeleton } from '../../components/Skeleton';

export default function QuizzesScreen() {
  const { colors } = useBumbarTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRankingId, setOpenRankingId] = useState<number | null>(null);
  const [rankings, setRankings] = useState<Record<number, any[]>>({});
  const [rankingLoading, setRankingLoading] = useState<number | null>(null);

  const load = useCallback(() => { listQuizzes().then(setQuizzes).finally(() => setLoading(false)); }, []);
  useEffect(() => { load(); }, [load]);

  const toggleRanking = async (quizId: number) => {
    if (openRankingId === quizId) {
      setOpenRankingId(null);
      return;
    }
    setOpenRankingId(quizId);
    if (!rankings[quizId]) {
      setRankingLoading(quizId);
      try {
        const rank = await getRanking(quizId);
        setRankings((prev) => ({ ...prev, [quizId]: rank }));
      } finally {
        setRankingLoading(null);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Quiz Interactivo</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Testa os teus conhecimentos sobre economia e história angolana.
      </Text>
      {loading ? <RowListSkeleton count={4} /> : <FlatList
        data={quizzes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{item._count?.questions ?? 0} perguntas</Text>
                </View>
              </View>
              <BumbarButton title="Iniciar" onPress={() => router.push(`/quiz/${item.id}`)} size="small" />
            </View>

            <TouchableOpacity style={styles.rankingToggle} onPress={() => toggleRanking(item.id)}>
              <Ionicons name="trophy-outline" size={14} color={colors.primary} />
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600', marginLeft: 6 }}>
                {openRankingId === item.id ? 'Fechar ranking' : 'Ver ranking'}
              </Text>
            </TouchableOpacity>

            {openRankingId === item.id && (
              <View style={{ marginTop: 8 }}>
                {rankingLoading === item.id ? (
                  <Text style={{ color: colors.textSecondary, fontSize: 13 }}>A carregar ranking...</Text>
                ) : rankings[item.id]?.length ? (
                  rankings[item.id].map((r: any, i: number) => (
                    <View
                      key={r.userId}
                      style={[
                        styles.rankRow,
                        { borderColor: colors.border },
                        user && r.userId === user.id && { backgroundColor: colors.primary + '10' },
                      ]}
                    >
                      <Text style={{ color: colors.textSecondary, width: 24 }}>{i + 1}.</Text>
                      <Text style={{ color: colors.text, flex: 1 }}>{r.name}</Text>
                      <Text style={{ color: colors.text, fontWeight: '700' }}>{r.points} pts</Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Ainda ninguém jogou este quiz.</Text>
                )}
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: colors.textSecondary }}>Ainda não há quizzes disponíveis.</Text>}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { ...Typography.presets.h2, marginBottom: 4 },
  subtitle: { ...Typography.presets.body, marginBottom: 16 },
  card: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12 },
  cardImage: { width: 48, height: 48, borderRadius: 10, marginRight: 12 },
  cardTitle: { ...Typography.presets.h3, marginBottom: 4 },
  rankingToggle: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  rankRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, paddingVertical: 6 },
});
