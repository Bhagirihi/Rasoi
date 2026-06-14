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
  type BillingInterval,
} from '@/constants/plans';
import { getConfiguredPaymentProviderId, PAYMENT_DISCLAIMERS } from '@/constants/payments';
import { colors, radius, shadows, spacing } from '@/constants/theme';

type TrialWelcomeContentProps = {
  onContinueTrial: () => void;
  onSubscribe: (interval: BillingInterval) => Promise<void>;
};

export default function TrialWelcomeContent({
  onContinueTrial,
  onSubscribe,
}: TrialWelcomeContentProps) {
  const [loading, setLoading] = useState<BillingInterval | null>(null);

  const handleSubscribe = async (interval: BillingInterval) => {
    setLoading(interval);
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await onSubscribe(interval);
    } finally {
      setLoading(null);
    }
  };

  const handleContinue = () => {
    void Haptics.selectionAsync();
    onContinueTrial();
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#FF6B35', '#FF9933']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroBadge}>
          <Sparkles size={14} color={colors.white} />
          <Text style={styles.heroBadgeText}>Welcome to Rasoi</Text>
        </View>
        <Crown size={36} color={colors.white} />
        <Text style={styles.heroTitle}>You&apos;re on trial for {TRIAL_DURATION_DAYS} days</Text>
        <Text style={styles.heroSub}>
          Enjoy partner checkout during your trial. Upgrade to Rasoi Plus to remove ads and keep
          access forever.
        </Text>
      </LinearGradient>

      <View style={styles.body}>
        <Text style={styles.sectionLabel}>During your trial</Text>
        {TRIAL_WELCOME_FEATURES.map((feature) => (
          <FeatureRow key={feature} text={feature} tone="trial" />
        ))}

        <Text style={[styles.sectionLabel, styles.sectionGap]}>
          Rasoi Plus · {PAID_PLAN_MONTHLY_PRICE} or {PAID_PLAN_YEARLY_PRICE} (
          {PAID_PLAN_YEARLY_SAVINGS_LABEL})
        </Text>
        {PAID_PLAN_FEATURES.map((feature) => (
          <FeatureRow key={feature} text={feature} tone="paid" />
        ))}

        <Pressable
          onPress={() => void handleSubscribe('yearly')}
          disabled={loading !== null}
          style={[styles.primaryBtn, loading !== null && styles.btnDisabled]}
        >
          <LinearGradient
            colors={[colors.primary, colors.saffron]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.primaryBtnInner}
          >
            <Text style={styles.savingsBadge}>{PAID_PLAN_YEARLY_SAVINGS_LABEL}</Text>
            <Text style={styles.primaryBtnText}>
              {loading === 'yearly' ? 'Processing…' : `Plus yearly · ${PAID_PLAN_YEARLY_PRICE}`}
            </Text>
            <Text style={styles.primaryBtnSub}>{PAID_PLAN_YEARLY_DETAIL}</Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={() => void handleSubscribe('monthly')}
          disabled={loading !== null}
          style={[styles.secondaryBtn, loading !== null && styles.btnDisabled]}
        >
          <Text style={styles.secondaryBtnText}>
            {loading === 'monthly' ? 'Processing…' : `Plus monthly · ${PAID_PLAN_MONTHLY_PRICE}`}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleContinue}
          disabled={loading !== null}
          style={[styles.skipBtn, loading !== null && styles.btnDisabled]}
        >
          <Text style={styles.skipBtnText}>Continue with trial</Text>
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
    backgroundColor: colors.cream,
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
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginBottom: spacing.md,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.white,
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  sectionGap: {
    marginTop: spacing.lg,
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
    backgroundColor: 'rgba(0,168,107,0.12)',
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
    color: colors.charcoal,
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
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.charcoal,
  },
  skipBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'rgba(255,107,53,0.08)',
  },
  skipBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  disclaimer: {
    marginTop: spacing.md,
    fontSize: 11,
    lineHeight: 16,
    color: colors.muted,
    textAlign: 'center',
  },
});
