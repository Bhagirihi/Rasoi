import { db } from '@/lib/db';
import { ensurePartnerLinks } from '@/lib/partner-seed';
import { jsonOk, handleApiError } from '@/lib/api';
import { isPartnerRegion } from '@/lib/partners';

export async function GET(request: Request) {
  try {
    await ensurePartnerLinks();

    const { searchParams } = new URL(request.url);
    const regionParam = searchParams.get('region')?.toUpperCase() ?? 'IN';
    const region = isPartnerRegion(regionParam) ? regionParam : 'IN';

    const links = await db.partnerLink.findMany({
      where: { region },
      orderBy: [{ category: 'asc' }, { partnerId: 'asc' }],
    });

    return jsonOk(
      links.map((link) => ({
        partnerId: link.partnerId,
        label: link.label,
        category: link.category,
        region: link.region,
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
