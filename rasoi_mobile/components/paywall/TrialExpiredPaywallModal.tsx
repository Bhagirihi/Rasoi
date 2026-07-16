import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppSavingOverlay from '@/components/AppSavingOverlay';
import AuthAtmosphere, { AUTH_ATMOSPHERE_BG } from '@/components/AuthAtmosphere';
import PaywallBenefitsStrip from '@/components/paywall/PaywallBenefitsStrip';
import PaywallCompareTable from '@/components/paywall/PaywallCompareTable';
import PaywallPricingSection from '@/components/paywall/PaywallPricingSection';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import SmoothModal from '@/components/ui/SmoothModal';
import { getEffectivePaymentProviderId } from '@/constants/payments';
import {
  PAYWALL_PLUS_SUCCESS_MESSAGE,
  type BillingInterval,
} from '@/constants/plans';
import { colors, layout, radius, scrollIndicator, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { usePaywall } from '@/hooks/usePaywall';
import { useRevenueCatPricing } from '@/hooks/useRevenueCatPricing';

/** Forced dark palette — trial-ended sheet always matches auth look. */
const darkUi = {
  text: colors.dark.text,
  muted: colors.dark.textMuted,
  surface: colors.dark.card,
  border: 'rgba(245, 240, 232, 0.12)',
  bg: AUTH_ATMOSPHERE_BG,
} as const;

let dismissedThisSession = false;

type QaOpenListener = () => void;
const qaOpenListeners = new Set<QaOpenListener>();

export function resetTrialExpiredPaywallSessionDismissal() {
  dismissedThisSession = false;
}

/** Dev/QA only — opens the trial-ended sheet regardless of plan state. */
export function openTrialExpiredPaywallForQa() {
  dismissedThisSession = false;
  qaOpenListeners.forEach((listener) => listener());
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
    yearlyPromoOfferTag,
    upgradeToPaid,
    restorePurchases,
    refreshPlan,
    redeemPromoCode,
  } = useAppContext();

  const [visible, setVisible] = useState(false);
  const [qaForced, setQaForced] = useState(false);
  const paywall = usePaywall({ upgradeToPaid, restorePurchases });
  const { pricing, storeReady } = useRevenueCatPricing(
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
    const openFromQa = () => {
      setQaForced(true);
      setVisible(true);
    };
    qaOpenListeners.add(openFromQa);
    return () => {
      qaOpenListeners.delete(openFromQa);
    };
  }, []);

  useEffect(() => {
    if (qaForced) return;
    if (!shouldOffer) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, [shouldOffer, qaForced]);

  const closeModal = () => {
    dismissedThisSession = true;
    setQaForced(false);
    setVisible(false);
  };

  const handleSubscribe = async (interval: BillingInterval) => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const result = await paywall.purchasePlus(interval);
    if (!result.ok) {
      if (!result.cancelled) {
        showDialog({ title: 'Couldn’t subscribe', message: result.error });
      }
      return;
    }
    await refreshPlan();
    closeModal();
    showDialog({
      title: 'Welcome to Rasoi Plus',
      message: PAYWALL_PLUS_SUCCESS_MESSAGE,
      buttons: [{ text: 'Let’s cook' }],
    });
  };

  const handleRestore = async () => {
    const result = await paywall.restorePurchases();
    if (!result.ok) {
      showDialog({ title: 'Restore purchases', message: result.error });
      return;
    }
    await refreshPlan();
    closeModal();
    showDialog({
      title: 'You’re back on Plus',
      message: 'Your Rasoi Plus subscription is active again.',
      buttons: [{ text: 'Continue' }],
    });
  };

  return (
    <SmoothModal visible={visible} onClose={closeModal} variant="sheet" dismissOnBackdrop>
      <View style={[styles.sheet, { maxHeight: '94%', paddingBottom: insets.bottom }]}>
        <AuthAtmosphere />
        <AppSavingOverlay
          visible={paywall.isBusy}
          steps={[
            { message: 'Processing payment…', subtitle: 'Connecting to the store' },
            { message: 'Activating Rasoi Plus…', subtitle: 'Unlocking meal plan, saves & partners' },
          ]}
        />

        <View style={styles.handle} />

        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Rasoi Plus</Text>
          <Pressable onPress={closeModal} hitSlop={12} accessibilityLabel="Close">
            <X size={22} color={darkUi.muted} />
          </Pressable>
        </View>

        <ScrollViewWithFloatingIndicator
          {...scrollIndicator}
          keyboardShouldPersistTaps="handled"
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <LinearGradient colors={['#FF6B35', '#FF9933']} style={styles.hero}>
            <Crown size={26} color={colors.white} />
            <Text style={styles.heroTitle}>Your free trial has ended</Text>
            <Text style={styles.heroSub}>
              Keep cooking on Free, or unlock Plus for the full 3-day plan, unlimited saves, and
              partner checkout.
            </Text>
          </LinearGradient>

          <View style={styles.statusStrip}>
            <Text style={styles.statusPlan}>Free</Text>
            <Text style={styles.statusDot}>·</Text>
            <Text style={styles.statusMeta}>Trial ended — subscribe to restore Plus</Text>
          </View>

          <PaywallBenefitsStrip forceDark />

          <Text style={styles.sectionLabel}>Promo & pricing</Text>

          <PaywallPricingSection
            effectiveTier="free"
            trialExpired
            canStartTrial={false}
            isBusy={paywall.isBusy}
            providerLabel={paywall.providerLabel}
            providerId={paywall.providerId}
            supportsRestore={paywall.supportsRestore}
            lastError={paywall.lastError}
            yearlyPromoOfferTag={yearlyPromoOfferTag}
            showPromo
            forceDark
            onStartTrial={() => undefined}
            onSubscribe={(interval) => void handleSubscribe(interval)}
            onRestore={() => void handleRestore()}
            onRedeemPromo={redeemPromoCode}
            onPromoSuccess={(message) => showDialog({ title: 'Promo applied', message })}
            onPromoError={(message) => showDialog({ title: 'Promo code', message })}
            storePricing={storeReady ? pricing : null}
          />

          <Text style={styles.sectionLabel}>Compare plans</Text>
          <PaywallCompareTable highlightTier="free" forceDark />

          <Pressable onPress={closeModal} style={styles.laterBtn}>
            <Text style={styles.laterText}>Maybe later · keep cooking free</Text>
          </Pressable>
        </ScrollViewWithFloatingIndicator>
      </View>
    </SmoothModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: darkUi.bg,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.22)',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: darkUi.text,
  },
  scroll: {
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  hero: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  heroTitle: {
    fontSize: 24,
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
    backgroundColor: darkUi.surface,
    borderWidth: 1,
    borderColor: darkUi.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  statusPlan: {
    fontSize: 13,
    fontWeight: '800',
    color: darkUi.text,
  },
  statusDot: {
    fontSize: 13,
    color: darkUi.muted,
  },
  statusMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: darkUi.muted,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  laterBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: darkUi.surface,
    borderWidth: 1,
    borderColor: darkUi.border,
  },
  laterText: {
    fontSize: 15,
    fontWeight: '700',
    color: darkUi.text,
  },
});
