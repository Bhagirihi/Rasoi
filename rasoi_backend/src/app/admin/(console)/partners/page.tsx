import PartnerLinksForm from '@/app/admin/(console)/partners/PartnerLinksForm';
import { PageHeader } from '@/app/admin/_components/ui';
import type { PartnerId } from '@/lib/partners';
import { ensurePartnerLinks } from '@/lib/partner-seed';
import { db } from '@/lib/db';

export default async function AdminPartnersPage() {
  await ensurePartnerLinks();

  const links = await db.partnerLink.findMany({ orderBy: { partnerId: 'asc' } });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Partner links"
        description="Manage Blinkit, Zepto, Instamart, Zomato, and Swiggy deep links and web fallbacks. Use {query} where the search term should appear."
      />
      <PartnerLinksForm
        links={links.map((link) => ({
          partnerId: link.partnerId as PartnerId,
          label: link.label,
          category: link.category as 'grocery' | 'delivery',
          deepLinkUrl: link.deepLinkUrl,
          webUrl: link.webUrl,
          active: link.active,
        }))}
      />
    </div>
  );
}
