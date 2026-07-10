import React from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, View, StyleSheet, ViewStyle } from 'react-native';

interface KeyboardDismissViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Envolve um ecrã com campos de texto: empurra o conteúdo para cima do
 * teclado no iOS (o Android já ajusta via `windowSoftInputMode` no
 * app.json) e fecha o teclado ao tocar fora de qualquer input.
 */
export default function KeyboardDismissView({ children, style }: KeyboardDismissViewProps) {
  return (
    <KeyboardAvoidingView
      style={[styles.flex, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.flex}>{children}</View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
