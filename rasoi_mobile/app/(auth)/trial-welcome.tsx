import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppSavingOverlay from '@/components/AppSavingOverlay';
import TrialWelcomeContent from '@/components/TrialWelcomeContent';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import { colors, scrollIndicator } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { useAppContext } from '@/context/AppContext';
import { isQaMonetizationPreview } from '@/constants/qaMonetization';

export default function TrialWelcomeScreen() {
  const router = useRouter();
  const { qa } = useLocalSearchParams<{ qa?: string }>();
  const qaPreview = isQaMonetizationPreview(qa);
  const {
    isHydrated,
    isLoggedIn,
    pendingTrialWelcome,
    dismissTrialWelcome,
    upgradeToPaid,
    startTrial,
    effectiveTier,
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

  if (!pendingTrialWelcome && !qaPreview) {
    return <Redirect href="/(tabs)" />;
  }

  const trialStarted = effectiveTier === 'trial';

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
          onContinueTrial={async () => {
            if (qaPreview) {
              router.back();
              return;
            }
            if (!trialStarted) {
              await startTrial();
            }
            finishWelcome();
          }}
          onSubscribe={async (interval) => {
            if (qaPreview) {
              router.back();
              return;
            }
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
    backgroundColor: colors.cream,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
