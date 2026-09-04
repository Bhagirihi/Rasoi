import { db } from '@/lib/db';
import { YEARLY_PROMO_OFFER_TAG } from '@/lib/plan-pricing';

export const LAUNCH_PROMO_CODES = [
  {
    id: 'promo_trial_extend_5',
    code: 'MK7Q4VN2',
    kind: 'trial_extend' as const,
    trialExtendDays: 5,
    playOfferTag: null,
    maxRedemptions: 10_000,
  },
  {
    id: 'promo_trial_extend_10',
    code: 'RT9H6WP8',
    kind: 'trial_extend' as const,
    trialExtendDays: 10,
    playOfferTag: null,
    maxRedemptions: 10_000,
  },
  {
    id: 'promo_yearly_discount_5',
    code: 'JX5L3KC7',
    kind: 'yearly_discount' as const,
    trialExtendDays: null,
    playOfferTag: YEARLY_PROMO_OFFER_TAG,
    maxRedemptions: 10_000,
  },
];

export async function ensurePromoCodes(): Promise<void> {
  for (const promo of LAUNCH_PROMO_CODES) {
    await db.promoCode.upsert({
      where: { id: promo.id },
      update: {
        code: promo.code,
        kind: promo.kind,
        trialExtendDays: promo.trialExtendDays,
        playOfferTag: promo.playOfferTag,
        maxRedemptions: promo.maxRedemptions,
        active: true,
      },
      create: {
        id: promo.id,
        code: promo.code,
        kind: promo.kind,
        trialExtendDays: promo.trialExtendDays,
        playOfferTag: promo.playOfferTag,
        maxRedemptions: promo.maxRedemptions,
        redemptionCount: 0,
        active: true,
      },
    });
  }
}
