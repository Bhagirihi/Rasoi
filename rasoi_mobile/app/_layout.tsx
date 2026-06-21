import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { LogBox, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import { enableScreens } from 'react-native-screens';

enableScreens(true);

import LaunchSplash, { LAUNCH_SPLASH_DURATION_MS } from '@/components/LaunchSplash';
import AppDialogHost from '@/components/AppDialogHost';
import TrialExpiredPaywallModal from '@/components/paywall/TrialExpiredPaywallModal';
import TrialEndingSoonModal from '@/components/paywall/TrialEndingSoonModal';
import EmailVerificationBridge from '@/components/auth/EmailVerificationBridge';
import NotificationNavigationBridge from '@/components/NotificationNavigationBridge';
import LocationSyncBridge from '@/components/LocationSyncBridge';
import RevenueCatBridge from '@/components/RevenueCatBridge';
import { AppProvider } from '@/context/AppContext';
import { AppDialogProvider } from '@/context/AppDialogContext';
import { PartnersProvider } from '@/context/PartnersContext';
import { ReferenceProvider } from '@/context/ReferenceContext';
import { RecipesProvider } from '@/context/RecipesContext';
import { TonightRecipesProvider } from '@/context/TonightRecipesContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { initializeMobileAds } from '@/utils/admob';
import { ensureTelemetryStarted } from '@/utils/telemetry';
import { Sentry } from '@/utils/sentry';
import { warmRasoiRealtime } from '@/utils/realtime';
import { warmSupabaseClient } from '@/utils/supabase';

warmSupabaseClient();
warmRasoiRealtime();

if (__DEV__) {
  LogBox.ignoreLogs([
    '`expo-notifications` functionality is not fully supported in Expo Go',
    'expo-notifications: Android Push notifications (remote notifications) functionality',
  ]);
}

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
    void ensureTelemetryStarted().catch(() => undefined);
    void initializeMobileAds().catch(() => undefined);
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
            <TonightRecipesProvider>
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
                        gestureEnabled: true,
                        fullScreenGestureEnabled: true,
                      }}
                    />
                    <Stack.Screen
                      name="paywall"
                      options={{
                        presentation: 'card',
                        animation: 'slide_from_right',
                        gestureEnabled: true,
                        fullScreenGestureEnabled: true,
                      }}
                    />
                  </Stack>
                  {!launchDone && <LaunchSplash />}
                  <NotificationNavigationBridge />
                  <LocationSyncBridge />
                  <RevenueCatBridge />
                  <AppDialogHost />
                  <TrialEndingSoonModal />
                  <TrialExpiredPaywallModal />
                  <EmailVerificationBridge />
                </View>
              </PartnersProvider>
              </AppDialogProvider>
            </TonightRecipesProvider>
          </AppProvider>
        </ReferenceProvider>
      </RecipesProvider>
    </SafeAreaProvider>
  );
}
