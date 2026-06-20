import type { getAffiliateEventStats } from '@/lib/affiliate-event-stats';

export default function AffiliateEventsOverview({
  stats,
}: {
  stats: Awaited<ReturnType<typeof getAffiliateEventStats>>;
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-admin-muted">
        Logged when users tap partner checkout from sponsor rails, recipe missing ingredients, or
        food delivery modals in the mobile app.
      </p>
      <dl className="grid grid-cols-2 gap-3 text-sm lg:grid-cols-4">
        <div className="rounded-xl border border-admin-border bg-[#faf7f2] px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-admin-muted">
            Last {stats.days} days
          </dt>
          <dd className="font-display mt-1 text-2xl font-semibold text-admin-ink">{stats.totalCount}</dd>
        </div>
        <div className="rounded-xl border border-admin-border bg-[#faf7f2] px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-admin-muted">
            Sponsor rail
          </dt>
          <dd className="font-display mt-1 text-2xl font-semibold text-admin-ink">
            {stats.sponsorRailCount}
          </dd>
        </div>
        <div className="rounded-xl border border-admin-border bg-[#faf7f2] px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-admin-muted">
            Grocery taps
          </dt>
          <dd className="font-display mt-1 text-2xl font-semibold text-admin-ink">
            {stats.groceryCount}
          </dd>
        </div>
        <div className="rounded-xl border border-admin-border bg-[#faf7f2] px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-admin-muted">
            Unique users
          </dt>
          <dd className="font-display mt-1 text-2xl font-semibold text-admin-ink">
            {stats.uniqueUserCount}
          </dd>
        </div>
      </dl>
    </div>
  );
}
