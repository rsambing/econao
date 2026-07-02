/**
 * BumbarButton.tsx
 * Botão padrão do design system Bumbar (sem gradientes)
 * Data: 26 Dez 2025
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useBumbarTheme } from '../hooks/useBumbarTheme';
import { Typography } from '../constants/Typography';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface BumbarButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const BumbarButton: React.FC<BumbarButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}) => {
  const { colors } = useBumbarTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: { paddingVertical: 8, paddingHorizontal: 16 },
      medium: { paddingVertical: 12, paddingHorizontal: 24 },
      large: { paddingVertical: 16, paddingHorizontal: 32 },
    };

    // Variant
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: disabled ? colors.border : colors.primary,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: disabled ? colors.border : colors.primary,
      },
      tertiary: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: disabled ? colors.border : colors.error,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<ButtonSize, TextStyle> = {
      small: Typography.presets.label,
      medium: Typography.presets.cta,
      large: Typography.presets.cta,
    };

    const variantStyles: Record<ButtonVariant, TextStyle> = {
      primary: { color: colors.textInverse },
      secondary: { color: disabled ? colors.border : colors.primary },
      tertiary: { color: disabled ? colors.border : colors.primary },
      danger: { color: colors.textInverse },
    };

    return {
      fontWeight: '600',
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' || variant === 'tertiary' ? colors.primary : colors.textInverse}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
