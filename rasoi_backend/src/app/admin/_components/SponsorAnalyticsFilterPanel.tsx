'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import FilterChipBar from '@/app/admin/_components/FilterChipBar';
import { GhostButton } from '@/app/admin/_components/ui';
import { SPONSOR_PLACEMENT_OPTIONS } from '@/lib/sponsor-placements';
import { sponsorAnalyticsQueryString } from '@/lib/sponsor-analytics-filters';
import type { SponsorBrandOption } from '@/lib/sponsor-analytics';

export default function SponsorAnalyticsFilterPanel({
  brands,
}: {
  brands: SponsorBrandOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeBrand = searchParams.get('brand') ?? 'all';
  const exportHref = `/admin/sponsor-analytics/export${sponsorAnalyticsQueryString({
    brand: activeBrand !== 'all' ? activeBrand : undefined,
    placement: searchParams.get('placement') ?? undefined,
    days: Number.parseInt(searchParams.get('days') ?? '30', 10) || 30,
  })}`;

  const setBrand = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      next.delete('brand');
    } else {
      next.set('brand', value);
    }
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="admin-card space-y-5 rounded-[1.25rem] p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-[220px] flex-1">
          <label
            htmlFor="sponsor-analytics-brand"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted"
          >
            Sponsored brand
          </label>
          <select
            id="sponsor-analytics-brand"
            value={activeBrand}
            onChange={(event) => setBrand(event.target.value)}
            className="mt-2 w-full max-w-md rounded-xl border border-admin-border bg-white px-4 py-2.5 text-sm font-medium text-admin-ink outline-none transition focus:border-admin-gold/50"
          >
            <option value="all">All brands</option>
            {brands.map((brand) => (
              <option key={brand.brandName} value={brand.brandName}>
                {brand.brandName}
                {brand.configured ? (brand.active ? ' · live' : ' · inactive') : ' · events only'}
                {brand.eventCount > 0 ? ` · ${brand.eventCount} events` : ''}
              </option>
            ))}
          </select>
        </div>

        <GhostButton href={exportHref}>Export CSV</GhostButton>
      </div>

      <FilterChipBar
        param="placement"
        label="Placement"
        options={[
          { value: 'all', label: 'All placements' },
          ...SPONSOR_PLACEMENT_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          })),
        ]}
      />

      <FilterChipBar
        param="days"
        label="Period"
        defaultValue="30"
        options={[
          { value: '7', label: '7 days' },
          { value: '30', label: '30 days' },
          { value: '90', label: '90 days' },
        ]}
      />
    </div>
  );
}
