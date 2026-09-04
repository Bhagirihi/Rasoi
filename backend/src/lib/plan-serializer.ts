import type { User } from '@/lib/db/types';
import type { PlanTier, UserPlanResponse } from '@/lib/types';
import {
  getTrialTotalDays,
  resolveYearlyPromoAmountInr,
  TRIAL_DURATION_DAYS,
  YEARLY_PROMO_DISCOUNT_PERCENT,
  YEARLY_PROMO_OFFER_TAG,
} from '@/lib/plan-pricing';
import { isActiveTrial } from '@/lib/promo-codes';

export function serializeUserPlan(user: User, now = Date.now()): UserPlanResponse {
  const trialBonusDays = user.trialBonusDays ?? 0;
  const yearlyPromoOfferTag = user.yearlyPromoOfferTag ?? null;
  const yearlyPromoAmountInr = resolveYearlyPromoAmountInr(yearlyPromoOfferTag);
  const trialActive = isActiveTrial(user, now);

  return {
    planTier: user.planTier as PlanTier,
    trialStartedAt: user.trialStartedAt?.toISOString() ?? null,
    hasUsedTrial: user.hasUsedTrial,
    trialDurationDays: TRIAL_DURATION_DAYS,
    trialBonusDays,
    trialTotalDays: getTrialTotalDays(trialBonusDays),
    trialActive,
    yearlyPromoOfferTag,
    yearlyPromoDiscountPercent:
      yearlyPromoOfferTag === YEARLY_PROMO_OFFER_TAG ? YEARLY_PROMO_DISCOUNT_PERCENT : null,
    yearlyPromoAmountInr,
  };
}
