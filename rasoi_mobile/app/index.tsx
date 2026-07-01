import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import AppSavingOverlay from '@/components/AppSavingOverlay';
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

const BOOTSTRAP_STEPS = [
  { message: 'Opening Rasoi…', subtitle: 'Loading your kitchen' },
  { message: 'Syncing preferences…', subtitle: 'Just a moment' },
];

export default function Index() {
  const {
    isHydrated,
    hasCompletedOnboarding,
    isLoggedIn,
    pendingTrialWelcome,
    pendingPantrySetup,
    userCity,
    loginAsGuest,
  } = useAppContext();
  const [legalReady, setLegalReady] = useState(false);
  const [permissionsReady, setPermissionsReady] = useState(false);
  const [permissionsRedirect, setPermissionsRedirect] = useState<string | null>(null);
  const [guestAttempted, setGuestAttempted] = useState(false);
  const [guestRouteReady, setGuestRouteReady] = useState(false);
  const [guestBootstrapHref, setGuestBootstrapHref] = useState<string | null>(null);

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
    if (!legalReady || !isHydrated || isLoggedIn || guestAttempted) return;

    let cancelled = false;
    void (async () => {
      try {
        await loginAsGuest();
      } catch {
        // User can sign in manually on the login screen.
      } finally {
        if (!cancelled) setGuestAttempted(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [guestAttempted, isHydrated, isLoggedIn, legalReady, loginAsGuest]);

  useEffect(() => {
    if (!isHydrated || !isLoggedIn || hasCompletedOnboarding) {
      setGuestRouteReady(true);
      setGuestBootstrapHref(null);
      return;
    }

    let cancelled = false;
    void (async () => {
      const legalDone = await hasLegalConsent();
      if (cancelled) return;
      setGuestBootstrapHref(
        legalDone ? '/(auth)/onboarding' : '/(auth)/legal-consent?from=guest',
      );
      setGuestRouteReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [hasCompletedOnboarding, isHydrated, isLoggedIn]);

  const bootstrappingGuest = legalReady && isHydrated && !isLoggedIn && !guestAttempted;
  const bootstrappingGuestRoute =
    isLoggedIn && !hasCompletedOnboarding && !guestRouteReady;

  if (
    !legalReady ||
    !isHydrated ||
    bootstrappingGuest ||
    bootstrappingGuestRoute ||
    (isLoggedIn && hasCompletedOnboarding && !permissionsReady)
  ) {
    return (
      <View style={styles.loading}>
        <AppSavingOverlay visible steps={BOOTSTRAP_STEPS} />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!hasCompletedOnboarding && guestBootstrapHref) {
    return <Redirect href={guestBootstrapHref} />;
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
