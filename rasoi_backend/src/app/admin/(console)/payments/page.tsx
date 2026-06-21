import PaymentsToggle from '@/app/admin/_components/PaymentsToggle';
import { AdminCard, PageHeader } from '@/app/admin/_components/ui';
import { getAppConfig } from '@/lib/app-settings';

export default async function AdminPaymentsPage() {
  const { paymentsEnabled } = await getAppConfig();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payment"
        description="Control whether the mobile app shows Rasoi Plus paywall, trials, and partner locks. Ads and sponsors are always available when payments are off."
      />

      <AdminCard className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
          Mobile monetization
        </p>
        <div className="mt-5">
          <PaymentsToggle paymentsEnabled={paymentsEnabled} />
        </div>
      </AdminCard>

      <AdminCard className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
          Promo codes & Play offers
        </p>
        <p className="mt-4 text-sm leading-relaxed text-admin-muted">
          Trial extension and yearly discount codes live in Supabase. Google Play offer{' '}
          <span className="font-mono text-admin-text">promo-yearly-5</span> is configured on the yearly
          subscription.
        </p>
        <a
          href="/admin/promo-codes"
          className="mt-4 inline-flex text-sm font-semibold text-admin-gold-soft hover:text-admin-gold"
        >
          Manage promo codes →
        </a>
      </AdminCard>

      <AdminCard className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
          When payments are off
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-admin-muted">
          <li>Partner links (Blinkit, Zepto, Zomato, etc.) unlocked for all users</li>
          <li>AdMob banners and sponsor placements remain visible</li>
          <li>Paywall, subscribe, and trial upsell screens hidden</li>
          <li>User plan tier in the database is unchanged</li>
        </ul>
      </AdminCard>
    </div>
  );
}
