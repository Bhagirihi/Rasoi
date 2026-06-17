'use server';

import { revalidatePath } from 'next/cache';

import { setPaymentsEnabled } from '@/lib/app-settings';
import { getAdminFromCookies } from '@/lib/auth';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

export async function setPaymentsEnabledAction(paymentsEnabled: boolean) {
  await requireAdminSession();
  await setPaymentsEnabled(paymentsEnabled);
  revalidatePath('/admin');
  revalidatePath('/admin/payments');
}
