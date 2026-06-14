'use server';

import { revalidatePath } from 'next/cache';

import { getAdminFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  deletePublicKitchenStyle,
  syncPublicKitchenStyle,
} from '@/lib/sync-public-kitchen-style';
import { kitchenStyleCreateSchema, kitchenStyleUpdateSchema } from '@/lib/validators';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

export async function createKitchenStyleAction(raw: unknown) {
  await requireAdminSession();
  const input = kitchenStyleCreateSchema.parse(raw);
  const style = await prisma.kitchenStyle.create({ data: input });
  try {
    await syncPublicKitchenStyle(style);
  } catch (error) {
    console.error('[syncPublicKitchenStyle] create failed', error);
  }
  revalidatePath('/admin/kitchen-styles');
}

export async function updateKitchenStyleAction(id: string, raw: unknown) {
  await requireAdminSession();
  const input = kitchenStyleUpdateSchema.parse(raw);
  const style = await prisma.kitchenStyle.update({ where: { id }, data: input });
  try {
    await syncPublicKitchenStyle(style);
  } catch (error) {
    console.error('[syncPublicKitchenStyle] update failed', error);
  }
  revalidatePath('/admin/kitchen-styles');
  revalidatePath(`/admin/kitchen-styles/${id}`);
}

export async function toggleKitchenStyleActiveAction(id: string, active: boolean) {
  await requireAdminSession();
  const style = await prisma.kitchenStyle.update({ where: { id }, data: { active } });
  try {
    await syncPublicKitchenStyle(style);
  } catch (error) {
    console.error('[syncPublicKitchenStyle] toggle failed', error);
  }
  revalidatePath('/admin/kitchen-styles');
  revalidatePath(`/admin/kitchen-styles/${id}`);
}

export async function deleteKitchenStyleAction(id: string) {
  await requireAdminSession();
  await prisma.kitchenStyle.delete({ where: { id } });
  try {
    await deletePublicKitchenStyle(id);
  } catch (error) {
    console.error('[deletePublicKitchenStyle] delete failed', error);
  }
  revalidatePath('/admin/kitchen-styles');
}
