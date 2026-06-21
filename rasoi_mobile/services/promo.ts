import type { UserProfileResponse } from '@/types/api';
import { authApiFetch } from '@/utils/api';

export type PromoRedeemResponse =
  | {
      ok: true;
      kind: 'trial_extend';
      trialExtendDays: number;
      trialBonusDays: number;
      message: string;
      plan: UserProfileResponse['plan'];
    }
  | {
      ok: true;
      kind: 'yearly_discount';
      playOfferTag: string;
      discountPercent: number;
      message: string;
      plan: UserProfileResponse['plan'];
    };

export async function redeemPromoCode(code: string): Promise<PromoRedeemResponse> {
  return authApiFetch<PromoRedeemResponse>('/api/users/me/promo/redeem', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}
