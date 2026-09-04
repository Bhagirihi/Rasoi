import { Pressable, StyleSheet, Text, View } from 'react-native';

import PromoCodeInput from '@/components/paywall/PromoCodeInput';
import { PaywallPlanGrid } from '@/components/paywall/PaywallPlanCards';
import {
  TRIAL_DURATION_DAYS,
  type BillingInterval,
} from '@/constants/plans';
import { getConfiguredPaymentProviderId, PAYMENT_DISCLAIMERS, RECURRING_PAYMENT_NOTICE, type PaymentProviderId } from '@/constants/payments';
import { PAYMENTS_DISABLED_NOTE } from '@/constants/monetizationConfig';
import { colors, radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';

import type { RevenueCatStorePricing } from '@/services/payments/revenueCatClient';

type PaywallPricingSectionProps = {
  effectiveTier: 'free' | 'trial' | 'paid';
  trialExpired: boolean;
  canStartTrial: boolean;
  isBusy: boolean;
  providerLabel: string;
  providerId?: PaymentProviderId;
  supportsRestore: boolean;
  lastError: string | null;
  yearlyPromoOfferTag?: string | null;
  showPromo?: boolean;
  forceDark?: boolean;
  onStartTrial: () => void;
  onSubscribe: (interval: BillingInterval) => void;
  onRestore?: () => void;
  onPromoSuccess: (message: string) => void;
  onPromoError: (message: string) => void;
  onRedeemPromo: (code: string) => Promise<{ message: string }>;
  storePricing?: RevenueCatStorePricing | null;
};

export default function PaywallPricingSection({
  effectiveTier,
  trialExpired,
  canStartTrial,
  isBusy,
  providerLabel,
  providerId = getConfiguredPaymentProviderId(),
  supportsRestore,
  lastError,
  yearlyPromoOfferTag = null,
  showPromo = true,
  forceDark = false,
  onStartTrial,
  onSubscribe,
  onRestore,
  onPromoSuccess,
  onPromoError,
  onRedeemPromo,
  storePricing = null,
}: PaywallPricingSectionProps) {
  const { paymentsEnabled, isLoggedIn } = useAppContext();
  const { colors: themeColors, isDark } = useTheme();
  const dark = forceDark || isDark;
  const muted = dark ? colors.dark.textMuted : themeColors.muted;
  const text = dark ? colors.dark.text : themeColors.charcoal;

  const showSubscribeOptions =
    paymentsEnabled &&
    (effectiveTier !== 'paid' || providerId === 'stub');

  const showPromoBlock =
    showPromo && paymentsEnabled && isLoggedIn && effectiveTier !== 'paid';

  return (
    <View style={styles.wrap}>
      {!paymentsEnabled && (
        <View style={styles.betaCard}>
          <Text style={styles.betaTitle}>Early access</Text>
          <Text style={[styles.betaBody, { color: muted }]}>{PAYMENTS_DISABLED_NOTE}</Text>
        </View>
      )}

      {showPromoBlock && (
        <PromoCodeInput
          disabled={isBusy}
          forceDark={forceDark}
          onRedeem={onRedeemPromo}
          onSuccess={onPromoSuccess}
          onError={onPromoError}
        />
      )}

      {paymentsEnabled && canStartTrial && (
        <Pressable
          onPress={onStartTrial}
          disabled={isBusy}
          style={[styles.trialBtn, isBusy && styles.btnDisabled]}
        >
          <Text style={styles.trialBtnText}>Start {TRIAL_DURATION_DAYS}-day free trial</Text>
          <Text style={[styles.trialBtnSub, { color: muted }]}>
            3-day plan · unlimited partners · no card needed
          </Text>
        </Pressable>
      )}

      {paymentsEnabled && trialExpired && effectiveTier === 'free' && (
        <View style={[styles.alertCard, dark && styles.alertCardDark]}>
          <Text style={[styles.alertText, dark && { color: text }]}>
            Trial ended. Subscribe to keep your 3-day plan, unlimited saves, shuffles, and partner
            checkout.
          </Text>
        </View>
      )}

      {showSubscribeOptions && (
        <>
          <Text style={[styles.planHint, { color: muted }]}>
            Tap a plan to subscribe — Google Play or App Store checkout opens next.
          </Text>
          <PaywallPlanGrid
            disabled={isBusy}
            yearlyPromoOfferTag={yearlyPromoOfferTag}
            storePricing={storePricing}
            onSubscribe={onSubscribe}
          />
        </>
      )}

      {paymentsEnabled && effectiveTier === 'paid' && providerId === 'revenuecat' && (
        <Text style={[styles.manageNote, { color: muted }]}>
          Manage billing in Google Play → Payments & subscriptions.
        </Text>
      )}

      {paymentsEnabled && effectiveTier === 'paid' && providerId === 'stub' && (
        <Text style={[styles.manageNote, { color: muted }]}>
          Preview mode — billing connects when you go live on Play Store.
        </Text>
      )}

      {paymentsEnabled && supportsRestore && onRestore && (
        <Pressable onPress={onRestore} disabled={isBusy} style={styles.restoreBtn}>
          <Text style={[styles.restoreText, { color: muted }]}>Restore purchases</Text>
        </Pressable>
      )}

      {lastError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{lastError}</Text>
        </View>
      )}

      <Text style={[styles.disclaimer, { color: muted }]}>
        {paymentsEnabled
          ? `${RECURRING_PAYMENT_NOTICE} ${PAYMENT_DISCLAIMERS[providerId]} Billing · ${providerLabel}.`
          : PAYMENTS_DISABLED_NOTE}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.lg,
  },
  betaCard: {
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,107,53,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.2)',
    padding: spacing.lg,
  },
  betaTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  betaBody: {
    marginTop: spacing.xs,
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
  },
  trialBtn: {
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(255,107,53,0.06)',
  },
  trialBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  trialBtnSub: {
    marginTop: 4,
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600',
  },
  alertCard: {
    borderRadius: radius.md,
    backgroundColor: 'rgba(229,57,53,0.08)',
    padding: spacing.md,
  },
  alertCardDark: {
    backgroundColor: 'rgba(255,107,53,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.35)',
  },
  alertText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.danger,
    textAlign: 'center',
    fontWeight: '600',
  },
  planHint: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
    fontWeight: '600',
    textAlign: 'center',
  },
  manageNote: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
    textAlign: 'center',
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  restoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  errorBox: {
    borderRadius: radius.sm,
    backgroundColor: 'rgba(229,57,53,0.08)',
    padding: spacing.md,
  },
  errorText: {
    fontSize: 13,
    color: colors.danger,
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.muted,
    textAlign: 'center',
  },
});
