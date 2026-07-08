import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { hasLegalConsent } from '@/utils/legalConsent';
import {
  getMissingPermissionsState,
  isPermissionsOnboardingComplete,
  markPermissionsOnboardingComplete,
  permissionsOnboardingHref,
} from '@/utils/permissionsOnboarding';
import { ensureTelemetryStarted } from '@/utils/telemetry';

export default function Index() {
  const {
    isHydrated,
    hasCompletedOnboarding,
    isLoggedIn,
    pendingTrialWelcome,
    pendingPantrySetup,
    userCity,
  } = useAppContext();
  const [legalReady, setLegalReady] = useState(false);
  const [permissionsReady, setPermissionsReady] = useState(false);
  const [permissionsRedirect, setPermissionsRedirect] = useState<string | null>(null);
  const [incompleteOnboardingReady, setIncompleteOnboardingReady] = useState(false);
  const [incompleteOnboardingHref, setIncompleteOnboardingHref] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      if (await hasLegalConsent()) {
        await ensureTelemetryStarted();
      }
      setLegalReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!isHydrated || !isLoggedIn || !hasCompletedOnboarding) {
      setPermissionsReady(true);
      setPermissionsRedirect(null);
      return;
    }
    void (async () => {
      if (await isPermissionsOnboardingComplete()) {
        setPermissionsRedirect(null);
        setPermissionsReady(true);
        return;
      }
      const state = await getMissingPermissionsState(userCity);
      if (!state.needsFlow) {
        await markPermissionsOnboardingComplete();
      }
      setPermissionsRedirect(
        state.needsFlow ? permissionsOnboardingHref(state.initialStep) : null,
      );
      setPermissionsReady(true);
    })();
  }, [hasCompletedOnboarding, isHydrated, isLoggedIn, userCity]);

  useEffect(() => {
    if (!isHydrated || !isLoggedIn || hasCompletedOnboarding) {
      setIncompleteOnboardingReady(true);
      setIncompleteOnboardingHref(null);
      return;
    }

    let cancelled = false;
    void (async () => {
      const legalDone = await hasLegalConsent();
      if (cancelled) return;
      setIncompleteOnboardingHref(
        legalDone ? '/(auth)/onboarding' : '/(auth)/legal-consent?from=register',
      );
      setIncompleteOnboardingReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [hasCompletedOnboarding, isHydrated, isLoggedIn]);

  const bootstrappingIncompleteOnboarding =
    isLoggedIn && !hasCompletedOnboarding && !incompleteOnboardingReady;

  if (
    !legalReady ||
    !isHydrated ||
    bootstrappingIncompleteOnboarding ||
    (isLoggedIn && hasCompletedOnboarding && !permissionsReady)
  ) {
    // LaunchSplash covers cold start — avoid mounting Reanimated overlay here
    // (fast hydration → login redirect was crashing Fabric on abrupt teardown).
    return <View style={styles.loading} />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!hasCompletedOnboarding && incompleteOnboardingHref) {
    return <Redirect href={incompleteOnboardingHref} />;
  }

  if (permissionsRedirect) {
    return <Redirect href={permissionsRedirect} />;
  }

  if (pendingPantrySetup) {
    return <Redirect href="/(tabs)/pantry" />;
  }

  if (pendingTrialWelcome) {
    return <Redirect href="/(auth)/trial-welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.cream,
  },
});
