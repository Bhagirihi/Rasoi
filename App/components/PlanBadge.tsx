import type { ReactNode } from 'react';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Crown, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useTrialClock } from '@/hooks/useTrialClock';
import { formatTrialCompactLabel } from '@/utils/planLogic';
import { PAYWALL_HREF } from '@/utils/routes';

export function PlanBadge() {
  const router = useRouter();
  const { effectiveTier, planLabel, trialStartedAt, trialBonusDays, showPaywall } = useAppContext();
  const { trialTimeLabel } = useTrialClock(trialStartedAt, effectiveTier, trialBonusDays);
  const trialCompact =
    effectiveTier === 'trial'
      ? formatTrialCompactLabel(trialStartedAt, Date.now(), trialBonusDays)
      : null;

  const openPaywall = () => {
    if (!showPaywall) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(PAYWALL_HREF);
  };

  let badge: ReactNode;

  if (effectiveTier === 'paid') {
    badge = (
      <View style={[styles.badge, styles.paid]}>
        <Crown size={12} color={colors.white} />
        <Text style={styles.paidText}>{planLabel}</Text>
      </View>
    );
  } else if (effectiveTier === 'trial' && trialCompact && trialTimeLabel !== 'Trial ended') {
    badge = (
      <View style={[styles.badge, styles.trial]}>
        <Sparkles size={12} color={colors.primary} />
        <Text style={styles.trialText}>Trial · {trialCompact} left</Text>
      </View>
    );
  } else {
    badge = (
      <View style={[styles.badge, styles.free]}>
        <Text style={styles.freeText}>Free plan</Text>
      </View>
    );
  }

  if (!showPaywall) {
    return badge;
  }

  return (
    <Pressable
      onPress={openPaywall}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="View Rasoi Plus plans"
    >
      {badge}
    </Pressable>
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
    backgroundColor: 'rgba(255,107,53,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.28)',
  },
  freeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  trial: {
    backgroundColor: 'rgba(255,107,53,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.28)',
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
