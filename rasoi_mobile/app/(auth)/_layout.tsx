import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.cream, flex: 1 },
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="onboarding"
        options={{ gestureEnabled: false, contentStyle: { backgroundColor: colors.dark.bg, flex: 1 } }}
      />
      <Stack.Screen name="login" options={{ gestureEnabled: false }} />
      <Stack.Screen name="register" options={{ gestureEnabled: false }} />
      <Stack.Screen name="trial-welcome" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
