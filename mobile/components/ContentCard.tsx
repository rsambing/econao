/**
 * components/ContentCard.tsx
 * Card de conteúdo com foto de fundo escurecida (paridade com o web):
 * capa em ImageBackground, gradiente inferior, badges de tipo/região/Jindungo,
 * título, tema e botão branco sobreposto.
 */

import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBumbarTheme } from '../hooks/useBumbarTheme';
import { Typography } from '../constants/Typography';

const TYPE_LABEL: Record<string, string> = { VIDEO: 'Vídeo', TEXT: 'Texto', PODCAST: 'Podcast' };
const TYPE_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  VIDEO: 'play',
  TEXT: 'document-text',
  PODCAST: 'headset',
};

interface ContentCardProps {
  item: {
    id: number;
    type: string;
    title: string;
    theme: string;
    region?: string | null;
    imageUrl?: string | null;
    isExclusive?: boolean;
  };
  onPress: () => void;
}

export default function ContentCard({ item, onPress }: ContentCardProps) {
  const { colors } = useBumbarTheme();
  const typeIcon = TYPE_ICON[item.type] || 'document-text';

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      <ImageBackground
        source={item.imageUrl ? { uri: item.imageUrl } : undefined}
        style={[styles.image, { backgroundColor: colors.primary }]}
        imageStyle={styles.imageRadius}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.88)']}
          locations={[0, 0.32, 1]}
          style={styles.overlay}
        >
          <View style={styles.badgeRow}>
            <View style={styles.chip}>
              <Ionicons name={typeIcon} size={12} color="#fff" />
              <Text style={styles.chipText}>{TYPE_LABEL[item.type] || item.type}</Text>
            </View>
            {!!item.region && (
              <View style={styles.chip}>
                <Ionicons name="location" size={12} color="#fff" />
                <Text style={styles.chipText}>{item.region}</Text>
              </View>
            )}
            {item.isExclusive && (
              <View style={[styles.chip, styles.chipJindungo]}>
                <Ionicons name="flame" size={12} color="#fff" />
                <Text style={styles.chipText}>Jindungo</Text>
              </View>
            )}
          </View>

          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.theme} numberOfLines={1}>{item.theme}</Text>

          <TouchableOpacity onPress={onPress} style={styles.button} activeOpacity={0.8}>
            <Text style={[styles.buttonText, { color: colors.text }]}>Explorar conteúdo</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 20, borderRadius: 18, overflow: 'hidden' },
  image: { width: '100%', height: 260, justifyContent: 'flex-end' },
  imageRadius: { borderRadius: 18 },
  overlay: { flex: 1, justifyContent: 'flex-end', padding: 16 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipJindungo: { backgroundColor: '#e8590c' },
  chipText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  title: { ...Typography.presets.h3, color: '#fff', marginBottom: 4 },
  theme: { ...Typography.presets.label, color: 'rgba(255,255,255,0.9)', marginBottom: 12 },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  buttonText: { fontWeight: '700', fontSize: 14 },
});
