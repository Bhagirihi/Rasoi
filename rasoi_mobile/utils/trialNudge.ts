import {
  getTrialDaysLeft,
  getTrialTimeRemaining,
} from '@/utils/planLogic';
import type { TrialNudgeKind } from '@/utils/trialNudgeStorage';

export type { TrialNudgeKind };

/** Reminders in the second half of trial: 5, 2, 1 full days left, then last day (T-0). */
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
  if (daysLeft === 2) return 't2';
  if (daysLeft === 5) return 't5';
  return null;
}

export function getTrialNudgeCopy(
  kind: TrialNudgeKind,
  trialTimeLabel: string | null,
): { headerTitle: string; heroTitle: string; heroSub: string; statusText: string } {
  if (kind === 't5') {
    return {
      headerTitle: 'Trial halfway done',
      heroTitle: '5 days left on your free trial',
      heroSub:
        'You still have the full 3-day meal plan and unlimited partner checkout. Subscribe to keep unlimited saves, shuffles, and an ad-free experience after trial.',
      statusText: '5 days remaining · 3-day plan & all partners unlocked',
    };
  }

  if (kind === 't2') {
    return {
      headerTitle: 'Trial ending soon',
      heroTitle: '2 days left on your free trial',
      heroSub:
        'Upgrade to Rasoi Plus to keep your 3-day planner, unlimited saves & shuffles, partner checkout, and remove ads when trial ends.',
      statusText: 'Trial ends in 2 days · Plus perks active until then',
    };
  }

  if (kind === 't1') {
    return {
      headerTitle: 'Trial ending soon',
      heroTitle: '1 day left on your free trial',
      heroSub:
        'Upgrade to Rasoi Plus to keep your 3-day planner, unlimited saves & shuffles, partner checkout, and remove ads when trial ends.',
      statusText: 'Trial ends tomorrow · Plus perks active until then',
    };
  }

  const timeHint = trialTimeLabel && trialTimeLabel !== 'Trial ended' ? trialTimeLabel : 'today';
  return {
    headerTitle: 'Trial ends today',
    heroTitle: 'Your free trial ends today',
    heroSub:
      'Subscribe now to keep your 3-day meal plan, unlimited saves, unlimited shuffles, and partner checkout — ad-free.',
    statusText: `Trial ends ${timeHint.toLowerCase()} · Upgrade to keep full access`,
  };
}
