import { Redirect, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppSavingOverlay from '@/components/AppSavingOverlay';
import TrialWelcomeContent from '@/components/TrialWelcomeContent';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import { colors, scrollIndicator } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { useAppContext } from '@/context/AppContext';
import { getTrialTotalDays } from '@/utils/planLogic';

export default function TrialWelcomeScreen() {
  const router = useRouter();
  const {
    isHydrated,
    isLoggedIn,
    pendingTrialWelcome,
    dismissTrialWelcome,
    upgradeToPaid,
    startTrial,
    effectiveTier,
    trialBonusDays,
  } = useAppContext();

  if (!isHydrated) {
    return (
      <View style={styles.loading}>
        <AppSavingOverlay
          visible
          steps={[
            { message: 'Opening Rasoi…', subtitle: 'Loading your kitchen' },
            { message: 'Preparing your trial…', subtitle: 'Just a moment' },
          ]}
        />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!pendingTrialWelcome) {
    return <Redirect href="/(tabs)" />;
  }

  const trialStarted = effectiveTier === 'trial';
  const trialDays = getTrialTotalDays(trialBonusDays);

  const finishWelcome = () => {
    dismissTrialWelcome();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']} testID={testIds.screenTrialWelcome}>
      <ScrollViewWithFloatingIndicator
        {...scrollIndicator}
        contentContainerStyle={styles.scrollContent}
      >
        <TrialWelcomeContent
          trialStarted={trialStarted}
          trialDays={trialDays}
          onContinueTrial={async () => {
            if (!trialStarted) {
              await startTrial();
            }
            finishWelcome();
          }}
          onSubscribe={async (interval) => {
            const result = await upgradeToPaid(interval);
            if (result.ok) {
              finishWelcome();
            }
          }}
        />
      </ScrollViewWithFloatingIndicator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.bg,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
