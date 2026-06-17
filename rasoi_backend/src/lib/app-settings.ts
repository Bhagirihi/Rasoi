import { prisma } from '@/lib/prisma';

export type AppConfigResponse = {
  paymentsEnabled: boolean;
};

export async function getAppConfig(): Promise<AppConfigResponse> {
  const row = await prisma.appSettings.upsert({
    where: { id: 'default' },
    create: { id: 'default', paymentsEnabled: false },
    update: {},
  });

  return {
    paymentsEnabled: row.paymentsEnabled,
  };
}

export async function setPaymentsEnabled(paymentsEnabled: boolean): Promise<AppConfigResponse> {
  const row = await prisma.appSettings.upsert({
    where: { id: 'default' },
    create: { id: 'default', paymentsEnabled },
    update: { paymentsEnabled },
  });

  return {
    paymentsEnabled: row.paymentsEnabled,
  };
}
