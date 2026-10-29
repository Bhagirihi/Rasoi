import { NextRequest } from 'next/server';

import {
  buildSponsorAnalyticsCsv,
  sponsorAnalyticsExportFilename,
} from '@/lib/sponsor-analytics-csv';
import {
  parseSponsorAnalyticsFilters,
} from '@/lib/sponsor-analytics-filters';
import {
  getSponsorAnalyticsStats,
  getSponsorEventsForExport,
} from '@/lib/sponsor-analytics';
import { requireAdmin } from '@/lib/admin';

export async function GET(request: NextRequest) {
  const { admin, error } = await requireAdmin(request);
  if (!admin) return error!;

  const filters = parseSponsorAnalyticsFilters(
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  );
  const days = filters.days ?? 30;

  const [stats, events] = await Promise.all([
    getSponsorAnalyticsStats(filters),
    getSponsorEventsForExport(filters),
  ]);

  const csv = buildSponsorAnalyticsCsv({
    filters: {
      brand: filters.brand,
      placement: filters.placement,
      days,
    },
    summary: stats.byBrandPlacement,
    totals: {
      impressions: stats.totalImpressions,
      taps: stats.totalTaps,
      tapRate: stats.overallTapRate,
    },
    events,
  });

  const filename = sponsorAnalyticsExportFilename({
    brand: filters.brand,
    placement: filters.placement,
    days,
  });

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
