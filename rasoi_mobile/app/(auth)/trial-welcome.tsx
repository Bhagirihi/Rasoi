import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TrialWelcomeContent from '@/components/TrialWelcomeContent';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import { colors, scrollIndicator } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';

export default function TrialWelcomeScreen() {
  const router = useRouter();
  const {
    isHydrated,
    isLoggedIn,
    pendingTrialWelcome,
    dismissTrialWelcome,
    upgradeToPaid,
  } = useAppContext();

  if (!isHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!pendingTrialWelcome) {
    return <Redirect href="/(tabs)" />;
  }

  const finishWelcome = () => {
    dismissTrialWelcome();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollViewWithFloatingIndicator
        {...scrollIndicator}
        contentContainerStyle={styles.scrollContent}
        floatingLabel="See plans"
      >
        <TrialWelcomeContent
          onContinueTrial={finishWelcome}
          onSubscribe={async (interval) => {
            await upgradeToPaid(interval);
            finishWelcome();
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
