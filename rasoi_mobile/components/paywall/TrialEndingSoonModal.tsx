import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PaidPlanFeaturesList from '@/components/paywall/PaidPlanFeaturesList';
import PaywallActions from '@/components/paywall/PaywallActions';
import PaywallCompareTable from '@/components/paywall/PaywallCompareTable';
import SmoothModal from '@/components/ui/SmoothModal';
import {
  PAID_PLAN_YEARLY_DETAIL,
  PAID_PLAN_YEARLY_SAVINGS_LABEL,
  type BillingInterval,
} from '@/constants/plans';
import { colors, radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { usePaywall } from '@/hooks/usePaywall';
import { useTrialClock } from '@/hooks/useTrialClock';
import { getTrialNudgeCopy, getTrialNudgeKind, type TrialNudgeKind } from '@/utils/trialNudge';
import { markTrialNudgeShown, wasTrialNudgeShown } from '@/utils/trialNudgeStorage';

export default function TrialEndingSoonModal() {
  const insets = useSafeAreaInsets();
  const { showDialog } = useAppDialog();
  const {
    isHydrated,
    isLoggedIn,
    hasCompletedOnboarding,
    paymentsEnabled,
    showPaywall,
    effectiveTier,
    trialStartedAt,
    trialBonusDays,
    yearlyPromoOfferTag,
    trialExpired,
    canStartTrial,
    upgradeToPaid,
    restorePurchases,
    refreshPlan,
  } = useAppContext();

  const { trialTimeLabel } = useTrialClock(trialStartedAt, effectiveTier, trialBonusDays);
  const paywall = usePaywall({ upgradeToPaid, restorePurchases });

  const [visible, setVisible] = useState(false);
  const [activeNudge, setActiveNudge] = useState<TrialNudgeKind | null>(null);

  const nudgeKind = useMemo(
    () =>
      effectiveTier === 'trial' && trialStartedAt
        ? getTrialNudgeKind(trialStartedAt, trialBonusDays)
        : null,
    [effectiveTier, trialStartedAt, trialBonusDays],
  );

  const shouldEvaluate =
    isHydrated &&
    isLoggedIn &&
    hasCompletedOnboarding &&
    paymentsEnabled &&
    showPaywall &&
    effectiveTier === 'trial' &&
    Boolean(trialStartedAt) &&
    nudgeKind !== null;

  useEffect(() => {
    if (!shouldEvaluate || !trialStartedAt || !nudgeKind) {
      setVisible(false);
      setActiveNudge(null);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    void wasTrialNudgeShown(nudgeKind, trialStartedAt).then((alreadyShown) => {
      if (cancelled || alreadyShown) return;

      timer = setTimeout(() => {
        if (!cancelled) {
          setActiveNudge(nudgeKind);
          setVisible(true);
        }
      }, 600);
    });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [shouldEvaluate, trialStartedAt, nudgeKind]);

  const copy = activeNudge ? getTrialNudgeCopy(activeNudge, trialTimeLabel) : null;

  const closeModal = () => {
    if (activeNudge && trialStartedAt) {
      void markTrialNudgeShown(activeNudge, trialStartedAt);
    }
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

  if (!copy || !activeNudge) {
    return null;
  }

  return (
    <SmoothModal visible={visible} onClose={closeModal} variant="center" dismissOnBackdrop>
      <View style={[styles.card, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{copy.headerTitle}</Text>
          <Pressable onPress={closeModal} hitSlop={12} accessibilityLabel="Close upgrade prompt">
            <X size={22} color={colors.charcoal} />
          </Pressable>
        </View>

        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <LinearGradient colors={['#FF6B35', '#FF9933']} style={styles.hero}>
            <Crown size={24} color={colors.white} />
            <Text style={styles.heroTitle}>{copy.heroTitle}</Text>
            <Text style={styles.heroSub}>{copy.heroSub}</Text>
          </LinearGradient>

          <View style={styles.statusCard}>
            <Text style={styles.statusText}>{copy.statusText}</Text>
          </View>

          <PaidPlanFeaturesList />

          <Text style={styles.sectionLabel}>Compare plans</Text>
          <Text style={styles.pricingNote}>
            {PAID_PLAN_YEARLY_DETAIL} · {PAID_PLAN_YEARLY_SAVINGS_LABEL}
          </Text>
          <PaywallCompareTable />

          <View style={styles.actions}>
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
              onStartTrial={() => undefined}
              onSubscribe={(interval) => void handleSubscribe(interval)}
              onRestore={() => void handleRestore()}
            />
          </View>

          <Pressable onPress={closeModal} style={styles.laterBtn}>
            <Text style={styles.laterText}>Maybe later</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SmoothModal>
  );
}

const styles = StyleSheet.create({
  card: {
    maxHeight: '88%',
    borderRadius: radius.lg,
    backgroundColor: colors.cream,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.charcoal,
  },
  hero: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  heroTitle: {
    marginTop: spacing.sm,
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
  },
  heroSub: {
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
  },
  statusCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,107,53,0.1)',
    padding: spacing.md,
  },
  statusText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  sectionLabel: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  pricingNote: {
    marginTop: spacing.xs,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    fontSize: 12,
    color: colors.muted,
  },
  actions: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  laterBtn: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  laterText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.muted,
  },
});
