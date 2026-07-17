import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppSavingOverlay from '@/components/AppSavingOverlay';
import AuthAtmosphere, { AUTH_ATMOSPHERE_BG } from '@/components/AuthAtmosphere';
import TrialWelcomeContent from '@/components/TrialWelcomeContent';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import { getEffectivePaymentProviderId } from '@/constants/payments';
import { colors, layout, scrollIndicator, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { useAppContext } from '@/context/AppContext';
import { isQaMonetizationPreview } from '@/constants/qaMonetization';
import { useRevenueCatPricing } from '@/hooks/useRevenueCatPricing';
import { getTrialTotalDays } from '@/utils/planLogic';

export default function TrialWelcomeScreen() {
  const router = useRouter();
  const { qa } = useLocalSearchParams<{ qa?: string }>();
  const qaPreview = isQaMonetizationPreview(qa);
  const {
    isHydrated,
    isLoggedIn,
    pendingTrialWelcome,
    pendingPantrySetup,
    dismissTrialWelcome,
    upgradeToPaid,
    startTrial,
    effectiveTier,
    paymentsEnabled,
    trialBonusDays,
  } = useAppContext();

  const fetchStorePrices =
    paymentsEnabled && getEffectivePaymentProviderId() === 'revenuecat';
  const { pricing, loading: pricingLoading, storeReady } = useRevenueCatPricing(fetchStorePrices);

  const trialStarted = effectiveTier === 'trial';
  const trialDays = getTrialTotalDays(trialBonusDays);

  const finishWelcome = useCallback(() => {
    dismissTrialWelcome();
    router.replace(pendingPantrySetup ? '/(tabs)/pantry' : '/(tabs)');
  }, [dismissTrialWelcome, pendingPantrySetup, router]);

  const handleBack = useCallback(() => {
    if (qaPreview) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
      return;
    }
    finishWelcome();
  }, [finishWelcome, qaPreview, router]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBack();
      return true;
    });
    return () => sub.remove();
  }, [handleBack]);

  if (!isHydrated) {
    return (
      <View style={styles.loading}>
        <AuthAtmosphere />
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
    return <Redirect href={pendingPantrySetup ? '/(tabs)/pantry' : '/(tabs)'} />;
  }

  return (
    <View style={styles.root}>
      <AuthAtmosphere />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']} testID={testIds.screenTrialWelcome}>
        <View style={styles.topBar}>
          <Pressable
            onPress={handleBack}
            hitSlop={12}
            style={styles.backBtn}
            testID={testIds.trialWelcomeBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color={colors.dark.text} />
          </Pressable>
          <Text style={styles.topTitle}>Rasoi Plus</Text>
          <View style={styles.backBtn} />
        </View>

        {pricingLoading && fetchStorePrices ? (
          <View style={styles.pricingBanner}>
            <ActivityIndicator color={colors.primary} size="small" />
            <Text style={styles.pricingBannerText}>Loading prices from the store…</Text>
          </View>
        ) : null}

        <ScrollViewWithFloatingIndicator
          {...scrollIndicator}
          contentContainerStyle={styles.scrollContent}
        >
          <TrialWelcomeContent
            trialStarted={trialStarted}
            trialDays={trialDays}
            storePricing={storeReady ? pricing : null}
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AUTH_ATMOSPHERE_BG,
  },
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.dark.text,
  },
  pricingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.sm,
  },
  pricingBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark.textMuted,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AUTH_ATMOSPHERE_BG,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
