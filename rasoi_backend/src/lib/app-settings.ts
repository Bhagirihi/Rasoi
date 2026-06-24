import { unstable_cache } from 'next/cache';

import { db } from '@/lib/db';
import { DEFAULT_HOUSEHOLD_PANTRY_STAPLES } from '@/lib/ingredient-canonical';

export type AppConfigResponse = {
  paymentsEnabled: boolean;
  defaultPantryIngredients: string[];
};

const DEFAULT_CONFIG: AppConfigResponse = {
  paymentsEnabled: false,
  defaultPantryIngredients: [],
};

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

async function readAppConfig(): Promise<AppConfigResponse> {
  const row = await db.appSettings.findUnique({ where: { id: 'default' } });
  if (!row) return DEFAULT_CONFIG;
  return {
    paymentsEnabled: row.paymentsEnabled,
    defaultPantryIngredients: parseDefaultPantryIngredients(row.defaultPantryIngredients),
  };
}

export const getAppConfig = unstable_cache(readAppConfig, ['app-config'], {
  revalidate: 30,
  tags: ['app-config'],
});

export async function setPaymentsEnabled(paymentsEnabled: boolean): Promise<AppConfigResponse> {
  const row = await db.appSettings.upsert({
    where: { id: 'default' },
    create: { id: 'default', paymentsEnabled, defaultPantryIngredients: '[]' },
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
    defaultPantryIngredients: parseDefaultPantryIngredients(row.defaultPantryIngredients),
  };
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
  const row = await db.appSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      paymentsEnabled: false,
      defaultPantryIngredients: JSON.stringify(normalized),
    },
    update: {
      defaultPantryIngredients: JSON.stringify(normalized),
    },
  });

  try {
    const { revalidateTag } = await import('next/cache');
    revalidateTag('app-config', 'max');
  } catch {
    // Scripts / CLI run outside Next.js request context — DB update still applies.
  }

  return {
    paymentsEnabled: row.paymentsEnabled,
    defaultPantryIngredients: parseDefaultPantryIngredients(row.defaultPantryIngredients),
  };
}
