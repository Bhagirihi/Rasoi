'use server';

import { revalidatePath } from 'next/cache';

import { getAdminFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

export async function updateSponsorApplicationStatusAction(id: string, status: string) {
  await requireAdminSession();

  const valid = status === 'pending' || status === 'reviewed' || status === 'approved' || status === 'rejected';
  if (!valid) throw new Error('Invalid status');

  await db.sponsorApplication.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin/sponsor-applications');
}

export async function deleteSponsorApplicationAction(id: string) {
  await requireAdminSession();
  await db.sponsorApplication.delete({ where: { id } });
  revalidatePath('/admin/sponsor-applications');
}
