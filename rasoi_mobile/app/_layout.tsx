import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { LogBox, View } from 'react-native';
import { useFonts, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import { enableScreens } from 'react-native-screens';

enableScreens(true);

import AnalyticsScreenBridge from '@/components/AnalyticsScreenBridge';
import AppCrashFallback from '@/components/AppCrashFallback';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import LaunchSplash from '@/components/LaunchSplash';
import LaunchSplashGate from '@/components/LaunchSplashGate';
import AppDialogHost from '@/components/AppDialogHost';
import TrialExpiredPaywallModal from '@/components/paywall/TrialExpiredPaywallModal';
import TrialEndingSoonModal from '@/components/paywall/TrialEndingSoonModal';
import EmailVerificationBridge from '@/components/auth/EmailVerificationBridge';
import ShoppingReturnSheet from '@/components/shopping/ShoppingReturnSheet';
import NotificationNavigationBridge from '@/components/NotificationNavigationBridge';
import LocationSyncBridge from '@/components/LocationSyncBridge';
import RevenueCatBridge from '@/components/RevenueCatBridge';
import { AppProvider } from '@/context/AppContext';
import { ShoppingSessionProvider } from '@/context/ShoppingSessionContext';
import { AppDialogProvider } from '@/context/AppDialogContext';
import { PartnersProvider } from '@/context/PartnersContext';
import { ReferenceProvider } from '@/context/ReferenceContext';
import { RecipesProvider } from '@/context/RecipesContext';
import { TonightRecipesProvider } from '@/context/TonightRecipesContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { initializeMobileAds } from '@/utils/admob';
import { warmApiConnection } from '@/utils/api';
import { checkForEasUpdateOnLaunch } from '@/utils/easUpdates';
import { ensureTelemetryStarted } from '@/utils/telemetry';
import { Sentry } from '@/utils/sentry';
import { warmRasoiRealtime } from '@/utils/realtime';
import { warmSupabaseClient } from '@/utils/supabase';

warmSupabaseClient();
warmRasoiRealtime();

if (__DEV__) {
  LogBox.ignoreAllLogs(true);
}

export { AppErrorBoundary as ErrorBoundary };

SplashScreen.preventAutoHideAsync().catch(() => undefined);

type GlobalBoundaryProps = {
  children: React.ReactNode;
};

/** Catches fatal JS errors outside React render (async, timers, event handlers). */
function AppGlobalErrorBoundary({ children }: GlobalBoundaryProps) {
  const GlobalBoundary = (
    Sentry as typeof Sentry & {
      GlobalErrorBoundary?: ComponentType<{
        fallback: (props: {
          error: Error;
          eventId: string;
          resetError: () => void;
        }) => ReactNode;
        children: ReactNode;
      }>;
    }
  ).GlobalErrorBoundary;

  if (!GlobalBoundary) {
    return children;
  }

  return (
    <GlobalBoundary
      fallback={({ error, eventId, resetError }) => (
        <AppCrashFallback
          error={error instanceof Error ? error : new Error(String(error))}
          eventId={eventId}
          reportSent
          onRetry={resetError}
        />
      )}
    >
      {children}
    </GlobalBoundary>
  );
}

export const unstable_settings = {
  initialRouteName: 'index',
};

export default Sentry.wrap(function RootLayout() {
  const [launchDone, setLaunchDone] = useState(false);
  const [splashDismissing, setSplashDismissing] = useState(false);

  return (
    <AppGlobalErrorBoundary>
      <ThemeProvider>
        <RootLayoutInner
          launchDone={launchDone}
          setLaunchDone={setLaunchDone}
          splashDismissing={splashDismissing}
          setSplashDismissing={setSplashDismissing}
        />
      </ThemeProvider>
    </AppGlobalErrorBoundary>
  );
});

function RootLayoutInner({
  launchDone,
  setLaunchDone,
  splashDismissing,
  setSplashDismissing,
}: {
  launchDone: boolean;
  setLaunchDone: (value: boolean) => void;
  splashDismissing: boolean;
  setSplashDismissing: (value: boolean) => void;
}) {
  const { colors, isDark } = useTheme();
  const [fontsLoaded] = useFonts({
    Fraunces_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    void ensureTelemetryStarted().catch(() => undefined);
    void initializeMobileAds().catch(() => undefined);
    warmApiConnection();
  }, []);

  // Defer OTA reload until after first paint so paid-ad cold starts stay fast.
  useEffect(() => {
    if (!launchDone) return;
    void checkForEasUpdateOnLaunch().catch(() => undefined);
  }, [launchDone]);

  const beginSplashDismiss = useCallback(() => {
    if (splashDismissing || launchDone) return;
    setSplashDismissing(true);
  }, [launchDone, setSplashDismissing, splashDismissing]);

  const finishLaunchSplash = useCallback(async () => {
    setLaunchDone(true);
    await SplashScreen.hideAsync().catch(() => undefined);
  }, [setLaunchDone]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <RecipesProvider>
        <ReferenceProvider>
          <AppProvider>
            <ShoppingSessionProvider>
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
                  {!launchDone && (
                    <LaunchSplash
                      dismissing={splashDismissing}
                      onDismissed={() => {
                        void finishLaunchSplash();
                      }}
                    />
                  )}
                  <LaunchSplashGate
                    fontsLoaded={fontsLoaded}
                    launchDone={launchDone}
                    splashDismissing={splashDismissing}
                    onReady={beginSplashDismiss}
                  />
                  <AnalyticsScreenBridge />
                  <NotificationNavigationBridge />
                  <LocationSyncBridge />
                  <RevenueCatBridge />
                  <AppDialogHost />
                  <TrialEndingSoonModal />
                  <TrialExpiredPaywallModal />
                  <EmailVerificationBridge />
                  <ShoppingReturnSheet />
                </View>
              </PartnersProvider>
              </AppDialogProvider>
            </TonightRecipesProvider>
            </ShoppingSessionProvider>
          </AppProvider>
        </ReferenceProvider>
      </RecipesProvider>
    </SafeAreaProvider>
  );
}
