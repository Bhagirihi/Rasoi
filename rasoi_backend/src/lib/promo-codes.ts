import { createRowId, DbError, db, queryPg } from '@/lib/db';
import type { PromoCode, User } from '@/lib/db/types';
import {
  TRIAL_DURATION_DAYS,
  YEARLY_PROMO_AMOUNT_INR,
  YEARLY_PROMO_DISCOUNT_PERCENT,
  YEARLY_PROMO_OFFER_TAG,
  YEARLY_PROMO_PLAY_OFFER_ID,
  getTrialTotalDays,
} from '@/lib/plan-pricing';

export { TRIAL_DURATION_DAYS, YEARLY_PROMO_OFFER_TAG, YEARLY_PROMO_DISCOUNT_PERCENT };

export type PromoRedeemResult =
  | {
      ok: true;
      kind: 'trial_extend';
      trialExtendDays: number;
      trialBonusDays: number;
      trialTotalDays: number;
      message: string;
    }
  | {
      ok: true;
      kind: 'yearly_discount';
      playOfferTag: string;
      playOfferId: string;
      discountPercent: number;
      yearlyPromoAmountInr: number;
      message: string;
    };

export class PromoError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = 'PromoError';
  }
}

function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '');
}

export function isActiveTrial(
  user: Pick<User, 'planTier' | 'trialStartedAt' | 'trialBonusDays'>,
  now = Date.now(),
): boolean {
  if (user.planTier !== 'trial' || !user.trialStartedAt) return false;
  const endsAt = user.trialStartedAt.getTime() + getTrialTotalDays(user.trialBonusDays ?? 0) * 86_400_000;
  return now < endsAt;
}

async function findPromoCode(code: string): Promise<PromoCode | null> {
  const normalized = normalizeCode(code);
  if (!normalized) return null;

  const rows = await db.promoCode.findMany({
    where: { code: normalized },
    take: 1,
  });
  return rows[0] ?? null;
}

async function userHasRedemption(userId: string, promoCodeId: string): Promise<boolean> {
  const existing = await db.promoRedemption.findUnique({
    where: { userId_promoCodeId: { userId, promoCodeId } },
  });
  return Boolean(existing);
}

/**
 * Atomically increments redemptionCount, but only while it is still below
 * maxRedemptions. Returns the new count, or null when the promo is missing or
 * already maxed out. The conditional UPDATE is the single serialization point —
 * concurrent redemptions can never overshoot the cap.
 */
async function claimRedemptionSlot(promoId: string): Promise<number | null> {
  const rows = await queryPg<{ redemptionCount: number }>(
    `UPDATE rasoi."PromoCode"
     SET "redemptionCount" = "redemptionCount" + 1, "updatedAt" = NOW()
     WHERE id = $1 AND "redemptionCount" < "maxRedemptions"
     RETURNING "redemptionCount"`,
    [promoId],
  );
  return rows[0]?.redemptionCount ?? null;
}

/**
 * Records the redemption row. The compound unique (userId, promoCodeId) turns a
 * double-submit into a catchable conflict instead of a double-spend or a raw 500.
 */
async function createRedemptionOrThrow(userId: string, promoCodeId: string): Promise<void> {
  try {
    await db.promoRedemption.create({
      data: {
        id: createRowId(),
        userId,
        promoCodeId,
      },
    });
  } catch (error) {
    if (error instanceof DbError && error.code === '23505') {
      throw new PromoError('You have already used this promo code.', 409);
    }
    throw error;
  }
}

export async function redeemPromoCode(user: User, rawCode: string): Promise<PromoRedeemResult> {
  const promo = await findPromoCode(rawCode);
  if (!promo || !promo.active) {
    throw new PromoError('Invalid or expired promo code.');
  }

  if (promo.expiresAt && promo.expiresAt.getTime() <= Date.now()) {
    throw new PromoError('This promo code has expired.');
  }

  if (promo.redemptionCount >= promo.maxRedemptions) {
    throw new PromoError('This promo code has reached its redemption limit.');
  }

  if (await userHasRedemption(user.id, promo.id)) {
    throw new PromoError('You have already used this promo code.');
  }

  if (promo.kind === 'trial_extend') {
    if (user.planTier === 'paid') {
      throw new PromoError('Trial codes cannot be used while Rasoi Plus is active.');
    }
    if (!isActiveTrial(user)) {
      throw new PromoError('Trial extension codes work only during an active free trial.');
    }

    const extendDays = promo.trialExtendDays ?? 0;
    const nextBonusDays = (user.trialBonusDays ?? 0) + extendDays;

    // No $transaction here on purpose: the steps below are idempotent and
    // order-safe, so a mid-way failure is retryable without half-written state.
    await createRedemptionOrThrow(user.id, promo.id);
    const claimed = await claimRedemptionSlot(promo.id);
    if (claimed === null) {
      // Lost the last-slot race after the row was recorded: the pre-check above
      // makes this near-impossible; the user's claim is kept, they just can't
      // consume it. Surface the limit honestly.
      throw new PromoError('This promo code has reached its redemption limit.');
    }
    await db.user.update({
      where: { id: user.id },
      data: { trialBonusDays: nextBonusDays },
    });

    return {
      ok: true,
      kind: 'trial_extend',
      trialExtendDays: extendDays,
      trialBonusDays: nextBonusDays,
      trialTotalDays: getTrialTotalDays(nextBonusDays),
      message: `+${extendDays} days added to your trial.`,
    };
  }

  if (user.planTier === 'paid') {
    throw new PromoError('You already have an active Rasoi Plus subscription.');
  }

  const playOfferTag = promo.playOfferTag ?? YEARLY_PROMO_OFFER_TAG;

  // Idempotent and order-safe (see above) — no fake transaction needed.
  await createRedemptionOrThrow(user.id, promo.id);
  const claimed = await claimRedemptionSlot(promo.id);
  if (claimed === null) {
    throw new PromoError('This promo code has reached its redemption limit.');
  }
  await db.user.update({
    where: { id: user.id },
    data: { yearlyPromoOfferTag: playOfferTag },
  });

  return {
    ok: true,
    kind: 'yearly_discount',
    playOfferTag,
    playOfferId: YEARLY_PROMO_PLAY_OFFER_ID,
    discountPercent: YEARLY_PROMO_DISCOUNT_PERCENT,
    yearlyPromoAmountInr: YEARLY_PROMO_AMOUNT_INR,
    message: `${YEARLY_PROMO_DISCOUNT_PERCENT}% off yearly Rasoi Plus unlocked. Subscribe to apply.`,
  };
}

export async function markYearlyPromoConsumed(userId: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { yearlyPromoOfferTag: null },
  });

  const yearlyPromo = await db.promoCode.findMany({
    where: { kind: 'yearly_discount', playOfferTag: YEARLY_PROMO_OFFER_TAG },
    take: 1,
  });
  const promo = yearlyPromo[0];
  if (!promo) return;

  const redemption = await db.promoRedemption.findUnique({
    where: { userId_promoCodeId: { userId, promoCodeId: promo.id } },
  });
  if (!redemption || redemption.consumedAt) return;

  await db.promoRedemption.update({
    where: { id: redemption.id },
    data: { consumedAt: new Date() },
  });
}
