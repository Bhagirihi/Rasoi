import { DEFAULT_PARTNER_LINKS } from '@/lib/partners';
import { prisma } from '@/lib/prisma';

export async function ensurePartnerLinks() {
  for (const link of DEFAULT_PARTNER_LINKS) {
    await prisma.partnerLink.upsert({
      where: { partnerId: link.partnerId },
      update: {},
      create: link,
    });
  }
}
