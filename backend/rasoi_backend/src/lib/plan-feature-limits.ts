import type { User } from '@/lib/db/types';
import type { PlanTier } from '@/lib/types';
import { isActiveTrial } from '@/lib/promo-codes';

export const SAVED_RECIPE_LIMITS: Record<PlanTier, number | null> = {
  free: 10,
  trial: 25,
  paid: null,
};

export function getEffectivePlanTier(
  user: Pick<User, 'planTier' | 'trialStartedAt' | 'trialBonusDays'>,
  now = Date.now(),
): PlanTier {
  if (user.planTier === 'paid') return 'paid';
  if (user.planTier === 'trial' && isActiveTrial(user, now)) return 'trial';
  return 'free';
}

export function getSavedRecipeLimit(
  user: Pick<User, 'planTier' | 'trialStartedAt' | 'trialBonusDays' | 'hasUsedTrial'>,
  paymentsEnabled: boolean,
  now = Date.now(),
): number | null {
  if (!paymentsEnabled) return null;
  const tier = getEffectivePlanTier(user, now);
  return SAVED_RECIPE_LIMITS[tier];
}
