'use server';

import { revalidatePath } from 'next/cache';

import { setPaymentsEnabled, setPaymentsMinAppVersion } from '@/lib/app-settings';
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

export async function setPaymentsMinAppVersionAction(paymentsMinAppVersion: string | null) {
  await requireAdminSession();
  await setPaymentsMinAppVersion(paymentsMinAppVersion);
  revalidatePath('/admin');
  revalidatePath('/admin/payments');
}
