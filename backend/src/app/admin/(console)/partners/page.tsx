import PartnerLinksForm from '@/app/admin/(console)/partners/PartnerLinksForm';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import type { PartnerRegion } from '@/lib/partners';
import { ensurePartnerLinks } from '@/lib/partner-seed';
import { db } from '@/lib/db';

export default async function AdminPartnersPage() {
  await ensurePartnerLinks();

  const links = await db.partnerLink.findMany({
    orderBy: [{ region: 'asc' }, { category: 'asc' }, { partnerId: 'asc' }],
  });

  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/partners"
        description="Grocery and delivery checkout links by market — India, US, Canada, Australia."
      />
      <PartnerLinksForm
        links={links.map((link) => ({
          clientKey: link.partnerId,
          partnerId: link.partnerId,
          label: link.label,
          category: link.category as 'grocery' | 'delivery',
          region: (link.region ?? 'IN') as PartnerRegion,
          deepLinkUrl: link.deepLinkUrl,
          webUrl: link.webUrl,
          active: link.active,
        }))}
      />
    </AdminPageLayout>
  );
}
