import { Alert } from 'react-native';

import type { Href } from 'expo-router';

import { getTrialDaysLeft, getTrialTotalDays } from '@/utils/planLogic';
import { PAYWALL_HREF } from '@/utils/routes';
import {
  markTrialValueMomentShown,
  wasTrialValueMomentShown,
} from '@/utils/trialValueMoment';

type RouterLike = { push: (href: Href) => void };

export async function isMidTrialValueMomentEligible(options: {
  effectiveTier: string;
  trialStartedAt: string | null | undefined;
  trialBonusDays?: number;
}): Promise<boolean> {
  if (options.effectiveTier !== 'trial' || !options.trialStartedAt) return false;
  if (await wasTrialValueMomentShown()) return false;

  const daysLeft = getTrialDaysLeft(
    options.trialStartedAt,
    Date.now(),
    options.trialBonusDays ?? 0,
  );
  if (daysLeft == null) return false;
  const total = getTrialTotalDays(options.trialBonusDays ?? 0);
  const daysUsed = total - daysLeft;
  return (
    daysUsed >= Math.max(4, Math.floor(total * 0.35)) && daysLeft >= 3
  );
}

/**
 * One-shot mid-trial prompt after a cook or shop win.
 * Shows roughly halfway through the trial window.
 */
export async function maybeShowTrialValueMoment(options: {
  effectiveTier: string;
  trialStartedAt: string | null | undefined;
  trialBonusDays?: number;
  router: RouterLike;
  trigger: 'cook' | 'shop';
}): Promise<boolean> {
  if (!(await isMidTrialValueMomentEligible(options))) return false;

  await markTrialValueMomentShown();

  const body =
    options.trigger === 'cook'
      ? 'You just cooked with Rasoi. Keep unlimited partner checkout and the 3-day plan after trial.'
      : 'You just finished shopping with partners. Keep unlimited checkouts after trial ends.';

  Alert.alert('Loving Rasoi so far?', body, [
    { text: 'Not now', style: 'cancel' },
    {
      text: 'See Plus',
      onPress: () => options.router.push(PAYWALL_HREF),
    },
  ]);
  return true;
}
