'use server';

import { revalidatePath } from 'next/cache';

import { getAdminFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';
import { partnerLinksSchema } from '@/lib/validators';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

function assertUniquePartnerIds(links: Array<{ partnerId: string }>) {
  const seen = new Set<string>();
  for (const link of links) {
    const id = link.partnerId.trim().toLowerCase();
    if (seen.has(id)) {
      throw new Error(`Duplicate partner id: ${link.partnerId}`);
    }
    seen.add(id);
  }
}

export async function updatePartnerLinksAction(raw: unknown) {
  await requireAdminSession();
  const input = partnerLinksSchema.parse(raw);
  assertUniquePartnerIds(input.links);

  const deletedIds = [...new Set(input.deletedPartnerIds)];
  for (const partnerId of deletedIds) {
    await db.partnerLink.deleteMany({ where: { partnerId } });
  }

  for (const link of input.links) {
    await db.partnerLink.upsert({
      where: { partnerId: link.partnerId },
      update: {
        label: link.label,
        category: link.category,
        region: link.region,
        deepLinkUrl: link.deepLinkUrl,
        webUrl: link.webUrl,
        active: link.active,
      },
      create: {
        partnerId: link.partnerId,
        label: link.label,
        category: link.category,
        region: link.region,
        deepLinkUrl: link.deepLinkUrl,
        webUrl: link.webUrl,
        active: link.active,
      },
    });
  }

  revalidatePath('/admin/partners');
  revalidatePath('/api/partners');
}
