import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Crown, ShoppingBag, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  PAID_PLAN_MONTHLY_PRICE,
  PAID_PLAN_YEARLY_DETAIL,
  PAID_PLAN_YEARLY_PRICE,
  PAID_PLAN_YEARLY_SAVINGS_LABEL,
  type BillingInterval,
} from '@/constants/plans';
import { getConfiguredPaymentProviderId, PAYMENT_DISCLAIMERS } from '@/constants/payments';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';

type TrialWelcomeContentProps = {
  trialStarted: boolean;
  trialDays: number;
  onContinueTrial: () => void | Promise<void>;
  onSubscribe: (interval: BillingInterval) => Promise<void>;
};

const HIGHLIGHTS = [
  { icon: ShoppingBag, label: 'Partner checkout unlocked' },
  { icon: Sparkles, label: 'Full meal plans during trial' },
  { icon: Check, label: 'Subscribe later to remove ads' },
] as const;

export default function TrialWelcomeContent({
  trialStarted,
  trialDays,
  onContinueTrial,
  onSubscribe,
}: TrialWelcomeContentProps) {
  const [loading, setLoading] = useState<BillingInterval | null>(null);
  const [continuingTrial, setContinuingTrial] = useState(false);

  const handleSubscribe = async (interval: BillingInterval) => {
    setLoading(interval);
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await onSubscribe(interval);
    } finally {
      setLoading(null);
    }
  };

  const handleContinue = async () => {
    if (continuingTrial) return;
    setContinuingTrial(true);
    try {
      void Haptics.selectionAsync();
      await onContinueTrial();
    } finally {
      setContinuingTrial(false);
    }
  };

  const subscribeBusy = loading !== null;
  const actionsDisabled = continuingTrial || subscribeBusy;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#FF6B35', '#FF9933']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Crown size={32} color={colors.white} />
        <Text style={styles.heroTitle}>
          {trialStarted
            ? `You're on trial for ${trialDays} days`
            : `Start your ${trialDays}-day free trial`}
        </Text>
        <Text style={styles.heroSub}>
          Grocery & delivery partners are unlocked. Ads stay unless you subscribe.
        </Text>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.highlightCard}>
          {HIGHLIGHTS.map(({ icon: Icon, label }, index) => (
            <View
              key={label}
              style={[styles.highlightRow, index < HIGHLIGHTS.length - 1 && styles.highlightBorder]}
            >
              <View style={styles.highlightIcon}>
                <Icon size={16} color={colors.primary} strokeWidth={2.5} />
              </View>
              <Text style={styles.highlightText}>{label}</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => void handleContinue()}
          disabled={continuingTrial}
          testID={testIds.trialContinue}
          style={[styles.primaryBtn, continuingTrial && styles.btnDisabled]}
        >
          <LinearGradient
            colors={[colors.primary, colors.saffron]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.primaryBtnInner}
          >
            <Text style={styles.primaryBtnText}>
              {continuingTrial
                ? 'Starting…'
                : trialStarted
                  ? 'Continue with trial'
                  : `Start free ${trialDays}-day trial`}
            </Text>
          </LinearGradient>
        </Pressable>

        <Text style={styles.orLabel}>Or go Plus now</Text>

        <Pressable
          onPress={() => void handleSubscribe('yearly')}
          disabled={actionsDisabled}
          style={[styles.yearlyBtn, actionsDisabled && styles.btnDisabled]}
        >
          <Text style={styles.savingsChip}>{PAID_PLAN_YEARLY_SAVINGS_LABEL}</Text>
          <Text style={styles.yearlyBtnText}>
            {loading === 'yearly' ? 'Processing…' : `Yearly · ${PAID_PLAN_YEARLY_PRICE}`}
          </Text>
          <Text style={styles.yearlyBtnSub}>{PAID_PLAN_YEARLY_DETAIL}</Text>
        </Pressable>

        <Pressable
          onPress={() => void handleSubscribe('monthly')}
          disabled={actionsDisabled}
          style={[styles.monthlyBtn, actionsDisabled && styles.btnDisabled]}
        >
          <Text style={styles.monthlyBtnText}>
            {loading === 'monthly' ? 'Processing…' : `Monthly · ${PAID_PLAN_MONTHLY_PRICE}`}
          </Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          Plus removes ads and keeps partners after trial. Cancel anytime in Google Play.
          {'\n'}
          {PAYMENT_DISCLAIMERS[getConfiguredPaymentProviderId()]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  heroTitle: {
    marginTop: spacing.md,
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
  },
  heroSub: {
    marginTop: spacing.sm,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    maxWidth: 320,
  },
  body: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  highlightCard: {
    borderRadius: radius.md,
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  highlightBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  highlightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,107,53,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.dark.text,
  },
  primaryBtn: {
    marginTop: spacing.xl,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.cta,
  },
  primaryBtnInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  },
  orLabel: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark.textMuted,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  yearlyBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,107,53,0.45)',
    backgroundColor: 'rgba(255,107,53,0.08)',
  },
  savingsChip: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    color: colors.primary,
    marginBottom: 4,
  },
  yearlyBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.dark.text,
  },
  yearlyBtnSub: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.dark.textMuted,
    textAlign: 'center',
  },
  monthlyBtn: {
    marginTop: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  monthlyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.textMuted,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  disclaimer: {
    marginTop: spacing.lg,
    fontSize: 11,
    lineHeight: 16,
    color: colors.dark.textMuted,
    textAlign: 'center',
  },
});
