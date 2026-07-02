import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { listQuizzes } from '../../services/quiz';
import { BumbarButton } from '../../components';
import { Typography } from '../../constants/Typography';

export default function QuizzesScreen() {
  const { colors } = useBumbarTheme();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<any[]>([]);

  const load = useCallback(() => { listQuizzes().then(setQuizzes); }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Quiz Interactivo</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Testa os teus conhecimentos sobre economia e história angolana.
      </Text>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />}
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{item._count?.questions ?? 0} perguntas</Text>
            </View>
            <BumbarButton title="Iniciar" onPress={() => router.push(`/quiz/${item.id}`)} size="small" />
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: colors.textSecondary }}>Ainda não há quizzes disponíveis.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { ...Typography.presets.h2, marginBottom: 4 },
  subtitle: { ...Typography.presets.body, marginBottom: 16 },
  card: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardImage: { width: 48, height: 48, borderRadius: 10, marginRight: 12 },
  cardTitle: { ...Typography.presets.h3, marginBottom: 4 },
});
