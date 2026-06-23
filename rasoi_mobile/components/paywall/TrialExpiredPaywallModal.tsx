import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppSavingOverlay from '@/components/AppSavingOverlay';
import PaidPlanFeaturesList from '@/components/paywall/PaidPlanFeaturesList';
import PaywallActions from '@/components/paywall/PaywallActions';
import SmoothModal from '@/components/ui/SmoothModal';
import { type BillingInterval } from '@/constants/plans';
import { getEffectivePaymentProviderId } from '@/constants/payments';
import { colors, radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { usePaywall } from '@/hooks/usePaywall';
import { useRevenueCatPricing } from '@/hooks/useRevenueCatPricing';

let dismissedThisSession = false;

export function resetTrialExpiredPaywallSessionDismissal() {
  dismissedThisSession = false;
}

export default function TrialExpiredPaywallModal() {
  const insets = useSafeAreaInsets();
  const { showDialog } = useAppDialog();
  const {
    isHydrated,
    isLoggedIn,
    hasCompletedOnboarding,
    paymentsEnabled,
    showPaywall,
    trialExpired,
    effectiveTier,
    canStartTrial,
    yearlyPromoOfferTag,
    upgradeToPaid,
    restorePurchases,
    refreshPlan,
  } = useAppContext();

  const [visible, setVisible] = useState(false);
  const paywall = usePaywall({ upgradeToPaid, restorePurchases });
  const { pricing, loading: pricingLoading, storeReady } = useRevenueCatPricing(
    paymentsEnabled && getEffectivePaymentProviderId() === 'revenuecat',
  );

  const shouldOffer =
    isHydrated &&
    isLoggedIn &&
    hasCompletedOnboarding &&
    paymentsEnabled &&
    showPaywall &&
    trialExpired &&
    effectiveTier === 'free' &&
    !dismissedThisSession;

  useEffect(() => {
    if (!shouldOffer) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, [shouldOffer]);

  const closeModal = () => {
    dismissedThisSession = true;
    setVisible(false);
  };

  const handleSubscribe = async (interval: BillingInterval) => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const result = await paywall.purchasePlus(interval);
    if (!result.ok) {
      if (!result.cancelled) {
        showDialog({ title: 'Subscribe', message: result.error });
      }
      return;
    }
    await refreshPlan();
    showDialog({
      title: 'Welcome to Rasoi Plus',
      message: 'Ads removed and all partners unlocked.',
      buttons: [{ text: 'Great', onPress: closeModal }],
    });
    closeModal();
  };

  const handleRestore = async () => {
    const result = await paywall.restorePurchases();
    if (!result.ok) {
      showDialog({ title: 'Restore purchases', message: result.error });
      return;
    }
    await refreshPlan();
    showDialog({
      title: 'Restored',
      message: 'Your Rasoi Plus subscription is active.',
      buttons: [{ text: 'Continue', onPress: closeModal }],
    });
    closeModal();
  };

  const billingLabel =
    Platform.OS === 'ios' ? 'App Store' : Platform.OS === 'android' ? 'Google Play' : 'your store';

  return (
    <SmoothModal visible={visible} onClose={closeModal} variant="sheet" dismissOnBackdrop>
      <View style={[styles.sheet, { maxHeight: '92%' }]}>
        <AppSavingOverlay
          visible={paywall.isBusy}
          message="Opening checkout…"
          subtitle={`Confirm in ${billingLabel}`}
        />

        <View style={styles.handle} />

        <View style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Trial ended</Text>
            <Text style={styles.headerSub}>Subscribe to keep partner checkout unlocked</Text>
          </View>
          <Pressable onPress={closeModal} hitSlop={12} accessibilityLabel="Close paywall">
            <X size={22} color={colors.muted} />
          </Pressable>
        </View>

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + spacing.lg },
          ]}
        >
          <LinearGradient colors={['#FF6B35', '#FF9933']} style={styles.hero}>
            <View style={styles.heroIconWrap}>
              <Crown size={22} color={colors.white} />
            </View>
            <Text style={styles.heroTitle}>Partners are locked again</Text>
            <Text style={styles.heroSub}>
              Blinkit, Zepto, Instamart, Zomato & Swiggy need an active Rasoi Plus plan.
            </Text>
          </LinearGradient>

          <View style={styles.featuresWrap}>
            <PaidPlanFeaturesList />
          </View>

          {pricingLoading && getEffectivePaymentProviderId() === 'revenuecat' ? (
            <View style={styles.pricingLoading}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.pricingLoadingText}>Loading prices from {billingLabel}…</Text>
            </View>
          ) : (
            <PaywallActions
              effectiveTier={effectiveTier}
              trialExpired={trialExpired}
              canStartTrial={canStartTrial}
              isBusy={paywall.isBusy}
              paymentDisclaimer={paywall.paymentDisclaimer}
              providerLabel={paywall.providerLabel}
              providerId={paywall.providerId}
              supportsRestore={paywall.supportsRestore}
              lastError={paywall.lastError}
              yearlyPromoOfferTag={yearlyPromoOfferTag}
              storePricing={storeReady ? pricing : null}
              hideExpiredNote
              onStartTrial={() => undefined}
              onSubscribe={(interval) => void handleSubscribe(interval)}
              onRestore={() => void handleRestore()}
            />
          )}

          <Pressable onPress={closeModal} style={styles.laterBtn}>
            <Text style={styles.laterText}>Continue with ads for now</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SmoothModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.cream,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.12)',
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerTextWrap: {
    flex: 1,
    gap: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.charcoal,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    fontWeight: '600',
  },
  scroll: {
    flexShrink: 1,
  },
  scrollContent: {
    gap: spacing.md,
  },
  hero: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  heroIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
  },
  heroSub: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.92)',
  },
  featuresWrap: {
    marginTop: spacing.xs,
  },
  pricingLoading: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  pricingLoadingText: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '600',
  },
  laterBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  laterText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.muted,
  },
});
