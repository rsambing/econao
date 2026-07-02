/**
 * components/BumbarOutlinedInput.tsx
 * Input com borda contornada e Floating Label animado
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBumbarTheme } from '../hooks/useBumbarTheme';

interface BumbarOutlinedInputProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.prototype.components;
  rightIcon?: keyof typeof Ionicons.prototype.components;
  onRightIconPress?: () => void;
}

export const BumbarOutlinedInput: React.FC<BumbarOutlinedInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const { colors, isDark } = useBumbarTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  // Valor 0 para posição central (default), 1 para posição superior (active)
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: (isFocused || value) ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // Necessário false para animar propriedades de layout como top e fontSize
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute' as const,
    left: leftIcon ? 44 : 16,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -10], // Move de dentro para cima da borda
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12], // Reduz o tamanho
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        colors.textSecondary,
        error ? colors.error || '#FF3B30' : colors.primary
      ],
    }),
    paddingHorizontal: 4,
    backgroundColor: colors.card, // Fundo sólido para "cortar" a linha da borda
    zIndex: 1,
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error 
              ? (colors.error || '#FF3B30') 
              : isFocused 
                ? colors.primary 
                : colors.border,
            backgroundColor: colors.card,
          },
        ]}
      >
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>

        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={isFocused ? colors.primary : colors.textSecondary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            { color: colors.text },
            leftIcon ? { paddingLeft: 0 } : { paddingLeft: 12 },
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons
              name={rightIcon as any}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.errorText, { color: colors.error || '#FF3B30' }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    height: 56,
    position: 'relative',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingRight: 12,
    fontSize: 16,
  },
  leftIcon: {
    paddingHorizontal: 12,
  },
  rightIcon: {
    paddingHorizontal: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
