import { unstable_cache } from 'next/cache';

import { db } from '@/lib/db';

export type AppConfigResponse = {
  paymentsEnabled: boolean;
};

const DEFAULT_CONFIG: AppConfigResponse = { paymentsEnabled: false };

async function readAppConfig(): Promise<AppConfigResponse> {
  const row = await db.appSettings.findUnique({ where: { id: 'default' } });
  if (!row) return DEFAULT_CONFIG;
  return { paymentsEnabled: row.paymentsEnabled };
}

export const getAppConfig = unstable_cache(readAppConfig, ['app-config'], {
  revalidate: 30,
  tags: ['app-config'],
});

export async function setPaymentsEnabled(paymentsEnabled: boolean): Promise<AppConfigResponse> {
  const row = await db.appSettings.upsert({
    where: { id: 'default' },
    create: { id: 'default', paymentsEnabled },
    update: { paymentsEnabled },
  });

  try {
    const { revalidateTag } = await import('next/cache');
    revalidateTag('app-config', 'max');
  } catch {
    // Scripts / CLI run outside Next.js request context — DB update still applies.
  }

  return {
    paymentsEnabled: row.paymentsEnabled,
  };
}
