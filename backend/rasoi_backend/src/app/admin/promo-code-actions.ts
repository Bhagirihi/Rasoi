'use server';

import { revalidatePath } from 'next/cache';

import { getAdminFromCookies } from '@/lib/auth';
import { createRowId, db } from '@/lib/db';
import { DbError } from '@/lib/db/errors';
import { YEARLY_PROMO_OFFER_TAG } from '@/lib/plan-pricing';
import { promoCodeCreateSchema, promoCodeUpdateSchema } from '@/lib/validators';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

function toPromoCodeData(input: {
  code: string;
  kind: 'trial_extend' | 'yearly_discount';
  trialExtendDays?: number | null;
  playOfferTag?: string | null;
  maxRedemptions: number;
  expiresAt?: string | null;
  active: boolean;
}) {
  return {
    code: input.code,
    kind: input.kind,
    trialExtendDays: input.kind === 'trial_extend' ? (input.trialExtendDays ?? null) : null,
    playOfferTag:
      input.kind === 'yearly_discount'
        ? (input.playOfferTag?.trim() || YEARLY_PROMO_OFFER_TAG)
        : null,
    maxRedemptions: input.maxRedemptions,
    expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    active: input.active,
  };
}

function handlePromoDbError(error: unknown): never {
  if (error instanceof DbError && error.code === '23505') {
    throw new Error('A promo code with that value already exists.');
  }
  throw error instanceof Error ? error : new Error('Promo code save failed.');
}

export async function createPromoCodeAction(raw: unknown) {
  await requireAdminSession();
  const input = promoCodeCreateSchema.parse(raw);

  try {
    await db.promoCode.create({
      data: {
        id: createRowId(),
        ...toPromoCodeData(input),
        redemptionCount: 0,
      },
    });
  } catch (error) {
    handlePromoDbError(error);
  }

  revalidatePath('/admin/promo-codes');
}

export async function updatePromoCodeAction(id: string, raw: unknown) {
  await requireAdminSession();
  const input = promoCodeUpdateSchema.parse(raw);
  const existing = await db.promoCode.findUnique({ where: { id } });
  if (!existing) throw new Error('Promo code not found.');

  const nextKind = input.kind ?? existing.kind;
  const merged = {
    code: input.code ?? existing.code,
    kind: nextKind,
    trialExtendDays:
      input.trialExtendDays !== undefined
        ? input.trialExtendDays
        : existing.trialExtendDays,
    playOfferTag:
      input.playOfferTag !== undefined ? input.playOfferTag : existing.playOfferTag,
    maxRedemptions: input.maxRedemptions ?? existing.maxRedemptions,
    expiresAt:
      input.expiresAt !== undefined
        ? input.expiresAt
        : existing.expiresAt?.toISOString() ?? null,
    active: input.active ?? existing.active,
  };

  const validated = promoCodeCreateSchema.parse(merged);

  try {
    await db.promoCode.update({
      where: { id },
      data: toPromoCodeData(validated),
    });
  } catch (error) {
    handlePromoDbError(error);
  }

  revalidatePath('/admin/promo-codes');
  revalidatePath(`/admin/promo-codes/${id}`);
}

export async function deletePromoCodeAction(id: string) {
  await requireAdminSession();
  const existing = await db.promoCode.findUnique({ where: { id } });
  if (!existing) throw new Error('Promo code not found.');

  await db.promoCode.delete({ where: { id } });
  revalidatePath('/admin/promo-codes');
}
