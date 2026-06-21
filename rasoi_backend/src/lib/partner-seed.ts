import { DEFAULT_PARTNER_LINKS } from '@/lib/partners';
import { db } from '@/lib/db';

export async function ensurePartnerLinks() {
  for (const link of DEFAULT_PARTNER_LINKS) {
    await db.partnerLink.upsert({
      where: { partnerId: link.partnerId },
      update: {
        label: link.label,
        category: link.category,
        deepLinkUrl: link.deepLinkUrl,
        webUrl: link.webUrl,
      },
      create: link,
    });
  }
}
