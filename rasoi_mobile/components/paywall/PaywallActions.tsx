import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  PAID_PLAN_MONTHLY_PRICE,
  PAID_PLAN_YEARLY_DETAIL,
  PAID_PLAN_YEARLY_PRICE,
  PAID_PLAN_YEARLY_SAVINGS_LABEL,
  TRIAL_DURATION_DAYS,
  type BillingInterval,
} from '@/constants/plans';
import { MONETIZATION_LIVE, MONETIZATION_BETA_NOTE } from '@/constants/monetizationConfig';
import { colors, radius, spacing } from '@/constants/theme';

type PaywallActionsProps = {
  effectiveTier: 'free' | 'trial' | 'paid';
  trialExpired: boolean;
  canStartTrial: boolean;
  isBusy: boolean;
  paymentDisclaimer: string;
  providerLabel: string;
  supportsRestore: boolean;
  lastError: string | null;
  onStartTrial: () => void;
  onSubscribe: (interval: BillingInterval) => void;
  onRestore?: () => void;
};

export default function PaywallActions({
  effectiveTier,
  trialExpired,
  canStartTrial,
  isBusy,
  paymentDisclaimer,
  providerLabel,
  supportsRestore,
  lastError,
  onStartTrial,
  onSubscribe,
  onRestore,
}: PaywallActionsProps) {
  return (
    <View style={styles.wrap}>
      {!MONETIZATION_LIVE && (
        <View style={styles.betaCard}>
          <Text style={styles.betaTitle}>Early access</Text>
          <Text style={styles.betaBody}>{MONETIZATION_BETA_NOTE}</Text>
        </View>
      )}

      {MONETIZATION_LIVE && (
        <View style={styles.providerPill}>
          <Text style={styles.providerText}>Billing · {providerLabel}</Text>
        </View>
      )}

      {MONETIZATION_LIVE && canStartTrial && (
        <Pressable
          onPress={onStartTrial}
          disabled={isBusy}
          style={[styles.secondaryBtn, isBusy && styles.btnDisabled]}
        >
          <Text style={styles.secondaryBtnText}>Start {TRIAL_DURATION_DAYS}-day free trial</Text>
        </Pressable>
      )}

      {MONETIZATION_LIVE && trialExpired && effectiveTier === 'free' && (
        <Text style={styles.expiredNote}>
          Your trial has ended. Subscribe to Rasoi Plus to restore partner checkout.
        </Text>
      )}

      {MONETIZATION_LIVE && effectiveTier !== 'paid' && (
        <>
          <Pressable
            onPress={() => onSubscribe('yearly')}
            disabled={isBusy}
            style={[styles.primaryWrap, isBusy && styles.btnDisabled]}
          >
            <LinearGradient
              colors={[colors.primary, colors.saffron]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.primaryBtn}
            >
              <Text style={styles.savingsBadge}>{PAID_PLAN_YEARLY_SAVINGS_LABEL}</Text>
              <Text style={styles.bestValue}>Best value</Text>
              <Text style={styles.primaryBtnText}>
                {isBusy ? 'Processing…' : `Plus yearly · ${PAID_PLAN_YEARLY_PRICE}`}
              </Text>
              <Text style={styles.primaryBtnSub}>{PAID_PLAN_YEARLY_DETAIL}</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => onSubscribe('monthly')}
            disabled={isBusy}
            style={[styles.monthlyBtn, isBusy && styles.btnDisabled]}
          >
            <Text style={styles.monthlyBtnText}>
              Plus monthly · {PAID_PLAN_MONTHLY_PRICE}
            </Text>
          </Pressable>
        </>
      )}

      {MONETIZATION_LIVE && supportsRestore && onRestore && (
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
        {MONETIZATION_LIVE ? paymentDisclaimer : MONETIZATION_BETA_NOTE}
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
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  betaBody: {
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
  },
  providerPill: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,107,53,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  providerText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  secondaryBtn: {
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  expiredNote: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.danger,
    textAlign: 'center',
  },
  primaryWrap: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  primaryBtn: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  savingsBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.charcoal,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.pill,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  bestValue: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.9)',
  },
  primaryBtnText: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: '800',
    color: colors.white,
  },
  primaryBtnSub: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.92)',
  },
  monthlyBtn: {
    borderRadius: radius.md,
    backgroundColor: colors.charcoal,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  monthlyBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
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
