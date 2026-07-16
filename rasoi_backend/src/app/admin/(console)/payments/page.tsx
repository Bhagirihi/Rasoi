import PaymentsMinVersionForm from '@/app/admin/_components/PaymentsMinVersionForm';
import PaymentsToggle from '@/app/admin/_components/PaymentsToggle';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import AdminPanel from '@/app/admin/_components/AdminPanel';
import { getAppConfig } from '@/lib/app-settings';

export default async function AdminPaymentsPage() {
  const { paymentsEnabled, paymentsMinAppVersion } = await getAppConfig();

  return (
    <AdminPageLayout>
      <AdminPageHeader href="/admin/payments" />

      <AdminPanel
        title="Mobile monetization"
        description="Control whether the mobile app shows Rasoi Plus paywall, trials, and partner locks. Ads and sponsors stay available when payments are off."
      >
        <PaymentsToggle paymentsEnabled={paymentsEnabled} />
      </AdminPanel>

      <AdminPanel
        title="Version gate"
        description="Optionally limit the paywall to newer app builds so older APKs remain early access while you roll out monetization."
      >
        <PaymentsMinVersionForm paymentsMinAppVersion={paymentsMinAppVersion} />
      </AdminPanel>

      <AdminPanel
        title="Promo codes & Play offers"
        description="Trial extension and yearly discount codes live in Supabase. Google Play offer promo-yearly-5 is configured on the yearly subscription."
      >
        <a
          href="/admin/promo-codes"
          className="inline-flex text-sm font-semibold text-admin-gold-soft hover:text-admin-gold"
        >
          Manage promo codes →
        </a>
      </AdminPanel>

      <AdminPanel
        title="Pantry defaults"
        description="Mark ingredients new users already have at home — atta, chawal, oil, masala, and more from the full recipe catalog."
      >
        <a
          href="/admin/pantry-defaults"
          className="inline-flex text-sm font-semibold text-admin-gold-soft hover:text-admin-gold"
        >
          Manage default pantry →
        </a>
      </AdminPanel>

      <AdminPanel title="When payments are off">
        <ul className="space-y-2 text-sm leading-relaxed text-admin-muted">
          <li>Partner links (Blinkit, Zepto, Zomato, etc.) unlocked for all users</li>
          <li>AdMob banners and sponsor placements remain visible</li>
          <li>Paywall, subscribe, and trial upsell screens hidden</li>
          <li>User plan tier in the database is unchanged</li>
          <li>
            If a min version is set while payments are ON, older apps behave as if payments are off
          </li>
        </ul>
      </AdminPanel>
    </AdminPageLayout>
  );
}
