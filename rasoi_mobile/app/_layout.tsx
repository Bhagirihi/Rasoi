import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import LaunchSplash, { LAUNCH_SPLASH_DURATION_MS } from '@/components/LaunchSplash';
import AppDialogHost from '@/components/AppDialogHost';
import NotificationNavigationBridge from '@/components/NotificationNavigationBridge';
import { AppProvider } from '@/context/AppContext';
import { AppDialogProvider } from '@/context/AppDialogContext';
import { PartnersProvider } from '@/context/PartnersContext';
import { ReferenceProvider } from '@/context/ReferenceContext';
import { RecipesProvider } from '@/context/RecipesContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { isAdMobNativeAvailable } from '@/utils/admob';
import { initSentry, Sentry } from '@/utils/sentry';

initSentry();

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export const unstable_settings = {
  initialRouteName: 'index',
};

export default Sentry.wrap(function RootLayout() {
  const [launchDone, setLaunchDone] = useState(false);

  return (
    <ThemeProvider>
      <RootLayoutInner launchDone={launchDone} setLaunchDone={setLaunchDone} />
    </ThemeProvider>
  );
});

function RootLayoutInner({
  launchDone,
  setLaunchDone,
}: {
  launchDone: boolean;
  setLaunchDone: (value: boolean) => void;
}) {
  const { colors, isDark } = useTheme();

  useEffect(() => {
    if (!isAdMobNativeAvailable()) return;
    void import('react-native-google-mobile-ads')
      .then(({ default: mobileAds }) => mobileAds().initialize())
      .catch(() => undefined);
  }, []);

  const finishLaunchSplash = useCallback(async () => {
    setLaunchDone(true);
    await SplashScreen.hideAsync().catch(() => undefined);
  }, [setLaunchDone]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void finishLaunchSplash();
    }, LAUNCH_SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [finishLaunchSplash]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <RecipesProvider>
        <ReferenceProvider>
          <AppProvider>
            <AppDialogProvider>
              <PartnersProvider>
                <View style={{ flex: 1, backgroundColor: colors.cream }}>
                  <StatusBar style={launchDone ? (isDark ? 'light' : 'dark') : 'light'} />
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: { backgroundColor: colors.cream, flex: 1 },
                    }}
                  >
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen
                      name="recipe/[id]"
                      options={{
                        presentation: 'card',
                        animation: 'slide_from_right',
                      }}
                    />
                  </Stack>
                  {!launchDone && <LaunchSplash />}
                  <NotificationNavigationBridge />
                  <AppDialogHost />
                </View>
              </PartnersProvider>
            </AppDialogProvider>
          </AppProvider>
        </ReferenceProvider>
      </RecipesProvider>
    </SafeAreaProvider>
  );
}
