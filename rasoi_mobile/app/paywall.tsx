import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Crown, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import AdMobBanner from '@/components/AdMobBanner';
import AppSavingOverlay from '@/components/AppSavingOverlay';
import PaywallBenefitsStrip from '@/components/paywall/PaywallBenefitsStrip';
import PaywallCompareTable from '@/components/paywall/PaywallCompareTable';
import PaywallPricingSection from '@/components/paywall/PaywallPricingSection';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import { PLAN_LABELS, TRIAL_DURATION_DAYS, type BillingInterval } from '@/constants/plans';
import { colors, layout, radius, scrollIndicator, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { usePaywall } from '@/hooks/usePaywall';
import { useTrialClock } from '@/hooks/useTrialClock';

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    effectiveTier,
    trialStartedAt,
    canStartTrial,
    trialExpired,
    showPaywall,
    trialBonusDays,
    yearlyPromoOfferTag,
    startTrial,
    upgradeToPaid,
    restorePurchases,
    refreshPlan,
    redeemPromoCode,
    paymentsEnabled,
  } = useAppContext();
  const { trialTimeLabel } = useTrialClock(trialStartedAt, effectiveTier, trialBonusDays);
  const { showDialog } = useAppDialog();

  useEffect(() => {
    if (!showPaywall) {
      router.back();
    }
  }, [router, showPaywall]);

  const paywall = usePaywall({ upgradeToPaid, restorePurchases });

  const handleStartTrial = async () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await startTrial();
    await refreshPlan();
    showDialog({
      title: 'Trial started',
      message: `Enjoy partner checkout for ${TRIAL_DURATION_DAYS} days. Subscribe anytime to keep access ad-free.`,
    });
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
    showDialog({
      title: 'Welcome to Rasoi Plus',
      message: 'Ads removed and all partners unlocked.',
      buttons: [{ text: 'Great', onPress: () => router.back() }],
    });
  };

  const handleRestore = async () => {
    const result = await paywall.restorePurchases();
    if (!result.ok) {
      showDialog({ title: 'Restore purchases', message: result.error });
      return;
    }
    showDialog({
      title: 'Restored',
      message: 'Your Rasoi Plus subscription is active.',
      buttons: [{ text: 'Continue', onPress: () => router.back() }],
    });
  };

  const statusLine =
    effectiveTier === 'paid'
      ? 'Full access active'
      : effectiveTier === 'trial' && trialTimeLabel && trialTimeLabel !== 'Trial ended'
        ? `${trialTimeLabel} left on trial`
        : trialExpired
          ? 'Trial ended'
          : canStartTrial
            ? 'Try free, then pick monthly or yearly'
            : 'Subscribe to unlock everything below';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppSavingOverlay
        visible={paywall.isBusy}
        steps={[
          { message: 'Processing payment…', subtitle: 'Connecting to the store' },
          { message: 'Activating Rasoi Plus…', subtitle: 'Unlocking partners and removing ads' },
        ]}
      />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <ArrowLeft size={22} color={colors.charcoal} />
        </Pressable>
        <Text style={styles.headerTitle}>Rasoi Plus</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollViewWithFloatingIndicator
        {...scrollIndicator}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
      >
        <LinearGradient colors={['#FF6B35', '#FF9933']} style={styles.hero}>
          <Crown size={26} color={colors.white} />
          <Text style={styles.heroTitle}>Cook without limits</Text>
          <Text style={styles.heroSub}>
            Partners, no ads, and checkout from your favourite apps.
          </Text>
        </LinearGradient>

        <View style={styles.statusStrip}>
          {effectiveTier === 'paid' ? (
            <Crown size={16} color={colors.primary} />
          ) : effectiveTier === 'trial' ? (
            <Sparkles size={16} color={colors.primary} />
          ) : null}
          <Text style={styles.statusPlan}>
            {paymentsEnabled ? PLAN_LABELS[effectiveTier] : 'Early access'}
          </Text>
          <Text style={styles.statusDot}>·</Text>
          <Text style={styles.statusMeta}>{statusLine}</Text>
        </View>

        <PaywallBenefitsStrip />

        <Text style={styles.sectionLabel}>Promo & pricing</Text>

        <PaywallPricingSection
          effectiveTier={effectiveTier}
          trialExpired={trialExpired}
          canStartTrial={canStartTrial}
          isBusy={paywall.isBusy}
          providerLabel={paywall.providerLabel}
          providerId={paywall.providerId}
          supportsRestore={paywall.supportsRestore}
          lastError={paywall.lastError}
          yearlyPromoOfferTag={yearlyPromoOfferTag}
          showPromo
          onStartTrial={() => void handleStartTrial()}
          onSubscribe={(interval) => void handleSubscribe(interval)}
          onRestore={() => void handleRestore()}
          onRedeemPromo={redeemPromoCode}
          onPromoSuccess={(message) => showDialog({ title: 'Promo applied', message })}
          onPromoError={(message) => showDialog({ title: 'Promo code', message })}
        />

        <Text style={styles.sectionLabel}>Compare plans</Text>
        <PaywallCompareTable highlightTier={effectiveTier} />

        <AdMobBanner placement="paywall" />
      </ScrollViewWithFloatingIndicator>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.charcoal,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing.lg,
  },
  hero: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
  },
  heroSub: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.92)',
  },
  statusStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  statusPlan: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.charcoal,
  },
  statusDot: {
    fontSize: 13,
    color: colors.muted,
  },
  statusMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.muted,
  },
});
