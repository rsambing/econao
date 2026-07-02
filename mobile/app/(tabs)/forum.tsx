import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { listTopics } from '../../services/forum';
import { Typography } from '../../constants/Typography';

export default function ForumScreen() {
  const { colors } = useBumbarTheme();
  const router = useRouter();
  const [topics, setTopics] = useState<any[]>([]);

  const load = useCallback(() => { listTopics().then(setTopics); }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Fórum de Discussão</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Debate temas de economia e história com a comunidade.
      </Text>
      <FlatList
        data={topics}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push(`/forum/${item.id}`)}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>
              por {item.author?.name} · {item._count?.replies ?? 0} respostas
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ color: colors.textSecondary }}>Ainda não há tópicos.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { ...Typography.presets.h2, marginBottom: 4 },
  subtitle: { ...Typography.presets.body, marginBottom: 16 },
  card: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12 },
  cardTitle: { ...Typography.presets.h3 },
});
