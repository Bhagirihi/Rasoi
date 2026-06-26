import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import AppSavingOverlay from '@/components/AppSavingOverlay';
import { colors } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { hasLegalConsent, saveLegalConsent } from '@/utils/legalConsent';
import { shouldShowPermissionsOnboarding } from '@/utils/permissionsOnboarding';
import { ensureTelemetryStarted } from '@/utils/telemetry';

const BOOTSTRAP_STEPS = [
  { message: 'Opening Rasoi…', subtitle: 'Loading your kitchen' },
  { message: 'Syncing preferences…', subtitle: 'Just a moment' },
];

export default function Index() {
  const { isHydrated, hasCompletedOnboarding, isLoggedIn, pendingTrialWelcome, pendingPantrySetup, userCity } =
    useAppContext();
  const [legalReady, setLegalReady] = useState(false);
  const [legalConsented, setLegalConsented] = useState(false);
  const [permissionsReady, setPermissionsReady] = useState(false);
  const [needsPermissions, setNeedsPermissions] = useState(false);

  useEffect(() => {
    void (async () => {
      let consented = await hasLegalConsent();
      if (!consented && isHydrated && (isLoggedIn || hasCompletedOnboarding)) {
        await saveLegalConsent();
        consented = true;
      }
      setLegalConsented(consented);
      if (consented) {
        await ensureTelemetryStarted();
      }
      setLegalReady(true);
    })();
  }, [hasCompletedOnboarding, isHydrated, isLoggedIn]);

  useEffect(() => {
    if (!isHydrated || !isLoggedIn || !hasCompletedOnboarding) {
      setPermissionsReady(true);
      setNeedsPermissions(false);
      return;
    }
    void shouldShowPermissionsOnboarding(userCity).then((needs) => {
      setNeedsPermissions(needs);
      setPermissionsReady(true);
    });
  }, [hasCompletedOnboarding, isHydrated, isLoggedIn, userCity]);

  if (!legalReady || !isHydrated || (isLoggedIn && hasCompletedOnboarding && !permissionsReady)) {
    return (
      <View style={styles.loading}>
        <AppSavingOverlay visible steps={BOOTSTRAP_STEPS} />
      </View>
    );
  }

  if (!legalConsented) {
    return <Redirect href="/(auth)/legal-consent" />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (needsPermissions) {
    return <Redirect href="/(auth)/onboarding?permissionsOnly=1" />;
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
