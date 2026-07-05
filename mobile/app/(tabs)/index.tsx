import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { listContent } from '../../services/content';
import { Typography } from '../../constants/Typography';
import ContentCard from '../../components/ContentCard';
import { ContentListSkeleton } from '../../components/Skeleton';

export default function ExploreScreen() {
  const { colors } = useBumbarTheme();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback((isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    listContent()
      .then(setItems)
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Explorar Conteúdos</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Vídeos, textos e podcasts sobre economia e história de Angola.
      </Text>
      {loading ? (
        <ContentListSkeleton count={4} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <ContentCard item={item} onPress={() => router.push(`/content/${item.id}`)} />
          )}
          ListEmptyComponent={<Text style={{ color: colors.textSecondary }}>Ainda não há conteúdos publicados.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { ...Typography.presets.h2, marginBottom: 4 },
  subtitle: { ...Typography.presets.body, marginBottom: 16 },
});
