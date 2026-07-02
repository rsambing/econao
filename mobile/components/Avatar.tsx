import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useBumbarTheme } from '../hooks/useBumbarTheme';

function getInitials(name?: string | null) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

interface AvatarProps {
  name?: string | null;
  url?: string | null;
  size?: number;
}

export default function Avatar({ name, url, size = 36 }: AvatarProps) {
  const { colors } = useBumbarTheme();
  const dim = { width: size, height: size, borderRadius: size / 2 };

  if (url) {
    return <Image source={{ uri: url }} style={[styles.image, dim]} />;
  }

  return (
    <View style={[styles.fallback, dim, { backgroundColor: colors.primary }]}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: Math.max(11, size * 0.4) }}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { resizeMode: 'cover' },
  fallback: { alignItems: 'center', justifyContent: 'center' },
});
