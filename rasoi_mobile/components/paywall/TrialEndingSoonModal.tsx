import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PaywallBenefitsStrip from '@/components/paywall/PaywallBenefitsStrip';
import PaywallActions from '@/components/paywall/PaywallActions';
import SmoothModal from '@/components/ui/SmoothModal';
import { type BillingInterval } from '@/constants/plans';
import { colors, radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { usePaywall } from '@/hooks/usePaywall';
import { useRevenueCatPricing } from '@/hooks/useRevenueCatPricing';
import { getEffectivePaymentProviderId } from '@/constants/payments';
import { useTrialClock } from '@/hooks/useTrialClock';
import { getTrialNudgeCopy, getTrialNudgeKind, type TrialNudgeKind } from '@/utils/trialNudge';
import { markTrialNudgeShown, wasTrialNudgeShown } from '@/utils/trialNudgeStorage';
import {
  isAnnouncementModalActive,
  subscribeAnnouncementModal,
} from '@/utils/announcementModalGate';

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
  const { pricing, storeReady } = useRevenueCatPricing(
    paymentsEnabled && getEffectivePaymentProviderId() === 'revenuecat',
  );

  const [visible, setVisible] = useState(false);
  const [activeNudge, setActiveNudge] = useState<TrialNudgeKind | null>(null);
  const [announcementBlocking, setAnnouncementBlocking] = useState(isAnnouncementModalActive());

  useEffect(() => subscribeAnnouncementModal(() => {
    setAnnouncementBlocking(isAnnouncementModalActive());
  }), []);

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
    if (!shouldEvaluate || !trialStartedAt || !nudgeKind || announcementBlocking) {
      setVisible(false);
      setActiveNudge(null);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    void wasTrialNudgeShown(nudgeKind, trialStartedAt).then((alreadyShown) => {
      if (cancelled || alreadyShown) return;

      timer = setTimeout(() => {
        if (!cancelled && !isAnnouncementModalActive()) {
          setActiveNudge(nudgeKind);
          setVisible(true);
        }
      }, 600);
    });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [shouldEvaluate, trialStartedAt, nudgeKind, announcementBlocking]);

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
    <SmoothModal visible={visible} onClose={closeModal} variant="sheet" dismissOnBackdrop>
      <View style={[styles.sheet, { maxHeight: '92%' }]}>
        <View style={styles.handle} />

        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{copy.headerTitle}</Text>
          <Pressable onPress={closeModal} hitSlop={12} accessibilityLabel="Close upgrade prompt">
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
            <Text style={styles.heroTitle}>{copy.heroTitle}</Text>
            <Text style={styles.heroSub}>{copy.heroSub}</Text>
          </LinearGradient>

          <View style={styles.statusCard}>
            <Text style={styles.statusText}>{copy.statusText}</Text>
          </View>

          <PaywallBenefitsStrip />

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
            onStartTrial={() => undefined}
            onSubscribe={(interval) => void handleSubscribe(interval)}
            onRestore={() => void handleRestore()}
          />

          <Pressable onPress={closeModal} style={styles.laterBtn}>
            <Text style={styles.laterText}>Maybe later</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: colors.charcoal,
    letterSpacing: -0.2,
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
  statusCard: {
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
