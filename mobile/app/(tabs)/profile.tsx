import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { useAuth } from '../../contexts/AuthContext';
import { BumbarButton } from '../../components';
import Avatar from '../../components/Avatar';
import { uploadMedia } from '../../services/upload';

export default function ProfileScreen() {
  const { colors } = useBumbarTheme();
  const router = useRouter();
  const { user, logout, updateProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleChangeAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Autoriza o acesso às fotos para definires um avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    const filename = asset.fileName || `avatar-${Date.now()}.jpg`;
    const mimeType = asset.mimeType || 'image/jpeg';

    setUploading(true);
    try {
      const avatarUrl = await uploadMedia(asset.uri, filename, mimeType);
      await updateProfile({ avatarUrl });
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível atualizar a foto.');
    } finally {
      setUploading(false);
    }
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
        <TouchableOpacity onPress={handleChangeAvatar} disabled={uploading} style={styles.avatarWrapper}>
          <Avatar name={user.name} url={user.avatarUrl} size={120} />
          <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
            {uploading ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="camera" size={16} color="#fff" />}
          </View>
        </TouchableOpacity>

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
  avatarWrapper: { marginBottom: 16 },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  infoCard: { width: '100%', padding: 20, borderRadius: 12, marginBottom: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoText: { fontSize: 15, marginLeft: 12 },
});
