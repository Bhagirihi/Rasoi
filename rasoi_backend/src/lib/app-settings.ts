import { unstable_cache } from 'next/cache';

import { db } from '@/lib/db';
import { DEFAULT_HOUSEHOLD_PANTRY_STAPLES } from '@/lib/ingredient-canonical';

export type AppConfigResponse = {
  paymentsEnabled: boolean;
  /** Semver floor (e.g. 1.0.14). Null/empty = every version when paymentsEnabled. */
  paymentsMinAppVersion: string | null;
  defaultPantryIngredients: string[];
};

const DEFAULT_CONFIG: AppConfigResponse = {
  paymentsEnabled: false,
  paymentsMinAppVersion: null,
  defaultPantryIngredients: [],
};

function normalizeMinAppVersion(raw: string | null | undefined): string | null {
  const trimmed = raw?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
}

function parseDefaultPantryIngredients(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function toAppConfig(row: {
  paymentsEnabled: boolean;
  paymentsMinAppVersion?: string | null;
  defaultPantryIngredients: string;
}): AppConfigResponse {
  return {
    paymentsEnabled: row.paymentsEnabled,
    paymentsMinAppVersion: normalizeMinAppVersion(row.paymentsMinAppVersion),
    defaultPantryIngredients: parseDefaultPantryIngredients(row.defaultPantryIngredients),
  };
}

async function readAppConfig(): Promise<AppConfigResponse> {
  const row = await db.appSettings.findUnique({ where: { id: 'default' } });
  if (!row) return DEFAULT_CONFIG;
  return toAppConfig(row);
}

export const getAppConfig = unstable_cache(readAppConfig, ['app-config'], {
  revalidate: 30,
  tags: ['app-config'],
});

async function revalidateAppConfigCache(): Promise<void> {
  try {
    const { revalidateTag } = await import('next/cache');
    revalidateTag('app-config', 'max');
  } catch {
    // Scripts / CLI run outside Next.js request context — DB update still applies.
  }
}

export async function setPaymentsEnabled(paymentsEnabled: boolean): Promise<AppConfigResponse> {
  const existing = await db.appSettings.findUnique({ where: { id: 'default' } });

  const row = existing
    ? await db.appSettings.update({
        where: { id: 'default' },
        data: { paymentsEnabled },
      })
    : await db.appSettings.create({
        data: {
          id: 'default',
          paymentsEnabled,
          paymentsMinAppVersion: null,
          defaultPantryIngredients: '[]',
        },
      });

  await revalidateAppConfigCache();
  return toAppConfig(row);
}

export async function setPaymentsMinAppVersion(
  paymentsMinAppVersion: string | null,
): Promise<AppConfigResponse> {
  const normalized = normalizeMinAppVersion(paymentsMinAppVersion);
  const existing = await db.appSettings.findUnique({ where: { id: 'default' } });

  const row = existing
    ? await db.appSettings.update({
        where: { id: 'default' },
        data: { paymentsMinAppVersion: normalized },
      })
    : await db.appSettings.create({
        data: {
          id: 'default',
          paymentsEnabled: false,
          paymentsMinAppVersion: normalized,
          defaultPantryIngredients: '[]',
        },
      });

  await revalidateAppConfigCache();
  return toAppConfig(row);
}

export async function getDefaultPantryIngredients(): Promise<string[]> {
  const config = await readAppConfig();
  if (config.defaultPantryIngredients.length > 0) {
    return config.defaultPantryIngredients;
  }
  return [...DEFAULT_HOUSEHOLD_PANTRY_STAPLES];
}

export async function setDefaultPantryIngredients(
  ingredients: string[],
): Promise<AppConfigResponse> {
  const normalized = [...new Set(ingredients.map((item) => item.trim()).filter(Boolean))];
  const existing = await db.appSettings.findUnique({ where: { id: 'default' } });

  const row = existing
    ? await db.appSettings.update({
        where: { id: 'default' },
        data: { defaultPantryIngredients: JSON.stringify(normalized) },
      })
    : await db.appSettings.create({
        data: {
          id: 'default',
          paymentsEnabled: false,
          paymentsMinAppVersion: null,
          defaultPantryIngredients: JSON.stringify(normalized),
        },
      });

  await revalidateAppConfigCache();
  return toAppConfig(row);
}
