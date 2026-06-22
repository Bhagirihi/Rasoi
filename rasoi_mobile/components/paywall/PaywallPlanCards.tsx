import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Crown } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  PAID_PLAN_MONTHLY_AMOUNT_INR,
  PAID_PLAN_MONTHLY_PRICE,
  PAID_PLAN_YEARLY_AMOUNT_INR,
  PAID_PLAN_YEARLY_MONTHLY_EQUIV_INR,
  PAID_PLAN_YEARLY_PRICE,
  PAID_PLAN_YEARLY_PROMO_LABEL,
  PAID_PLAN_YEARLY_SAVINGS_LABEL,
  YEARLY_PROMO_OFFER_TAG,
  formatInr,
  type BillingInterval,
} from '@/constants/plans';
import { colors, radius, spacing } from '@/constants/theme';
import type { RevenueCatStorePricing } from '@/services/payments/revenueCatClient';

type PlanCardProps = {
  disabled?: boolean;
  onPress: () => void;
  yearlyPromoOfferTag?: string | null;
  storePricing?: RevenueCatStorePricing | null;
};

export function MonthlyPlanCard({ disabled, onPress, storePricing }: PlanCardProps) {
  const live = storePricing?.monthly;
  const priceLabel = live?.priceString ?? formatInr(PAID_PLAN_MONTHLY_AMOUNT_INR);
  const subline = live?.subline ?? `Pay ${PAID_PLAN_MONTHLY_PRICE} · Cancel anytime`;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.monthlyWrap,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Subscribe monthly for ${priceLabel}`}
    >
      <LinearGradient
        colors={['#1A1A2E', '#2A2A3E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.monthlyGradient}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.monthlyBadge}>
            <Calendar size={12} color={colors.white} />
            <Text style={styles.monthlyBadgeText}>Flexible</Text>
          </View>
          <Text style={styles.monthlyPopular}>Popular</Text>
        </View>
        <Text style={styles.monthlyTitle}>Monthly</Text>
        <Text style={styles.monthlyPrice}>{priceLabel}</Text>
        <Text style={styles.monthlyPeriod}>per month</Text>
        <Text style={styles.monthlySub}>{subline}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function YearlyPlanCard({
  disabled,
  onPress,
  yearlyPromoOfferTag = null,
  storePricing,
}: PlanCardProps) {
  const hasPromo = yearlyPromoOfferTag === YEARLY_PROMO_OFFER_TAG;
  const live = storePricing?.yearly;
  const priceLabel = hasPromo
    ? PAID_PLAN_YEARLY_PROMO_LABEL.split(' · ')[0]
    : live?.priceString ?? formatInr(PAID_PLAN_YEARLY_AMOUNT_INR);
  const savingsLabel = hasPromo
    ? 'Promo applied'
    : live?.savingsLabel ?? PAID_PLAN_YEARLY_SAVINGS_LABEL.split(' · ')[0];
  const subline = hasPromo
    ? PAID_PLAN_YEARLY_PROMO_LABEL
    : live?.subline ??
      `${formatInr(PAID_PLAN_YEARLY_MONTHLY_EQUIV_INR)}/mo · ${PAID_PLAN_YEARLY_PRICE}`;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.yearlyWrap,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Subscribe yearly for ${priceLabel}`}
    >
      <LinearGradient
        colors={[colors.primary, colors.saffron]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.yearlyGradient}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.yearlyBadge}>
            <Crown size={12} color={colors.primary} />
            <Text style={styles.yearlyBadgeText}>Best value</Text>
          </View>
          <Text style={styles.yearlySavings}>{savingsLabel}</Text>
        </View>
        <Text style={styles.yearlyTitle}>Yearly</Text>
        <Text style={styles.yearlyPrice}>{priceLabel}</Text>
        <Text style={styles.yearlyPeriod}>per year</Text>
        <Text style={styles.yearlySub}>{subline}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function PaywallPlanGrid({
  disabled,
  yearlyPromoOfferTag,
  storePricing,
  onSubscribe,
}: {
  disabled?: boolean;
  yearlyPromoOfferTag?: string | null;
  storePricing?: RevenueCatStorePricing | null;
  onSubscribe: (interval: BillingInterval) => void;
}) {
  return (
    <View style={styles.grid}>
      <MonthlyPlanCard
        disabled={disabled}
        yearlyPromoOfferTag={yearlyPromoOfferTag}
        storePricing={storePricing}
        onPress={() => onSubscribe('monthly')}
      />
      <YearlyPlanCard
        disabled={disabled}
        yearlyPromoOfferTag={yearlyPromoOfferTag}
        storePricing={storePricing}
        onPress={() => onSubscribe('yearly')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.md,
  },
  monthlyWrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.charcoal,
  },
  yearlyWrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.55,
  },
  monthlyGradient: {
    padding: spacing.lg,
  },
  yearlyGradient: {
    padding: spacing.lg,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  monthlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  monthlyBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  monthlyPopular: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.saffron,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  monthlyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  monthlyPrice: {
    marginTop: 4,
    fontSize: 34,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
  },
  monthlyPeriod: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
  },
  monthlySub: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  yearlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  yearlyBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  yearlySavings: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  yearlyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  yearlyPrice: {
    marginTop: 4,
    fontSize: 34,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
  },
  yearlyPeriod: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  yearlySub: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
  },
});
