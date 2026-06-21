import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import AppSavingOverlay from '@/components/AppSavingOverlay';
import { colors } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { hasLegalConsent, saveLegalConsent } from '@/utils/legalConsent';
import { ensureTelemetryStarted } from '@/utils/telemetry';

const BOOTSTRAP_STEPS = [
  { message: 'Opening Rasoi…', subtitle: 'Loading your kitchen' },
  { message: 'Syncing preferences…', subtitle: 'Just a moment' },
];

export default function Index() {
  const { isHydrated, hasCompletedOnboarding, isLoggedIn, pendingTrialWelcome } = useAppContext();
  const [legalReady, setLegalReady] = useState(false);
  const [legalConsented, setLegalConsented] = useState(false);

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

  if (!legalReady || !isHydrated) {
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
