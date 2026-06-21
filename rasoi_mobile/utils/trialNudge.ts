import {
  getTrialDaysLeft,
  getTrialTimeRemaining,
} from '@/utils/planLogic';
import type { TrialNudgeKind } from '@/utils/trialNudgeStorage';

export type { TrialNudgeKind };

/** T-1 = 1 full day left; T-0 = last day (hours/minutes left, 0 full days). */
export function getTrialNudgeKind(
  trialStartedAt: string | null,
  trialBonusDays = 0,
  now = Date.now(),
): TrialNudgeKind | null {
  if (!trialStartedAt) return null;

  const remaining = getTrialTimeRemaining(trialStartedAt, now, trialBonusDays);
  if (!remaining || remaining.totalMs <= 0) return null;

  const daysLeft = getTrialDaysLeft(trialStartedAt, now, trialBonusDays);
  if (daysLeft === null) return null;
  if (daysLeft === 0) return 't0';
  if (daysLeft === 1) return 't1';
  return null;
}

export function getTrialNudgeCopy(
  kind: TrialNudgeKind,
  trialTimeLabel: string | null,
): { headerTitle: string; heroTitle: string; heroSub: string; statusText: string } {
  if (kind === 't1') {
    return {
      headerTitle: 'Trial ending soon',
      heroTitle: '1 day left on your free trial',
      heroSub:
        'Upgrade to Rasoi Plus to keep partner checkout and remove ads when your trial ends.',
      statusText: 'Your trial ends tomorrow · Partners are unlocked until then',
    };
  }

  const timeHint = trialTimeLabel && trialTimeLabel !== 'Trial ended' ? trialTimeLabel : 'today';
  return {
    headerTitle: 'Trial ends today',
    heroTitle: 'Your free trial ends today',
    heroSub:
      'Subscribe to Rasoi Plus now to keep Blinkit, Zepto, Instamart, Zomato & Swiggy checkout without interruption.',
    statusText: `Trial ends ${timeHint.toLowerCase()} · Upgrade to keep access`,
  };
}
