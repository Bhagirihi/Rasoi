'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/app/admin/_components/Toast';
import {
  AdminCard,
  FieldLabel,
  PrimaryButton,
  SelectInput,
  TextInput,
} from '@/app/admin/_components/ui';
import {
  createPromoCodeAction,
  updatePromoCodeAction,
} from '@/app/admin/promo-code-actions';
import type { PromoCodeKind } from '@/lib/db/types';
import { YEARLY_PROMO_OFFER_TAG } from '@/lib/plan-pricing';

export type PromoCodeFormValues = {
  id: string;
  code: string;
  kind: PromoCodeKind;
  trialExtendDays: number | null;
  playOfferTag: string | null;
  maxRedemptions: number;
  redemptionCount: number;
  expiresAt: string | null;
  active: boolean;
};

const KIND_OPTIONS = [
  { value: 'trial_extend', label: 'Trial extension' },
  { value: 'yearly_discount', label: 'Yearly discount' },
];

function toDateInputValue(iso: string | null): string {
  if (!iso) return '';
  return iso.slice(0, 16);
}

function fromDateInputValue(value: string): string | null {
  if (!value.trim()) return null;
  return new Date(value).toISOString();
}

export default function PromoCodeForm({ promo }: { promo?: PromoCodeFormValues }) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState(promo?.code ?? '');
  const [kind, setKind] = useState<PromoCodeKind>(promo?.kind ?? 'trial_extend');
  const [trialExtendDays, setTrialExtendDays] = useState(
    promo?.trialExtendDays?.toString() ?? '5',
  );
  const [playOfferTag, setPlayOfferTag] = useState(
    promo?.playOfferTag ?? YEARLY_PROMO_OFFER_TAG,
  );
  const [maxRedemptions, setMaxRedemptions] = useState(
    promo?.maxRedemptions?.toString() ?? '10000',
  );
  const [expiresAt, setExpiresAt] = useState(toDateInputValue(promo?.expiresAt ?? null));
  const [active, setActive] = useState(promo?.active ?? true);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        code,
        kind,
        trialExtendDays:
          kind === 'trial_extend' ? Number(trialExtendDays) : null,
        playOfferTag: kind === 'yearly_discount' ? playOfferTag.trim() || null : null,
        maxRedemptions: Number(maxRedemptions),
        expiresAt: fromDateInputValue(expiresAt),
        active,
      };

      if (promo) {
        await updatePromoCodeAction(promo.id, payload);
        toast.success(`Saved promo code "${code.trim().toUpperCase()}".`);
      } else {
        await createPromoCodeAction(payload);
        toast.success(`Created promo code "${code.trim().toUpperCase()}".`);
      }

      router.push('/admin/promo-codes');
      router.refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Failed to save promo code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminCard className="p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <label className="block lg:col-span-2">
            <FieldLabel>Code</FieldLabel>
            <TextInput
              value={code}
              onChange={setCode}
              required
              placeholder="MK7Q4VN2"
              className="font-mono uppercase"
            />
          </label>

          <label className="block">
            <FieldLabel>Kind</FieldLabel>
            <SelectInput
              value={kind}
              onChange={(value) => setKind(value as PromoCodeKind)}
              options={KIND_OPTIONS}
            />
          </label>

          <label className="block">
            <FieldLabel>Max redemptions</FieldLabel>
            <TextInput
              type="number"
              value={maxRedemptions}
              onChange={setMaxRedemptions}
              required
            />
          </label>

          {kind === 'trial_extend' ? (
            <label className="block">
              <FieldLabel>Trial extension days</FieldLabel>
              <TextInput
                type="number"
                value={trialExtendDays}
                onChange={setTrialExtendDays}
                required
              />
            </label>
          ) : (
            <label className="block">
              <FieldLabel>Play offer tag</FieldLabel>
              <TextInput
                value={playOfferTag}
                onChange={setPlayOfferTag}
                required
                className="font-mono"
              />
            </label>
          )}

          <label className="block">
            <FieldLabel>Expires at (optional)</FieldLabel>
            <TextInput
              type="datetime-local"
              value={expiresAt}
              onChange={setExpiresAt}
            />
          </label>

          {promo ? (
            <div className="block">
              <FieldLabel>Redemptions used</FieldLabel>
              <p className="mt-2 text-sm text-admin-muted">
                {promo.redemptionCount} (managed automatically)
              </p>
            </div>
          ) : null}
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-admin-border bg-white/50 px-4 py-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            className="h-4 w-4 rounded border-admin-border"
          />
          <span className="text-sm font-medium text-admin-ink">Active code</span>
        </label>

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Saving…' : promo ? 'Save changes' : 'Create promo code'}
        </PrimaryButton>
      </form>
    </AdminCard>
  );
}
