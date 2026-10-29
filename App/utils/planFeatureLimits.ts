import {
  PLAN_FEATURE_LIMITS,
  type PlanFeatureLimits,
} from '@/constants/planFeatureLimits';
import type { PlanTier } from '@/constants/plans';

export function resolvePlanFeatureLimits(
  effectiveTier: PlanTier,
  paymentsEnabled: boolean,
): PlanFeatureLimits {
  if (!paymentsEnabled) {
    return PLAN_FEATURE_LIMITS.paid;
  }
  return PLAN_FEATURE_LIMITS[effectiveTier];
}

export function getEffectiveAllergyExclusions(
  limits: PlanFeatureLimits,
  allergyExclusions: string[],
): string[] {
  return limits.allergyFilter ? allergyExclusions : [];
}
