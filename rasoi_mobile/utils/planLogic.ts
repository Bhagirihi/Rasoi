import {
  PLAN_LABELS,
  PLAN_FEATURES,
  TRIAL_DURATION_DAYS,
  type PlanTier,
} from '@/constants/plans';
import { StoredPlanState } from '@/utils/planStorage';

export interface ResolvedPlan {
  storedTier: PlanTier;
  effectiveTier: PlanTier;
  planLabel: string;
  showAds: boolean;
  showPartners: boolean;
  partnersInTrialMode: boolean;
  trialStartedAt: string | null;
  trialEndsAt: string | null;
  trialTimeLabel: string | null;
  trialDaysLeft: number | null;
  canStartTrial: boolean;
  trialExpired: boolean;
}

const MS_PER_DAY = 86_400_000;
const MS_PER_HOUR = 3_600_000;
const MS_PER_MINUTE = 60_000;

export interface TrialTimeRemaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
}

export function getTrialEndsAt(trialStartedAt: string | null): string | null {
  if (!trialStartedAt) return null;
  const started = new Date(trialStartedAt).getTime();
  if (Number.isNaN(started)) return null;
  return new Date(started + TRIAL_DURATION_DAYS * MS_PER_DAY).toISOString();
}

export function getTrialTimeRemaining(
  trialStartedAt: string | null,
  now = Date.now(),
): TrialTimeRemaining | null {
  if (!trialStartedAt) return null;
  const started = new Date(trialStartedAt).getTime();
  if (Number.isNaN(started)) return null;

  const endsAt = started + TRIAL_DURATION_DAYS * MS_PER_DAY;
  const totalMs = endsAt - now;
  if (totalMs <= 0) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0 };
  }

  const days = Math.floor(totalMs / MS_PER_DAY);
  const hours = Math.floor((totalMs % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((totalMs % MS_PER_HOUR) / MS_PER_MINUTE);

  return { totalMs, days, hours, minutes };
}

export function formatTrialTimeLabel(
  trialStartedAt: string | null,
  now = Date.now(),
): string | null {
  const remaining = getTrialTimeRemaining(trialStartedAt, now);
  if (!remaining) return null;
  if (remaining.totalMs <= 0) return 'Trial ended';

  const parts: string[] = [];
  if (remaining.days > 0) {
    parts.push(`${remaining.days} day${remaining.days === 1 ? '' : 's'}`);
  }
  if (remaining.hours > 0) {
    parts.push(`${remaining.hours} hr`);
  }
  if (remaining.days === 0 && remaining.minutes > 0) {
    parts.push(`${remaining.minutes} min`);
  }

  return parts.length > 0 ? `${parts.join(' ')} left` : 'Less than 1 min left';
}

/** Compact label for header badges — matches formatTrialTimeLabel math (floor, not ceil). */
export function formatTrialCompactLabel(
  trialStartedAt: string | null,
  now = Date.now(),
): string | null {
  const remaining = getTrialTimeRemaining(trialStartedAt, now);
  if (!remaining) return null;
  if (remaining.totalMs <= 0) return 'Ended';

  const parts: string[] = [];
  if (remaining.days > 0) {
    parts.push(`${remaining.days}d`);
  }
  if (remaining.hours > 0) {
    parts.push(`${remaining.hours}h`);
  }
  if (remaining.days === 0 && remaining.minutes > 0) {
    parts.push(`${remaining.minutes}m`);
  }

  return parts.length > 0 ? parts.join(' ') : '<1m';
}

export function formatTrialEndsAt(trialStartedAt: string | null): string | null {
  const endsAt = getTrialEndsAt(trialStartedAt);
  if (!endsAt) return null;
  return new Date(endsAt).toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getTrialDaysLeft(trialStartedAt: string | null, now = Date.now()): number | null {
  if (!trialStartedAt) return null;
  const started = new Date(trialStartedAt).getTime();
  if (Number.isNaN(started)) return null;
  const elapsed = now - started;
  const remainingMs = TRIAL_DURATION_DAYS * MS_PER_DAY - elapsed;
  if (remainingMs <= 0) return 0;
  return Math.floor(remainingMs / MS_PER_DAY);
}

export function resolvePlanState(stored: StoredPlanState, now = Date.now()): ResolvedPlan {
  if (stored.planTier === 'paid') {
    const features = PLAN_FEATURES.paid;
    return {
      storedTier: 'paid',
      effectiveTier: 'paid',
      planLabel: PLAN_LABELS.paid,
      showAds: features.ads,
      showPartners: features.partners,
      partnersInTrialMode: features.partnersTrialMode,
      trialStartedAt: stored.trialStartedAt,
      trialEndsAt: null,
      trialTimeLabel: null,
      trialDaysLeft: null,
      canStartTrial: false,
      trialExpired: stored.hasUsedTrial,
    };
  }

  if (stored.planTier === 'trial' && stored.trialStartedAt) {
    const daysLeft = getTrialDaysLeft(stored.trialStartedAt, now);
    if (daysLeft !== null && daysLeft > 0) {
      const features = PLAN_FEATURES.trial;
      return {
        storedTier: 'trial',
        effectiveTier: 'trial',
        planLabel: PLAN_LABELS.trial,
        showAds: features.ads,
        showPartners: features.partners,
        partnersInTrialMode: features.partnersTrialMode,
        trialStartedAt: stored.trialStartedAt,
        trialEndsAt: getTrialEndsAt(stored.trialStartedAt),
        trialTimeLabel: formatTrialTimeLabel(stored.trialStartedAt, now),
        trialDaysLeft: daysLeft,
        canStartTrial: false,
        trialExpired: false,
      };
    }

    const features = PLAN_FEATURES.free;
    return {
      storedTier: 'trial',
      effectiveTier: 'free',
      planLabel: PLAN_LABELS.free,
      showAds: features.ads,
      showPartners: features.partners,
      partnersInTrialMode: features.partnersTrialMode,
      trialStartedAt: stored.trialStartedAt,
      trialEndsAt: getTrialEndsAt(stored.trialStartedAt),
      trialTimeLabel: 'Trial ended',
      trialDaysLeft: 0,
      canStartTrial: false,
      trialExpired: true,
    };
  }

  const features = PLAN_FEATURES.free;
  return {
    storedTier: stored.planTier,
    effectiveTier: 'free',
    planLabel: PLAN_LABELS.free,
    showAds: features.ads,
    showPartners: features.partners,
    partnersInTrialMode: features.partnersTrialMode,
    trialStartedAt: stored.trialStartedAt,
    trialEndsAt: null,
    trialTimeLabel: null,
    trialDaysLeft: null,
    canStartTrial: !stored.hasUsedTrial,
    trialExpired: stored.hasUsedTrial,
  };
}
