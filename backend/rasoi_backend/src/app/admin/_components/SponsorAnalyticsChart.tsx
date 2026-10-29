import type { getSponsorAnalyticsStats } from '@/lib/sponsor-analytics';

export default function SponsorAnalyticsChart({
  stats,
}: {
  stats: Awaited<ReturnType<typeof getSponsorAnalyticsStats>>;
}) {
  const maxImpressions = Math.max(...stats.byBrandPlacement.map((row) => row.impressions), 1);

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 gap-3 text-sm lg:grid-cols-3">
        <div className="rounded-xl border border-admin-border bg-[#faf7f2] px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-admin-muted">
            Impressions ({stats.days}d)
          </dt>
          <dd className="font-display mt-1 text-2xl font-semibold text-admin-ink">
            {stats.totalImpressions}
          </dd>
        </div>
        <div className="rounded-xl border border-admin-border bg-[#faf7f2] px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-admin-muted">Taps</dt>
          <dd className="font-display mt-1 text-2xl font-semibold text-admin-ink">{stats.totalTaps}</dd>
        </div>
        <div className="rounded-xl border border-admin-border bg-[#faf7f2] px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-admin-muted">
            Tap rate
          </dt>
          <dd className="font-display mt-1 text-2xl font-semibold text-admin-ink">
            {stats.overallTapRate}%
          </dd>
        </div>
      </dl>

      {stats.byBrandPlacement.length === 0 ? (
        <p className="text-sm text-admin-muted">
          No sponsor impressions or taps recorded yet. Events appear when the mobile app shows sponsor
          cards and users tap them.
        </p>
      ) : (
        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
            By brand & placement
          </p>
          <ul className="space-y-4">
            {stats.byBrandPlacement.map((row) => (
              <li key={`${row.brandName}-${row.placement}`} className="rounded-xl border border-admin-border bg-white px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-admin-ink">{row.brandName}</p>
                    <p className="text-xs uppercase tracking-wide text-admin-muted">{row.placement}</p>
                  </div>
                  <p className="text-sm font-semibold text-admin-saffron">{row.tapRate}% tap rate</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-admin-muted">
                  <span>{row.impressions} impressions</span>
                  <span>{row.taps} taps</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#efe8dc]">
                  <div
                    className="h-full rounded-full bg-admin-saffron transition-all"
                    style={{ width: `${Math.max((row.impressions / maxImpressions) * 100, 4)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
