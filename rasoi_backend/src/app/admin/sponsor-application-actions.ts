'use server';

import { revalidatePath } from 'next/cache';

import { getAdminFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

export async function updateSponsorApplicationStatusAction(id: string, status: string) {
  await requireAdminSession();

  const valid = status === 'pending' || status === 'reviewed' || status === 'approved' || status === 'rejected';
  if (!valid) throw new Error('Invalid status');

  await prisma.sponsorApplication.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin/sponsor-applications');
}

export async function deleteSponsorApplicationAction(id: string) {
  await requireAdminSession();
  await prisma.sponsorApplication.delete({ where: { id } });
  revalidatePath('/admin/sponsor-applications');
}
