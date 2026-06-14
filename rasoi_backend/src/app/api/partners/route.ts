import { prisma } from '@/lib/prisma';
import { ensurePartnerLinks } from '@/lib/partner-seed';
import { jsonOk, handleApiError } from '@/lib/api';

export async function GET() {
  try {
    await ensurePartnerLinks();

    const links = await prisma.partnerLink.findMany({
      orderBy: { partnerId: 'asc' },
    });

    return jsonOk(
      links.map((link) => ({
        partnerId: link.partnerId,
        label: link.label,
        category: link.category,
        deepLinkUrl: link.deepLinkUrl,
        webUrl: link.webUrl,
        active: link.active,
        updatedAt: link.updatedAt.toISOString(),
      })),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
