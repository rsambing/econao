import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBumbarTheme } from '../../hooks/useBumbarTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const { colors } = useBumbarTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Explorar',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'compass' : 'compass-outline'} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="quiz"
          options={{
            title: 'Quiz',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'help-circle' : 'help-circle-outline'} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="forum"
          options={{
            title: 'Fórum',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
