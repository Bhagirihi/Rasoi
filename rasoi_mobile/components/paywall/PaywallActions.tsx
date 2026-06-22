import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PaywallPlanGrid } from '@/components/paywall/PaywallPlanCards';
import {
  TRIAL_DURATION_DAYS,
  type BillingInterval,
} from '@/constants/plans';
import { getConfiguredPaymentProviderId, PAYMENT_DISCLAIMERS, RECURRING_PAYMENT_NOTICE, type PaymentProviderId } from '@/constants/payments';
import { PAYMENTS_DISABLED_NOTE } from '@/constants/monetizationConfig';
import { colors, radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import type { RevenueCatStorePricing } from '@/services/payments/revenueCatClient';

type PaywallActionsProps = {
  effectiveTier: 'free' | 'trial' | 'paid';
  trialExpired: boolean;
  canStartTrial: boolean;
  isBusy: boolean;
  paymentDisclaimer: string;
  providerLabel: string;
  providerId?: PaymentProviderId;
  supportsRestore: boolean;
  lastError: string | null;
  onStartTrial: () => void;
  onSubscribe: (interval: BillingInterval) => void;
  onRestore?: () => void;
  yearlyPromoOfferTag?: string | null;
  storePricing?: RevenueCatStorePricing | null;
};

/** Compact pricing block for trial modals — full paywall uses PaywallPricingSection. */
export default function PaywallActions({
  effectiveTier,
  trialExpired,
  canStartTrial,
  isBusy,
  paymentDisclaimer,
  providerLabel,
  providerId = getConfiguredPaymentProviderId(),
  supportsRestore,
  lastError,
  onStartTrial,
  onSubscribe,
  onRestore,
  yearlyPromoOfferTag = null,
  storePricing = null,
}: PaywallActionsProps) {
  const { paymentsEnabled } = useAppContext();

  const showSubscribeOptions =
    paymentsEnabled &&
    (effectiveTier !== 'paid' || providerId === 'stub');

  return (
    <View style={styles.wrap}>
      {!paymentsEnabled && (
        <View style={styles.betaCard}>
          <Text style={styles.betaTitle}>Early access</Text>
          <Text style={styles.betaBody}>{PAYMENTS_DISABLED_NOTE}</Text>
        </View>
      )}

      {paymentsEnabled && canStartTrial && (
        <Pressable
          onPress={onStartTrial}
          disabled={isBusy}
          style={[styles.trialBtn, isBusy && styles.btnDisabled]}
        >
          <Text style={styles.trialBtnText}>Start {TRIAL_DURATION_DAYS}-day free trial</Text>
        </Pressable>
      )}

      {paymentsEnabled && trialExpired && effectiveTier === 'free' && (
        <Text style={styles.expiredNote}>
          Your trial has ended. Subscribe to restore partner checkout.
        </Text>
      )}

      {showSubscribeOptions && (
        <>
          <Text style={styles.planHint}>Tap a plan — Google Play or App Store checkout opens next.</Text>
          <PaywallPlanGrid
            disabled={isBusy}
            yearlyPromoOfferTag={yearlyPromoOfferTag}
            storePricing={storePricing}
            onSubscribe={onSubscribe}
          />
        </>
      )}

      {paymentsEnabled && effectiveTier === 'paid' && providerId === 'revenuecat' && (
        <Text style={styles.manageNote}>
          Manage billing in Google Play → Payments & subscriptions.
        </Text>
      )}

      {paymentsEnabled && supportsRestore && onRestore && (
        <Pressable onPress={onRestore} disabled={isBusy} style={styles.restoreBtn}>
          <Text style={styles.restoreText}>Restore purchases</Text>
        </Pressable>
      )}

      {lastError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{lastError}</Text>
        </View>
      )}

      <Text style={styles.disclaimer}>
        {paymentsEnabled
          ? `${RECURRING_PAYMENT_NOTICE} ${paymentDisclaimer || PAYMENT_DISCLAIMERS[providerId]} Billing · ${providerLabel}.`
          : PAYMENTS_DISABLED_NOTE}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
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
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  trialBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  expiredNote: {
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
