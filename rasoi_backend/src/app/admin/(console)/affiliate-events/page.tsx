import AffiliateEventsOverview from '@/app/admin/_components/AffiliateEventsOverview';
import AffiliateEventsTable from '@/app/admin/_components/AffiliateEventsTable';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import AdminPanel from '@/app/admin/_components/AdminPanel';
import { getAffiliateEventList, getAffiliateEventStats } from '@/lib/affiliate-event-stats';

export default async function AffiliateEventsAdminPage() {
  const [stats, events] = await Promise.all([getAffiliateEventStats(), getAffiliateEventList()]);

  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/affiliate-events"
        description={`${stats.totalCount} events in the last ${stats.days} days · Blinkit, Zepto, Zomato, and other partner taps from the mobile app.`}
      />

      <AdminPanel title="Summary">
        <AffiliateEventsOverview stats={stats} />
      </AdminPanel>

      <AdminPanel
        title="All events"
        description={`${events.length} event${events.length === 1 ? '' : 's'} in the log`}
      >
        <AffiliateEventsTable items={events} />
      </AdminPanel>
    </AdminPageLayout>
  );
}
