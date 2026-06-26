'use server';

import { revalidatePath } from 'next/cache';

import { getAdminFromCookies } from '@/lib/auth';
import {
  isEasOtaAdminConfigured,
  listEasProductionUpdates,
  rollbackLastEasOtaUpdate,
  type EasRollbackResult,
  type EasUpdateSummary,
} from '@/lib/eas-updates';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

export async function getEasOtaAdminStatusAction(): Promise<{
  configured: boolean;
  branch: string;
}> {
  await requireAdminSession();
  return {
    configured: isEasOtaAdminConfigured(),
    branch: process.env.EAS_OTA_BRANCH?.trim() || 'production',
  };
}

export async function listEasOtaUpdatesAction(): Promise<EasUpdateSummary[]> {
  await requireAdminSession();
  return listEasProductionUpdates(8);
}

export async function rollbackLastEasOtaAction(): Promise<EasRollbackResult> {
  await requireAdminSession();
  const result = await rollbackLastEasOtaUpdate();
  revalidatePath('/admin/integrations');
  return result;
}
