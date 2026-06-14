'use server';

import { revalidatePath } from 'next/cache';

import { getAdminFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sponsorCreateSchema, sponsorUpdateSchema } from '@/lib/validators';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

export async function createSponsorAction(raw: unknown) {
  await requireAdminSession();
  const input = sponsorCreateSchema.parse(raw);
  await prisma.sponsor.create({ data: input });
  revalidatePath('/admin/sponsors');
}

export async function updateSponsorAction(id: string, raw: unknown) {
  await requireAdminSession();
  const input = sponsorUpdateSchema.parse(raw);
  await prisma.sponsor.update({ where: { id }, data: input });
  revalidatePath('/admin/sponsors');
}

export async function deleteSponsorAction(id: string) {
  await requireAdminSession();
  await prisma.sponsor.delete({ where: { id } });
  revalidatePath('/admin/sponsors');
}
