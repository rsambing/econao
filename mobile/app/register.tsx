import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useBumbarTheme } from '../hooks/useBumbarTheme';
import { useAuth } from '../contexts/AuthContext';
import { BumbarButton, BumbarOutlinedInput } from '../components';
import KeyboardDismissView from '../components/KeyboardDismissView';
import { Typography } from '../constants/Typography';

export default function RegisterScreen() {
  const { colors } = useBumbarTheme();
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      await register(name, email, password);
      router.back();
    } catch (error: any) {
      Alert.alert('Erro ao registar', error.message || 'Não foi possível criar a conta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardDismissView style={{ backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={require('../assets/logo-wordmark.png')} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.title, { color: colors.text }]}>Criar conta</Text>
        <BumbarOutlinedInput label="Nome" value={name} onChangeText={setName} leftIcon="person-outline" />
        <View style={{ height: 12 }} />
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
        <BumbarButton title="Criar conta" onPress={handleRegister} loading={isLoading} variant="primary" size="large" fullWidth />
        <View style={{ height: 16 }} />
        <BumbarButton title="Já tenho conta" onPress={() => router.replace('/login')} variant="tertiary" size="medium" fullWidth />
      </ScrollView>
    </KeyboardDismissView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  logo: { width: 200, height: 82, alignSelf: 'center', marginBottom: 16 },
  title: { ...Typography.presets.h1, marginBottom: 24, textAlign: 'center' },
});
