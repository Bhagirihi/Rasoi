import AffiliateEventsOverview from '@/app/admin/_components/AffiliateEventsOverview';
import AffiliateEventsTable from '@/app/admin/_components/AffiliateEventsTable';
import { AdminCard, PageHeader } from '@/app/admin/_components/ui';
import { getAffiliateEventList, getAffiliateEventStats } from '@/lib/affiliate-event-stats';

export default async function AffiliateEventsAdminPage() {
  const [stats, events] = await Promise.all([getAffiliateEventStats(), getAffiliateEventList()]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Partner checkout events"
        description={`${stats.totalCount} events in the last ${stats.days} days · Blinkit, Zepto, Zomato, and other partner taps from the mobile app.`}
      />

      <AdminCard className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
          Summary
        </p>
        <div className="mt-5">
          <AffiliateEventsOverview stats={stats} />
        </div>
      </AdminCard>

      <div>
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
          All events
        </p>
        <AffiliateEventsTable items={events} />
      </div>
    </div>
  );
}
