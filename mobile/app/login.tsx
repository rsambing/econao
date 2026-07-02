import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useBumbarTheme } from '../hooks/useBumbarTheme';
import { useAuth } from '../contexts/AuthContext';
import { BumbarButton, BumbarOutlinedInput } from '../components';
import { Typography } from '../constants/Typography';

export default function LoginScreen() {
  const { colors } = useBumbarTheme();
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login(email, password);
      router.back();
    } catch (error: any) {
      Alert.alert('Erro ao entrar', error.message || 'Não foi possível fazer login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={require('../assets/logo-wordmark.png')} style={styles.logo} resizeMode="contain" />
      <Text style={[styles.title, { color: colors.text }]}>Entrar</Text>
      <BumbarOutlinedInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        leftIcon="mail-outline"
      />
      <View style={{ height: 12 }} />
      <BumbarOutlinedInput
        label="Palavra-passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        leftIcon="lock-closed-outline"
        rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
        onRightIconPress={() => setShowPassword(!showPassword)}
      />
      <View style={{ height: 20 }} />
      <BumbarButton title="Entrar" onPress={handleLogin} loading={isLoading} variant="primary" size="large" fullWidth />
      <View style={{ height: 16 }} />
      <BumbarButton title="Ainda não tenho conta" onPress={() => router.replace('/register')} variant="tertiary" size="medium" fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  logo: { width: 200, height: 82, alignSelf: 'center', marginBottom: 16 },
  title: { ...Typography.presets.h1, marginBottom: 24, textAlign: 'center' },
});
