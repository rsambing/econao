/**
 * components/BumbarBackButton.tsx
 * Botão Voltar premium inspirado no estilo Get Started deslizante.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useBumbarTheme } from '../hooks/useBumbarTheme';
import { Typography } from '../constants/Typography';

interface BumbarBackButtonProps {
  label?: string;
  light?: boolean;
  onPress?: () => void;
}

export const BumbarBackButton: React.FC<BumbarBackButtonProps> = ({ 
  label = 'Voltar',
  light = false,
  onPress
}) => {
  const { colors } = useBumbarTheme();
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  const backgroundColor = light ? 'rgba(255,255,255,0.1)' : colors.backgroundSecondary;
  const capsuleColor = light ? '#FFF' : colors.background;
  const textColor = light ? '#FFF' : colors.text;

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={[styles.pill, { backgroundColor }]}>
        <View style={[styles.textCapsule, { backgroundColor: capsuleColor }]}>
          <Text style={[styles.label, { color: textColor }]}>
            {label}
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons name="arrow-back" size={20} color={light ? '#FFF' : colors.text} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 4,
    minWidth: 140,
    alignSelf: 'flex-start',
  },
  textCapsule: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    ...Typography.presets.body,
    fontWeight: '700',
  },
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
