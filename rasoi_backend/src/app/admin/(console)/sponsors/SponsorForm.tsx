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
import { createSponsorAction, updateSponsorAction } from '@/app/admin/sponsor-actions';
import type { SponsorResponse } from '@/lib/types';

export default function SponsorForm({ sponsor }: { sponsor?: SponsorResponse }) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [placement, setPlacement] = useState(sponsor?.placement ?? 'home');
  const [brandName, setBrandName] = useState(sponsor?.brandName ?? '');
  const [productLabel, setProductLabel] = useState(sponsor?.productLabel ?? '');
  const [tagline, setTagline] = useState(sponsor?.tagline ?? '');
  const [logoUrl, setLogoUrl] = useState(sponsor?.logoUrl ?? '');
  const [cta, setCta] = useState(sponsor?.cta ?? 'Shop now');
  const [searchQuery, setSearchQuery] = useState(sponsor?.searchQuery ?? '');
  const [recipeId, setRecipeId] = useState(sponsor?.recipeId ?? '');
  const [priority, setPriority] = useState(sponsor?.priority ?? 0);
  const [active, setActive] = useState(sponsor?.active ?? true);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        placement,
        brandName,
        productLabel,
        tagline,
        logoUrl,
        cta,
        searchQuery: searchQuery || undefined,
        recipeId: recipeId || undefined,
        priority: Number(priority),
        active,
      };

      if (sponsor) {
        await updateSponsorAction(sponsor.id, payload);
        toast.success(`Saved sponsor "${brandName}".`);
      } else {
        await createSponsorAction(payload);
        toast.success(`Created sponsor "${brandName}".`);
      }

      router.push('/admin/sponsors');
      router.refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Failed to save sponsor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminCard className="p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <label className="block">
            <FieldLabel>Placement</FieldLabel>
            <SelectInput
              value={placement}
              onChange={(v) => setPlacement(v as typeof placement)}
              options={['home', 'pantry', 'recipe']}
            />
          </label>

          <label className="block">
            <FieldLabel>Priority</FieldLabel>
            <TextInput type="number" value={priority} onChange={(v) => setPriority(Number(v))} />
          </label>

          <label className="block lg:col-span-2">
            <FieldLabel>Brand name</FieldLabel>
            <TextInput value={brandName} onChange={setBrandName} required />
          </label>

          <label className="block lg:col-span-2">
            <FieldLabel>Product label</FieldLabel>
            <TextInput value={productLabel} onChange={setProductLabel} required />
          </label>

          <label className="block lg:col-span-2">
            <FieldLabel>Tagline</FieldLabel>
            <TextInput value={tagline} onChange={setTagline} required />
          </label>

          <label className="block lg:col-span-2">
            <FieldLabel>Logo URL</FieldLabel>
            <TextInput value={logoUrl} onChange={setLogoUrl} required />
          </label>

          <label className="block">
            <FieldLabel>CTA label</FieldLabel>
            <TextInput value={cta} onChange={setCta} />
          </label>

          <label className="block">
            <FieldLabel>Search query</FieldLabel>
            <TextInput value={searchQuery} onChange={setSearchQuery} />
          </label>

          <label className="block lg:col-span-2">
            <FieldLabel>Recipe ID (optional)</FieldLabel>
            <TextInput value={recipeId} onChange={setRecipeId} />
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-admin-border bg-white/50 px-4 py-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            className="h-4 w-4 rounded border-admin-border"
          />
          <span className="text-sm font-medium text-admin-ink">Active placement</span>
        </label>

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Saving…' : sponsor ? 'Save changes' : 'Create sponsor'}
        </PrimaryButton>
      </form>
    </AdminCard>
  );
}
