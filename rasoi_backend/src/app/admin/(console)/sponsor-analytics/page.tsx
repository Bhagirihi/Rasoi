import { Suspense } from 'react';

import SponsorAnalyticsChart from '@/app/admin/_components/SponsorAnalyticsChart';
import SponsorAnalyticsFilterPanel from '@/app/admin/_components/SponsorAnalyticsFilterPanel';
import SponsorEventsTable from '@/app/admin/_components/SponsorEventsTable';
import { AdminCard, GhostButton, PageHeader } from '@/app/admin/_components/ui';
import { parseSponsorAnalyticsFilters } from '@/lib/sponsor-analytics-filters';
import {
  getSponsorAnalyticsStats,
  getSponsorBrandOptions,
  getSponsorEventList,
} from '@/lib/sponsor-analytics';
import { getSponsorPlacementLabel } from '@/lib/sponsor-placements';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function filterDescription(filters: ReturnType<typeof parseSponsorAnalyticsFilters>, stats: Awaited<ReturnType<typeof getSponsorAnalyticsStats>>) {
  const parts = [
    `${stats.totalImpressions} impressions`,
    `${stats.totalTaps} taps`,
    `${stats.overallTapRate}% tap rate`,
    `last ${stats.days} days`,
  ];

  if (filters.brand) {
    parts.unshift(filters.brand);
  }

  if (filters.placement) {
    parts.splice(1, 0, getSponsorPlacementLabel(filters.placement));
  }

  return parts.join(' · ');
}

export default async function SponsorAnalyticsAdminPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseSponsorAnalyticsFilters(params);

  const [stats, events, brands] = await Promise.all([
    getSponsorAnalyticsStats(filters),
    getSponsorEventList(filters),
    getSponsorBrandOptions(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sponsor analytics"
        description={filterDescription(filters, stats)}
        action={
          <div className="flex flex-wrap gap-3">
            <GhostButton href="/admin/sponsors">Manage sponsors</GhostButton>
          </div>
        }
      />

      <Suspense fallback={null}>
        <SponsorAnalyticsFilterPanel brands={brands} />
      </Suspense>

      <AdminCard className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
          Performance
          {filters.brand ? ` — ${filters.brand}` : ''}
        </p>
        <div className="mt-5">
          <SponsorAnalyticsChart stats={stats} />
        </div>
      </AdminCard>

      <AdminCard className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
          How it works
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-admin-muted">
          <li>Filter by configured sponsor brand, placement, or time period</li>
          <li>Impression — sponsor card rendered on Home, Pantry, Recipes, Saved, or Recipe detail</li>
          <li>Tap — user tapped the card (logged before phone gate)</li>
          <li>Export CSV for Amul / Everest pilot reports</li>
        </ul>
      </AdminCard>

      <div>
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
          Raw event log
          {filters.brand ? ` · ${filters.brand}` : ''}
          {events.length >= 500 ? ' (latest 500)' : ''}
        </p>
        <SponsorEventsTable
          items={events}
          emptyMessage={
            filters.brand
              ? `No events for ${filters.brand} in this period. Try a longer range or open the app with this sponsor live.`
              : 'No sponsor impressions or taps recorded yet.'
          }
        />
      </div>
    </div>
  );
}
