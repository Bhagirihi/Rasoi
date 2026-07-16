import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Crown, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  PAID_PLAN_FEATURES,
  PAID_PLAN_MONTHLY_PRICE,
  PAID_PLAN_YEARLY_DETAIL,
  PAID_PLAN_YEARLY_PRICE,
  PAID_PLAN_YEARLY_SAVINGS_LABEL,
  TRIAL_DURATION_DAYS,
  TRIAL_WELCOME_FEATURES,
  TRIAL_WELCOME_HERO_SUB_NEW,
  TRIAL_WELCOME_HERO_SUB_STARTED,
  type BillingInterval,
} from '@/constants/plans';
import { getConfiguredPaymentProviderId, PAYMENT_DISCLAIMERS } from '@/constants/payments';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import type { RevenueCatStorePricing } from '@/services/payments/revenueCatClient';

const darkUi = {
  text: colors.dark.text,
  muted: colors.dark.textMuted,
  surface: colors.dark.card,
  border: 'rgba(245, 240, 232, 0.12)',
} as const;

type TrialWelcomeContentProps = {
  trialStarted: boolean;
  storePricing?: RevenueCatStorePricing | null;
  onContinueTrial: () => void | Promise<void>;
  onSubscribe: (interval: BillingInterval) => Promise<void>;
};

export default function TrialWelcomeContent({
  trialStarted,
  storePricing = null,
  onContinueTrial,
  onSubscribe,
}: TrialWelcomeContentProps) {
  const [loading, setLoading] = useState<BillingInterval | null>(null);
  const [continuingTrial, setContinuingTrial] = useState(false);

  const monthlyLabel = storePricing?.monthly?.priceString ?? PAID_PLAN_MONTHLY_PRICE;
  const yearlyLabel = storePricing?.yearly?.priceString ?? PAID_PLAN_YEARLY_PRICE;
  const yearlySubline =
    storePricing?.yearly?.subline ?? PAID_PLAN_YEARLY_DETAIL;
  const yearlySavings =
    storePricing?.yearly?.savingsLabel ?? PAID_PLAN_YEARLY_SAVINGS_LABEL;

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

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#FF6B35', '#FF9933']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroBadge}>
          <Sparkles size={14} color={colors.primary} />
          <Text style={styles.heroBadgeText}>Welcome to Rasoi</Text>
        </View>
        <Crown size={36} color={colors.white} />
        <Text style={styles.heroTitle}>
          {trialStarted
            ? `You're on trial for ${TRIAL_DURATION_DAYS} days`
            : `Start your ${TRIAL_DURATION_DAYS}-day free trial`}
        </Text>
        <Text style={styles.heroSub}>
          {trialStarted ? TRIAL_WELCOME_HERO_SUB_STARTED : TRIAL_WELCOME_HERO_SUB_NEW}
        </Text>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.featureBulletin}>
          <Text style={styles.sectionLabel}>During your trial</Text>
          {TRIAL_WELCOME_FEATURES.map((feature) => (
            <FeatureRow key={feature} text={feature} tone="trial" />
          ))}
        </View>

        <View style={[styles.featureBulletin, styles.featureBulletinPlus]}>
          <Text style={styles.sectionLabel}>
            Rasoi Plus · charged immediately via Google Play
          </Text>
          <Text style={styles.subscribeNote}>
            Subscribe now for {monthlyLabel} or {yearlyLabel}
            {yearlySavings ? ` (${yearlySavings})` : ''}. Cancel anytime in Google Play →
            Subscriptions.
          </Text>
          {PAID_PLAN_FEATURES.map((feature) => (
            <FeatureRow key={feature} text={feature} tone="paid" />
          ))}
        </View>

        <Pressable
          onPress={() => void handleContinue()}
          disabled={continuingTrial}
          testID={testIds.trialContinue}
          style={[styles.primaryTrialBtn, continuingTrial && styles.btnDisabled]}
        >
          <Text style={styles.primaryTrialBtnText}>
            {continuingTrial
              ? 'Starting trial…'
              : trialStarted
                ? 'Continue — set up pantry'
                : `Start free ${TRIAL_DURATION_DAYS}-day trial`}
          </Text>
        </Pressable>

        <Text style={styles.orLabel}>Or subscribe now</Text>

        <Pressable
          onPress={() => void handleSubscribe('yearly')}
          disabled={continuingTrial || subscribeBusy}
          style={[styles.primaryBtn, (continuingTrial || subscribeBusy) && styles.btnDisabled]}
        >
          <LinearGradient
            colors={[colors.primary, colors.saffron]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.primaryBtnInner}
          >
            <Text style={styles.savingsBadge}>{yearlySavings}</Text>
            <Text style={styles.primaryBtnText}>
              {loading === 'yearly' ? 'Processing…' : `Plus yearly · ${yearlyLabel}`}
            </Text>
            <Text style={styles.primaryBtnSub}>{yearlySubline}</Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={() => void handleSubscribe('monthly')}
          disabled={continuingTrial || subscribeBusy}
          style={[styles.secondaryBtn, (continuingTrial || subscribeBusy) && styles.btnDisabled]}
        >
          <Text style={styles.secondaryBtnText}>
            {loading === 'monthly' ? 'Processing…' : `Plus monthly · ${monthlyLabel}`}
          </Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          {PAYMENT_DISCLAIMERS[getConfiguredPaymentProviderId()]}
        </Text>
      </View>
    </View>
  );
}

function FeatureRow({ text, tone }: { text: string; tone: 'trial' | 'paid' }) {
  return (
    <View style={styles.featureRow}>
      <View style={[styles.featureIcon, tone === 'paid' && styles.featureIconPaid]}>
        <Check size={14} color={tone === 'paid' ? colors.white : colors.green} strokeWidth={3} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginBottom: spacing.md,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  heroTitle: {
    marginTop: spacing.sm,
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
  },
  body: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  featureBulletin: {
    borderRadius: radius.md,
    backgroundColor: darkUi.surface,
    borderWidth: 1,
    borderColor: darkUi.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  featureBulletinPlus: {
    backgroundColor: 'rgba(255,107,53,0.12)',
    borderColor: 'rgba(255,107,53,0.28)',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: darkUi.text,
    marginBottom: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  featureIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,168,107,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  featureIconPaid: {
    backgroundColor: colors.primary,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: darkUi.text,
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
  savingsBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.charcoal,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  },
  primaryBtnSub: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
  },
  secondaryBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: darkUi.border,
    backgroundColor: darkUi.surface,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: darkUi.text,
  },
  primaryTrialBtn: {
    marginTop: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'rgba(255,107,53,0.14)',
  },
  primaryTrialBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  orLabel: {
    marginTop: spacing.md,
    fontSize: 12,
    fontWeight: '700',
    color: darkUi.muted,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  subscribeNote: {
    fontSize: 12,
    lineHeight: 18,
    color: darkUi.muted,
    marginBottom: spacing.sm,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  disclaimer: {
    marginTop: spacing.md,
    fontSize: 11,
    lineHeight: 16,
    color: darkUi.muted,
    textAlign: 'center',
  },
});
