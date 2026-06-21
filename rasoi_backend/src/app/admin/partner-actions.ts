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

export async function updatePartnerLinksAction(raw: unknown) {
  await requireAdminSession();
  const input = partnerLinksSchema.parse(raw);

  for (const link of input.links) {
    await db.partnerLink.upsert({
      where: { partnerId: link.partnerId },
      update: {
        label: link.label,
        category: link.category,
        deepLinkUrl: link.deepLinkUrl,
        webUrl: link.webUrl,
        active: link.active,
      },
      create: {
        partnerId: link.partnerId,
        label: link.label,
        category: link.category,
        deepLinkUrl: link.deepLinkUrl,
        webUrl: link.webUrl,
        active: link.active,
      },
    });
  }

  revalidatePath('/admin/partners');
  revalidatePath('/api/partners');
}

