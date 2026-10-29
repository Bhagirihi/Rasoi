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
  createKitchenStyleAction,
  updateKitchenStyleAction,
} from '@/app/admin/kitchen-style-actions';
import { KITCHEN_STYLE_REGIONS } from '@/lib/kitchen-style-data';
import type { KitchenStyleResponse } from '@/lib/types';

export default function KitchenStyleForm({ style }: { style?: KitchenStyleResponse }) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [id, setId] = useState(style?.id ?? '');
  const [label, setLabel] = useState(style?.label ?? '');
  const [tagline, setTagline] = useState(style?.tagline ?? '');
  const [mood, setMood] = useState(style?.mood ?? '');
  const [region, setRegion] = useState(style?.region ?? 'North');
  const [heroImage, setHeroImage] = useState(style?.heroImage ?? '');
  const [sortOrder, setSortOrder] = useState(style?.sortOrder ?? 0);
  const [active, setActive] = useState(style?.active ?? true);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        label,
        tagline,
        mood,
        region,
        heroImage,
        sortOrder: Number(sortOrder),
        active,
      };

      if (style) {
        await updateKitchenStyleAction(style.id, payload);
        toast.success(`Saved kitchen style "${label}".`);
      } else {
        await createKitchenStyleAction({ id, ...payload });
        toast.success(`Created kitchen style "${label}".`);
      }

      router.push('/admin/kitchen-styles');
      router.refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Failed to save kitchen style');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminCard className="p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {!style && (
            <label className="block lg:col-span-2">
              <FieldLabel>Style ID</FieldLabel>
              <TextInput
                value={id}
                onChange={setId}
                placeholder="punjabi"
                required
              />
              <p className="mt-1 text-xs text-admin-muted">
                Lowercase slug used in the app. Cannot be changed after creation.
              </p>
            </label>
          )}

          <label className="block lg:col-span-2">
            <FieldLabel>Label</FieldLabel>
            <TextInput value={label} onChange={setLabel} required />
          </label>

          <label className="block lg:col-span-2">
            <FieldLabel>Tagline</FieldLabel>
            <TextInput value={tagline} onChange={setTagline} required />
          </label>

          <label className="block">
            <FieldLabel>Mood</FieldLabel>
            <TextInput value={mood} onChange={setMood} required />
          </label>

          <label className="block">
            <FieldLabel>Region</FieldLabel>
            <SelectInput
              value={region}
              onChange={setRegion}
              options={[...KITCHEN_STYLE_REGIONS]}
            />
          </label>

          <label className="block">
            <FieldLabel>Sort order</FieldLabel>
            <TextInput type="number" value={sortOrder} onChange={(v) => setSortOrder(Number(v))} />
          </label>

          <label className="block lg:col-span-2">
            <FieldLabel>Hero image URL</FieldLabel>
            <TextInput value={heroImage} onChange={setHeroImage} required />
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-admin-border bg-white/50 px-4 py-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            className="h-4 w-4 rounded border-admin-border"
          />
          <span className="text-sm font-medium text-admin-ink">
            Active — visible in the mobile app
          </span>
        </label>

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Saving…' : style ? 'Save changes' : 'Create kitchen style'}
        </PrimaryButton>
      </form>
    </AdminCard>
  );
}
