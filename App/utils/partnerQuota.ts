import type { PlanTier } from '@/constants/plans';
import {
  FREE_PARTNER_SHOPS_PER_MONTH,
  getFreePartnerShopsRemaining,
  type KitchenPreferences,
} from '@/utils/kitchenPreferences';

export type PartnerAccess = {
  canCheckout: boolean;
  freemiumMode: boolean;
  remainingFreeShops: number;
  limitLabel: string | null;
};

export function resolvePartnerAccess(
  effectiveTier: PlanTier,
  kitchenPreferences: KitchenPreferences,
): PartnerAccess {
  if (effectiveTier === 'paid' || effectiveTier === 'trial') {
    return {
      canCheckout: true,
      freemiumMode: effectiveTier === 'trial',
      remainingFreeShops: FREE_PARTNER_SHOPS_PER_MONTH,
      limitLabel: null,
    };
  }

  const remaining = getFreePartnerShopsRemaining(kitchenPreferences);
  return {
    canCheckout: remaining > 0,
    freemiumMode: true,
    remainingFreeShops: remaining,
    limitLabel:
      remaining > 0
        ? `${remaining} free shop${remaining === 1 ? '' : 's'} left this month`
        : 'Free shops used — upgrade for unlimited partner checkout',
  };
}
