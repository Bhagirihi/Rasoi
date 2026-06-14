'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/app/admin/_components/Toast';
import { updatePartnerLinksAction } from '@/app/admin/partner-actions';
import {
  AdminCard,
  Badge,
  FieldLabel,
  PrimaryButton,
  TextInput,
} from '@/app/admin/_components/ui';
import type { PartnerId } from '@/lib/partners';

type PartnerLinkRow = {
  partnerId: PartnerId;
  label: string;
  category: 'grocery' | 'delivery';
  deepLinkUrl: string;
  webUrl: string;
  active: boolean;
};

export default function PartnerLinksForm({ links }: { links: PartnerLinkRow[] }) {
  const router = useRouter();
  const toast = useToast();
  const [rows, setRows] = useState(links);
  const [loading, setLoading] = useState(false);

  const updateRow = (partnerId: PartnerId, patch: Partial<PartnerLinkRow>) => {
    setRows((current) =>
      current.map((row) => (row.partnerId === partnerId ? { ...row, ...patch } : row)),
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await updatePartnerLinksAction({ links: rows });
      toast.success('Partner links saved. The mobile app will receive updates via /api/partners.');
      router.refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Failed to save partner links');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {rows.map((row) => (
        <AdminCard key={row.partnerId} className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-admin-border pb-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-admin-ink">{row.label}</h2>
              <p className="mt-1 text-sm text-admin-muted">Partner ID: {row.partnerId}</p>
            </div>
            <Badge tone={row.category === 'grocery' ? 'gold' : 'neutral'}>
              {row.category}
            </Badge>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <label className="block lg:col-span-2">
              <FieldLabel>Display label</FieldLabel>
              <TextInput value={row.label} onChange={(v) => updateRow(row.partnerId, { label: v })} />
            </label>

            <label className="block lg:col-span-2">
              <FieldLabel>Deep link URL</FieldLabel>
              <TextInput
                value={row.deepLinkUrl}
                onChange={(v) => updateRow(row.partnerId, { deepLinkUrl: v })}
              />
              <p className="mt-2 text-xs text-admin-muted">
                App opens this in Blinkit / Zepto / Swiggy / Zomato when installed. Include {'{query}'} for the search term.
              </p>
            </label>

            <label className="block lg:col-span-2">
              <FieldLabel>Web fallback URL</FieldLabel>
              <TextInput
                value={row.webUrl}
                onChange={(v) => updateRow(row.partnerId, { webUrl: v })}
              />
              <p className="mt-2 text-xs text-admin-muted">
                Used when the native app link is unavailable.
              </p>
            </label>
          </div>

          <label className="mt-6 flex items-center gap-3 rounded-xl border border-admin-border bg-white/50 px-4 py-3">
            <input
              type="checkbox"
              checked={row.active}
              onChange={(event) => updateRow(row.partnerId, { active: event.target.checked })}
              className="h-4 w-4 rounded border-admin-border"
            />
            <span className="text-sm font-medium text-admin-ink">Active in mobile app</span>
          </label>
        </AdminCard>
      ))}

      <PrimaryButton type="submit" disabled={loading}>
        {loading ? 'Saving…' : 'Save all partner links'}
      </PrimaryButton>
    </form>
  );
}
