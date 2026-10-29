'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/app/admin/_components/Toast';
import { updatePartnerLinksAction } from '@/app/admin/partner-actions';
import {
  AdminCard,
  GhostButton,
  PrimaryButton,
  SelectInput,
  TextInput,
} from '@/app/admin/_components/ui';
import {
  buildDefaultPartnerUrls,
  PARTNER_REGIONS,
  PARTNER_REGION_LABELS,
  type PartnerRegion,
} from '@/lib/partners';

type PartnerLinkRow = {
  clientKey: string;
  partnerId: string;
  label: string;
  category: 'grocery' | 'delivery';
  region: PartnerRegion;
  deepLinkUrl: string;
  webUrl: string;
  active: boolean;
  isNew?: boolean;
};

function createDraftRow(region: PartnerRegion): PartnerLinkRow {
  const clientKey = `draft-${crypto.randomUUID()}`;
  const defaults = buildDefaultPartnerUrls(region);

  return {
    clientKey,
    partnerId: '',
    label: 'New partner',
    category: 'grocery',
    region,
    deepLinkUrl: defaults.deepLinkUrl,
    webUrl: defaults.webUrl,
    active: true,
    isNew: true,
  };
}

export default function PartnerLinksForm({ links }: { links: PartnerLinkRow[] }) {
  const router = useRouter();
  const toast = useToast();
  const [rows, setRows] = useState<PartnerLinkRow[]>(links);
  const [deletedPartnerIds, setDeletedPartnerIds] = useState<string[]>([]);
  const [activeRegion, setActiveRegion] = useState<PartnerRegion>('IN');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRows(links);
    setDeletedPartnerIds([]);
  }, [links]);

  const visibleRows = useMemo(
    () => rows.filter((row) => row.region === activeRegion),
    [rows, activeRegion],
  );

  const activeCount = visibleRows.filter((row) => row.active).length;

  const updateRow = (clientKey: string, patch: Partial<PartnerLinkRow>) => {
    setRows((current) =>
      current.map((row) => (row.clientKey === clientKey ? { ...row, ...patch } : row)),
    );
  };

  const addPartner = () => {
    setRows((current) => [...current, createDraftRow(activeRegion)]);
  };

  const removePartner = (row: PartnerLinkRow) => {
    if (!row.isNew && row.partnerId) {
      setDeletedPartnerIds((current) =>
        current.includes(row.partnerId) ? current : [...current, row.partnerId],
      );
    }
    setRows((current) => current.filter((item) => item.clientKey !== row.clientKey));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const incomplete = rows.some((row) => !row.partnerId.trim() || !row.label.trim());
    if (incomplete) {
      toast.error('Every partner needs an id and label before saving.');
      return;
    }

    const normalizedIds = rows.map((row) => row.partnerId.trim().toLowerCase());
    const duplicateId = normalizedIds.find(
      (id, index) => normalizedIds.indexOf(id) !== index,
    );
    if (duplicateId) {
      toast.error(`Duplicate partner id: ${duplicateId}`);
      return;
    }

    setLoading(true);

    try {
      await updatePartnerLinksAction({
        links: rows.map((row) => ({
          partnerId: row.partnerId.trim().toLowerCase(),
          label: row.label.trim(),
          category: row.category,
          region: row.region,
          deepLinkUrl: row.deepLinkUrl.trim(),
          webUrl: row.webUrl.trim(),
          active: row.active,
        })),
        deletedPartnerIds,
      });
      toast.success('Partner links saved.');
      router.refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Failed to save partner links');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {PARTNER_REGIONS.map((region) => {
          const count = rows.filter((row) => row.region === region && row.active).length;
          const selected = activeRegion === region;

          return (
            <button
              key={region}
              type="button"
              onClick={() => setActiveRegion(region)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                selected
                  ? 'border-admin-gold bg-admin-gold/15 text-admin-ink'
                  : 'border-admin-border bg-white/60 text-admin-muted hover:border-admin-gold/40 hover:text-admin-ink'
              }`}
            >
              {region}
              <span className="ml-1.5 text-xs opacity-70">{PARTNER_REGION_LABELS[region]}</span>
              <span className="ml-2 rounded-full bg-white/80 px-1.5 py-0.5 text-[10px] font-semibold text-admin-muted">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-admin-muted">
          {activeCount} active in {PARTNER_REGION_LABELS[activeRegion]}. Use {'{query}'} in URLs.
          Save applies adds, edits, and deletes.
        </p>
        <GhostButton type="button" onClick={addPartner}>
          + Add partner
        </GhostButton>
      </div>

      <AdminCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-admin-border bg-white/50 text-xs uppercase tracking-wide text-admin-muted">
              <tr>
                <th className="w-12 px-3 py-3 font-medium">On</th>
                <th className="w-40 px-3 py-3 font-medium">Id / label</th>
                <th className="w-28 px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Deep link</th>
                <th className="px-3 py-3 font-medium">Web fallback</th>
                <th className="w-20 px-3 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/70">
              {visibleRows.map((row) => (
                <tr
                  key={row.clientKey}
                  className={row.active ? 'bg-white' : 'bg-white/40 opacity-70'}
                >
                  <td className="px-3 py-2 align-middle">
                    <input
                      type="checkbox"
                      checked={row.active}
                      onChange={(event) =>
                        updateRow(row.clientKey, { active: event.target.checked })
                      }
                      className="h-4 w-4 rounded border-admin-border"
                      aria-label={`Active ${row.label}`}
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    {row.isNew ? (
                      <TextInput
                        value={row.partnerId}
                        onChange={(v) =>
                          updateRow(row.clientKey, { partnerId: v.toLowerCase().replace(/\s+/g, '_') })
                        }
                        placeholder="partner_id"
                        className="mt-0 rounded-lg px-2 py-1.5 font-mono text-xs"
                      />
                    ) : (
                      <p className="font-mono text-[11px] text-admin-muted">{row.partnerId}</p>
                    )}
                    <TextInput
                      value={row.label}
                      onChange={(v) => updateRow(row.clientKey, { label: v })}
                      className="mt-1 rounded-lg px-2 py-1.5 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <SelectInput
                      value={row.category}
                      onChange={(v) =>
                        updateRow(row.clientKey, {
                          category: v as PartnerLinkRow['category'],
                        })
                      }
                      options={[
                        { value: 'grocery', label: 'Grocery' },
                        { value: 'delivery', label: 'Delivery' },
                      ]}
                      className="mt-0 rounded-lg px-2 py-1.5 text-xs"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <TextInput
                      value={row.deepLinkUrl}
                      onChange={(v) => updateRow(row.clientKey, { deepLinkUrl: v })}
                      className="mt-0 rounded-lg px-2 py-1.5 font-mono text-xs"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <TextInput
                      value={row.webUrl}
                      onChange={(v) => updateRow(row.clientKey, { webUrl: v })}
                      className="mt-0 rounded-lg px-2 py-1.5 font-mono text-xs"
                    />
                  </td>
                  <td className="px-3 py-2 align-middle">
                    <button
                      type="button"
                      onClick={() => removePartner(row)}
                      className="rounded-lg border border-admin-border px-2 py-1 text-xs font-medium text-admin-muted transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visibleRows.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-admin-muted">No partners in this region yet.</p>
            <GhostButton type="button" onClick={addPartner} className="mt-3">
              + Add first partner
            </GhostButton>
          </div>
        ) : null}
      </AdminCard>

      <PrimaryButton type="submit" disabled={loading}>
        {loading ? 'Saving…' : 'Save all regions'}
      </PrimaryButton>
    </form>
  );
}
