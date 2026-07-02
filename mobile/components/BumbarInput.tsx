/**
 * BumbarInput.tsx
 * Input padrão do design system Bumbar
 * Data: 26 Dez 2025
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBumbarTheme } from '../hooks/useBumbarTheme';
import { Typography } from '../constants/Typography';

interface BumbarInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export const BumbarInput: React.FC<BumbarInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  style,
  ...props
}) => {
  const { colors } = useBumbarTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = secureTextEntry === true;
  const actualSecureTextEntry = isPassword && !isPasswordVisible;

  const handleRightIconPress = () => {
    if (isPassword) {
      setIsPasswordVisible(!isPasswordVisible);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const getRightIcon = () => {
    if (isPassword) {
      return isPasswordVisible ? 'eye-off-outline' : 'eye-outline';
    }
    return rightIcon;
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
            backgroundColor: colors.backgroundSecondary,
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={colors.textSecondary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            { color: colors.text },
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || isPassword) && styles.inputWithRightIcon,
            style,
          ]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={actualSecureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {(rightIcon || isPassword) && (
          <TouchableOpacity
            onPress={handleRightIconPress}
            style={styles.rightIcon}
          >
            <Ionicons
              name={getRightIcon() as any}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...Typography.presets.label,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    ...Typography.presets.body,
    paddingVertical: 14,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    padding: 4,
    marginLeft: 4,
  },
  error: {
    ...Typography.presets.label,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
});
