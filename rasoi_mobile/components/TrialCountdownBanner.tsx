import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Clock, Crown } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TRIAL_DURATION_DAYS } from '@/constants/plans';
import { colors, radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useTrialClock } from '@/hooks/useTrialClock';
import { PAYWALL_HREF } from '@/utils/routes';

export default function TrialCountdownBanner() {
  const router = useRouter();
  const { effectiveTier, trialStartedAt } = useAppContext();
  const { trialTimeLabel, trialEndsAtLabel, trialDaysLeft } = useTrialClock(
    trialStartedAt,
    effectiveTier,
  );

  if (effectiveTier !== 'trial' || trialDaysLeft === null || trialDaysLeft <= 0) {
    return null;
  }

  const isDayTwoReminder = trialDaysLeft === TRIAL_DURATION_DAYS - 1;

  return (
    <Pressable onPress={() => router.push(PAYWALL_HREF)} style={styles.wrap}>
      <LinearGradient
        colors={isDayTwoReminder ? ['#1A1A2E', '#2A2A3E'] : ['#FF6B35', '#FF9933']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.iconWrap}>
          <Clock size={18} color={colors.white} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>
            {isDayTwoReminder
              ? 'Day 2 — try checkout tonight'
              : `Rasoi Plus trial · ${trialTimeLabel ?? 'Active'}`}
          </Text>
          <Text style={styles.sub}>
            {trialEndsAtLabel
              ? `Ends ${trialEndsAtLabel} · Partners unlocked — subscribe to keep access`
              : 'Partners unlocked now — subscribe before trial ends'}
          </Text>
        </View>
        <Crown size={18} color={colors.white} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
  sub: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(255,255,255,0.9)',
  },
});
