import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { SettingsProvider } from '../contexts/SettingsContext';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SettingsProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" options={{ presentation: 'modal', headerShown: true, title: 'Entrar' }} />
          <Stack.Screen name="register" options={{ presentation: 'modal', headerShown: true, title: 'Registar' }} />
          <Stack.Screen name="forgot-password" options={{ presentation: 'modal', headerShown: true, title: 'Recuperar senha' }} />
          <Stack.Screen name="content/[id]" options={{ headerShown: true, title: '' }} />
          <Stack.Screen name="quiz/[id]" options={{ headerShown: true, title: '' }} />
          <Stack.Screen name="forum/[id]" options={{ headerShown: true, title: '' }} />
          <Stack.Screen name="forum/new" options={{ presentation: 'modal', headerShown: true, title: 'Novo tópico' }} />
          <Stack.Screen name="user/[id]" options={{ headerShown: true, title: 'Perfil' }} />
          <Stack.Screen name="search" options={{ headerShown: true, title: 'Pesquisar' }} />
        </Stack>
      </AuthProvider>
    </SettingsProvider>
  );
}
