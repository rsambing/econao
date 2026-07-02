import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBumbarTheme } from '../hooks/useBumbarTheme';
import { BumbarButton, BumbarOutlinedInput } from '../components';
import { forgotPassword } from '../services/auth';
import { Typography } from '../constants/Typography';

export default function ForgotPasswordScreen() {
  const { colors } = useBumbarTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Não foi possível enviar o email.');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Verifica o teu email</Text>
        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: 24 }}>
          Se existir uma conta com o email {email}, enviámos um link para redefinires a senha no browser.
        </Text>
        <BumbarButton title="Voltar ao login" onPress={() => router.replace('/login')} variant="primary" size="large" fullWidth />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Esqueci-me da senha</Text>
      <Text style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: 24 }}>
        Indica o teu email e enviamos-te um link para definires uma nova senha.
      </Text>
      <BumbarOutlinedInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        leftIcon="mail-outline"
      />
      {!!error && <Text style={{ color: colors.error, marginTop: 8 }}>{error}</Text>}
      <View style={{ height: 20 }} />
      <BumbarButton title="Enviar link de recuperação" onPress={handleSubmit} loading={isLoading} variant="primary" size="large" fullWidth />
      <View style={{ height: 12 }} />
      <BumbarButton title="Voltar ao login" onPress={() => router.back()} variant="tertiary" size="medium" fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { ...Typography.presets.h1, marginBottom: 12, textAlign: 'center' },
});
