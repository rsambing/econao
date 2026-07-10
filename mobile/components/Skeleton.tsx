/**
 * components/Skeleton.tsx
 * Placeholder de carregamento (shimmer) para listas — usado enquanto os
 * dados ainda não chegaram da API, em vez de mostrar um ecrã vazio.
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useBumbarTheme } from '../hooks/useBumbarTheme';

interface SkeletonBlockProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonBlock({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonBlockProps) {
  const { colors } = useBumbarTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: colors.backgroundSecondary, opacity },
        style,
      ]}
    />
  );
}

/** Skeleton de um card de conteúdo (mesmas proporções do ContentCard real). */
export function ContentCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonBlock height={220} borderRadius={18} />
      <View style={{ marginTop: 10 }}>
        <SkeletonBlock width="60%" height={14} style={{ marginBottom: 8 }} />
        <SkeletonBlock width="90%" height={20} style={{ marginBottom: 6 }} />
        <SkeletonBlock width="40%" height={14} />
      </View>
    </View>
  );
}

/** Lista de skeletons de cards, para usar como estado de carregamento inicial. */
export function ContentListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <ContentCardSkeleton key={i} />
      ))}
    </View>
  );
}

/** Skeleton de uma linha (usado em listas em linha: fórum, quizzes). */
export function RowSkeleton() {
  const { colors } = useBumbarTheme();
  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      <SkeletonBlock width={48} height={48} borderRadius={10} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <SkeletonBlock width="70%" height={16} style={{ marginBottom: 8 }} />
        <SkeletonBlock width="40%" height={12} />
      </View>
    </View>
  );
}

export function RowListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <RowSkeleton key={i} />
      ))}
    </View>
  );
}

/** Skeleton de um ecrã de detalhe (conteúdo, tópico do fórum, quiz). */
export function DetailSkeleton() {
  return (
    <View style={styles.detail}>
      <SkeletonBlock width={90} height={20} borderRadius={999} style={{ marginBottom: 14 }} />
      <SkeletonBlock width="85%" height={26} style={{ marginBottom: 8 }} />
      <SkeletonBlock width="45%" height={14} style={{ marginBottom: 20 }} />
      <SkeletonBlock height={200} borderRadius={14} style={{ marginBottom: 20 }} />
      <SkeletonBlock height={14} style={{ marginBottom: 8 }} />
      <SkeletonBlock height={14} style={{ marginBottom: 8 }} />
      <SkeletonBlock width="70%" height={14} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 20 },
  detail: { padding: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
});
