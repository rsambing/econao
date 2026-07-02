import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { useAuth } from '../../contexts/AuthContext';
import { BumbarButton } from '../../components';

export default function ProfileScreen() {
  const { colors } = useBumbarTheme();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.guestContent}>
          <Ionicons name="person-circle-outline" size={80} color={colors.textSecondary} />
          <Text style={[styles.name, { color: colors.text, marginTop: 12 }]}>Não autenticado</Text>
          <Text style={{ color: colors.textSecondary, textAlign: 'center', marginBottom: 24 }}>
            Entra ou cria uma conta para comentar, responder no fórum e responder quizzes.
          </Text>
          <BumbarButton title="Entrar" onPress={() => router.push('/login')} variant="primary" size="large" fullWidth />
          <View style={{ height: 12 }} />
          <BumbarButton title="Criar conta" onPress={() => router.push('/register')} variant="secondary" size="large" fullWidth />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name="person" size={60} color={colors.primary} />
        </View>

        <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>

        <View style={[styles.infoCard, { backgroundColor: colors.backgroundSecondary }]}>
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>{user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark" size={20} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>Papel: {user.role}</Text>
          </View>
        </View>

        <BumbarButton title="Sair" onPress={handleLogout} variant="danger" size="large" fullWidth />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  guestContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  scrollContent: { padding: 24, alignItems: 'center' },
  avatarContainer: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  infoCard: { width: '100%', padding: 20, borderRadius: 12, marginBottom: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoText: { fontSize: 15, marginLeft: 12 },
});
