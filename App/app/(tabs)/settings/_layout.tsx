import { Stack } from 'expo-router';

import { useTheme } from '@/context/ThemeContext';

export default function SettingsLayout() {
  const { screenBackground } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: screenBackground },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="edit-diet" />
      <Stack.Screen name="edit-kitchen-styles" />
      <Stack.Screen name="edit-preferences" />
      <Stack.Screen name="feedback" />
    </Stack>
  );
}
