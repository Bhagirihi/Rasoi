import { useEffect, useMemo, useState } from 'react';

import type { PlanTier } from '@/constants/plans';
import {
  formatTrialEndsAt,
  formatTrialTimeLabel,
  getTrialDaysLeft,
} from '@/utils/planLogic';

export function useTrialClock(trialStartedAt: string | null, effectiveTier: PlanTier) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (effectiveTier !== 'trial' || !trialStartedAt) return;
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, [effectiveTier, trialStartedAt]);

  return useMemo(
    () => ({
      trialTimeLabel: formatTrialTimeLabel(trialStartedAt, now),
      trialEndsAtLabel: formatTrialEndsAt(trialStartedAt),
      trialDaysLeft: getTrialDaysLeft(trialStartedAt, now),
    }),
    [trialStartedAt, now],
  );
}
