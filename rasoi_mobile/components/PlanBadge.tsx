import { Crown, Sparkles } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';

export function PlanBadge() {
  const { effectiveTier, planLabel, trialDaysLeft } = useAppContext();

  if (effectiveTier === 'paid') {
    return (
      <View style={[styles.badge, styles.paid]}>
        <Crown size={12} color={colors.white} />
        <Text style={styles.paidText}>{planLabel}</Text>
      </View>
    );
  }

  if (effectiveTier === 'trial' && trialDaysLeft !== null) {
    return (
      <View style={[styles.badge, styles.trial]}>
        <Sparkles size={12} color={colors.primary} />
        <Text style={styles.trialText}>
          Trial · {trialDaysLeft}d left
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, styles.free]}>
      <Text style={styles.freeText}>Free plan</Text>
    </View>
  );
}

export function FreeBadge() {
  return <PlanBadge />;
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  free: {
    backgroundColor: 'rgba(107,114,128,0.12)',
  },
  freeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
  },
  trial: {
    backgroundColor: 'rgba(255,107,53,0.12)',
  },
  trialText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  paid: {
    backgroundColor: colors.primary,
  },
  paidText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
});
