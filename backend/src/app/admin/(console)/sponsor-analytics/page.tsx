import { Suspense } from 'react';

import SponsorAnalyticsChart from '@/app/admin/_components/SponsorAnalyticsChart';
import SponsorAnalyticsFilterPanel from '@/app/admin/_components/SponsorAnalyticsFilterPanel';
import SponsorEventsTable from '@/app/admin/_components/SponsorEventsTable';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import AdminPanel from '@/app/admin/_components/AdminPanel';
import { GhostButton } from '@/app/admin/_components/ui';
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
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/sponsor-analytics"
        description={filterDescription(filters, stats)}
        action={<GhostButton href="/admin/sponsors">Manage sponsors</GhostButton>}
      />

      <Suspense fallback={null}>
        <SponsorAnalyticsFilterPanel brands={brands} />
      </Suspense>

      <AdminPanel title={`Performance${filters.brand ? ` — ${filters.brand}` : ''}`}>
        <SponsorAnalyticsChart stats={stats} />
      </AdminPanel>

      <AdminPanel title="How it works">
        <ul className="space-y-2 text-sm leading-relaxed text-admin-muted">
          <li>Filter by configured sponsor brand, placement, or time period</li>
          <li>Impression — sponsor card rendered on Home, Pantry, Recipes, Saved, or Recipe detail</li>
          <li>Tap — user tapped the card (logged before phone gate)</li>
          <li>Export CSV for Amul / Everest pilot reports (use the filter panel above)</li>
        </ul>
      </AdminPanel>

      <AdminPanel
        title={`Raw event log${filters.brand ? ` · ${filters.brand}` : ''}`}
        description={events.length >= 500 ? 'Latest 500 events shown' : `${events.length} events`}
      >
        <SponsorEventsTable
          items={events}
          emptyMessage={
            filters.brand
              ? `No events for ${filters.brand} in this period. Try a longer range or open the app with this sponsor live.`
              : 'No sponsor impressions or taps recorded yet.'
          }
        />
      </AdminPanel>
    </AdminPageLayout>
  );
}
