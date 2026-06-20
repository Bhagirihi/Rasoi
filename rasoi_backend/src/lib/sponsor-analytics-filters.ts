import type { Prisma } from '@/generated/prisma/client';

export type SponsorAnalyticsFilters = {
  brand?: string;
  placement?: string;
  days?: number;
};

export function parseSponsorAnalyticsFilters(
  params: Record<string, string | string[] | undefined>,
): SponsorAnalyticsFilters {
  const rawBrand = param(params.brand);
  const rawPlacement = param(params.placement);
  const rawDays = param(params.days);

  const days = rawDays ? Number.parseInt(rawDays, 10) : 30;
  const safeDays = Number.isFinite(days) && days > 0 && days <= 365 ? days : 30;

  return {
    brand: rawBrand?.trim() || undefined,
    placement: rawPlacement && rawPlacement !== 'all' ? rawPlacement : undefined,
    days: safeDays,
  };
}

function param(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function sponsorAnalyticsSince(days: number): Date {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return since;
}

export function buildSponsorEventWhere(filters: SponsorAnalyticsFilters): Prisma.SponsorEventWhereInput {
  const where: Prisma.SponsorEventWhereInput = {
    createdAt: { gte: sponsorAnalyticsSince(filters.days ?? 30) },
  };

  if (filters.brand) {
    where.brandName = filters.brand;
  }

  if (filters.placement) {
    where.placement = filters.placement;
  }

  return where;
}

export function sponsorAnalyticsQueryString(filters: SponsorAnalyticsFilters): string {
  const params = new URLSearchParams();
  if (filters.brand) params.set('brand', filters.brand);
  if (filters.placement) params.set('placement', filters.placement);
  if (filters.days && filters.days !== 30) params.set('days', String(filters.days));
  const query = params.toString();
  return query ? `?${query}` : '';
}
