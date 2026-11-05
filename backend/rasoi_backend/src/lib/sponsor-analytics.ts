import { db } from '@/lib/db';
import { queryPg } from '@/lib/db/pg';
import type { SponsorEventWithUser } from '@/lib/db/types';
import {
  buildSponsorEventWhere,
  type SponsorAnalyticsFilters,
} from '@/lib/sponsor-analytics-filters';

export type SponsorAnalyticsRow = {
  brandName: string;
  placement: string;
  impressions: number;
  taps: number;
  tapRate: number;
};

export type SponsorEventListItem = SponsorEventWithUser;

export type SponsorBrandOption = {
  brandName: string;
  configured: boolean;
  active: boolean;
  eventCount: number;
};

const EMPTY_STATS = {
  totalImpressions: 0,
  totalTaps: 0,
  overallTapRate: 0,
  byBrandPlacement: [] as SponsorAnalyticsRow[],
};

function aggregateRows(
  rows: Array<{ brandName: string; placement: string; eventType: string }>,
): SponsorAnalyticsRow[] {
  const rowMap = new Map<string, SponsorAnalyticsRow>();

  for (const row of rows) {
    const key = `${row.brandName}::${row.placement}`;
    const existing = rowMap.get(key) ?? {
      brandName: row.brandName,
      placement: row.placement,
      impressions: 0,
      taps: 0,
      tapRate: 0,
    };

    if (row.eventType === 'impression') {
      existing.impressions += 1;
    } else if (row.eventType === 'tap') {
      existing.taps += 1;
    }

    rowMap.set(key, existing);
  }

  return Array.from(rowMap.values())
    .map((row) => ({
      ...row,
      tapRate: row.impressions > 0 ? Math.round((row.taps / row.impressions) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.impressions - a.impressions);
}

/**
 * Brand counts for the sponsor filter dropdown. Previously this used the
 * repository groupBy, which fetches the ENTIRE SponsorEvent table and
 * aggregates in JS — every impression/tap event ever, on every page load
 * that renders the dropdown. One SQL aggregate returns just one row per
 * brand. Falls back to groupBy if the SQL path fails, so a pooler issue
 * degrades to slow instead of empty.
 */
async function getSponsorEventBrandCounts(): Promise<
  Array<{ brandName: string; _count: { _all: number } }>
> {
  try {
    const rows = await queryPg<{ brandName: string; count: string }>(
      'SELECT "brandName", COUNT(*) AS count FROM rasoi."SponsorEvent" GROUP BY "brandName"',
    );
    return rows.map((row) => ({
      brandName: row.brandName,
      _count: { _all: Number(row.count) },
    }));
  } catch {
    // groupBy's return type doesn't name the `by` field (Record<string, string>),
    // so map it to the declared shape explicitly.
    const grouped = await db.sponsorEvent.groupBy({
      by: ['brandName'],
      _count: { _all: true },
    });
    return grouped.map((row) => ({
      brandName: row.brandName,
      _count: { _all: row._count._all },
    }));
  }
}

export async function getSponsorBrandOptions(): Promise<SponsorBrandOption[]> {
  try {
    const [configuredSponsors, eventBrands] = await Promise.all([
      db.sponsor.findMany({
        select: { brandName: true, active: true },
        orderBy: [{ priority: 'desc' }, { brandName: 'asc' }],
      }),
      getSponsorEventBrandCounts(),
    ]);

    const map = new Map<string, SponsorBrandOption>();

    for (const sponsor of configuredSponsors) {
      const existing = map.get(sponsor.brandName);
      map.set(sponsor.brandName, {
        brandName: sponsor.brandName,
        configured: true,
        active: existing?.active || sponsor.active,
        eventCount: existing?.eventCount ?? 0,
      });
    }

    for (const row of eventBrands) {
      const existing = map.get(row.brandName);
      map.set(row.brandName, {
        brandName: row.brandName,
        configured: existing?.configured ?? false,
        active: existing?.active ?? false,
        eventCount: row._count._all,
      });
    }

    return Array.from(map.values()).sort((a, b) => {
      if (a.configured !== b.configured) return a.configured ? -1 : 1;
      return a.brandName.localeCompare(b.brandName);
    });
  } catch (error) {
    console.error('[sponsor-analytics] brand options failed', error);
    return [];
  }
}

export async function getSponsorAnalyticsStats(filters: SponsorAnalyticsFilters = {}) {
  const days = filters.days ?? 30;
  const where = buildSponsorEventWhere({ ...filters, days });

  try {
    const rows = await db.sponsorEvent.findMany({
      where,
      select: { brandName: true, placement: true, eventType: true },
    });

    const byBrandPlacement = aggregateRows(rows);

    const [totalImpressions, totalTaps] = await Promise.all([
      db.sponsorEvent.count({
        where: { ...where, eventType: 'impression' },
      }),
      db.sponsorEvent.count({
        where: { ...where, eventType: 'tap' },
      }),
    ]);

    const overallTapRate =
      totalImpressions > 0 ? Math.round((totalTaps / totalImpressions) * 1000) / 10 : 0;

    return {
      days,
      brand: filters.brand,
      placement: filters.placement,
      totalImpressions,
      totalTaps,
      overallTapRate,
      byBrandPlacement,
    };
  } catch (error) {
    console.error('[sponsor-analytics] stats query failed', error);
    return { days, brand: filters.brand, placement: filters.placement, ...EMPTY_STATS };
  }
}

export async function getSponsorEventList(
  filters: SponsorAnalyticsFilters = {},
  limit = 500,
): Promise<SponsorEventWithUser[]> {
  const where = buildSponsorEventWhere(filters);

  try {
    return (await db.sponsorEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            city: true,
            state: true,
          },
        },
      },
    })) as SponsorEventWithUser[];
  } catch (error) {
    console.error('[sponsor-analytics] list query failed', error);
    return [];
  }
}

export async function getSponsorEventsForExport(filters: SponsorAnalyticsFilters = {}) {
  const where = buildSponsorEventWhere(filters);

  try {
    const events = (await db.sponsorEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10_000,
      include: {
        user: {
          select: { name: true, city: true, state: true },
        },
      },
    })) as SponsorEventWithUser[];

    return events.map((event) => ({
      eventType: event.eventType,
      brandName: event.brandName,
      placement: event.placement,
      userName: event.user?.name ?? null,
      city: event.city ?? event.user?.city ?? null,
      sponsorId: event.sponsorId,
      partner: event.partner,
      query: event.query,
      createdAt: event.createdAt,
    }));
  } catch (error) {
    console.error('[sponsor-analytics] export query failed', error);
    return [];
  }
}

