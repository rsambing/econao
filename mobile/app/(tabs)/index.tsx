import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { listContent } from '../../services/content';
import { Typography } from '../../constants/Typography';

const TYPE_LABEL: Record<string, string> = { VIDEO: 'Vídeo', TEXT: 'Texto', PODCAST: 'Podcast' };

export default function ExploreScreen() {
  const { colors } = useBumbarTheme();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    setRefreshing(true);
    listContent()
      .then(setItems)
      .finally(() => setRefreshing(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Explorar Conteúdos</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Vídeos, textos e podcasts sobre economia e história de Angola.
      </Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} tintColor={colors.primary} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push(`/content/${item.id}`)}
          >
            <Text style={[styles.badge, { color: colors.primary, backgroundColor: colors.primary + '20' }]}>
              {TYPE_LABEL[item.type] || item.type}
            </Text>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.cardTheme, { color: colors.textSecondary }]}>{item.theme}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ color: colors.textSecondary }}>Ainda não há conteúdos publicados.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { ...Typography.presets.h2, marginBottom: 4 },
  subtitle: { ...Typography.presets.body, marginBottom: 16 },
  card: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12 },
  badge: { alignSelf: 'flex-start', fontSize: 12, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, marginBottom: 8 },
  cardTitle: { ...Typography.presets.h3, marginBottom: 4 },
  cardTheme: { ...Typography.presets.label },
});
