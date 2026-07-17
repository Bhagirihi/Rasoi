import { apiFetch } from '@/utils/api';
import { parseJson } from '@/utils/parseJson';
import { getRasoiDb, isDirectSupabaseCatalogEnabled } from '@/utils/rasoiDb';
import { loadCachedReferenceData, saveCachedReferenceData } from '@/utils/referenceCache';
import type { KitchenStyle } from '@/utils/kitchenStyles';

export type { KitchenStyle };

export type PantrySection = {
  title: string;
  items: string[];
};

export type ReferenceData = {
  regionalCuisines: string[];
  pantrySections: PantrySection[];
  kitchenStyles: KitchenStyle[];
  appConfig: {
    paymentsEnabled: boolean;
    /** Semver floor from AppSettings; empty/null = all versions. */
    paymentsMinAppVersion: string | null;
    defaultPantryIngredients: string[];
  };
};

const DEFAULT_APP_CONFIG = {
  paymentsEnabled: false,
  paymentsMinAppVersion: null as string | null,
  defaultPantryIngredients: [] as string[],
};

const EMPTY_REFERENCE: ReferenceData = {
  regionalCuisines: [],
  pantrySections: [],
  kitchenStyles: [],
  appConfig: DEFAULT_APP_CONFIG,
};

let cachedReference: ReferenceData | null = null;
let loadPromise: Promise<ReferenceData> | null = null;

function parseAppConfigRow(
  paymentsEnabled: boolean | null | undefined,
  defaultPantryRaw: string | null | undefined,
  paymentsMinAppVersion?: string | null,
): ReferenceData['appConfig'] {
  const minVersion = paymentsMinAppVersion?.trim() || null;
  return {
    paymentsEnabled: paymentsEnabled ?? DEFAULT_APP_CONFIG.paymentsEnabled,
    paymentsMinAppVersion: minVersion,
    defaultPantryIngredients: parseJson<string[]>(
      defaultPantryRaw,
      DEFAULT_APP_CONFIG.defaultPantryIngredients,
    ),
  };
}

/** Always fetch payment flags live — never trust the 30-minute reference disk cache for this. */
export async function loadAppConfigFresh(): Promise<ReferenceData['appConfig']> {
  try {
    if (isDirectSupabaseCatalogEnabled()) {
      const db = getRasoiDb();
      const { data, error } = await db
        .from('AppSettings')
        .select('paymentsEnabled, paymentsMinAppVersion, defaultPantryIngredients')
        .eq('id', 'default')
        .maybeSingle();
      if (error) throw error;
      return parseAppConfigRow(
        data?.paymentsEnabled,
        data?.defaultPantryIngredients,
        data?.paymentsMinAppVersion,
      );
    }

    const data = await apiFetch<ReferenceData>('/api/reference');
    return {
      ...DEFAULT_APP_CONFIG,
      ...data.appConfig,
      paymentsMinAppVersion: data.appConfig?.paymentsMinAppVersion?.trim() || null,
    };
  } catch (error) {
    console.warn('[reference] Could not refresh app config', error);
    return cachedReference?.appConfig ?? DEFAULT_APP_CONFIG;
  }
}

async function mergeFreshAppConfig(data: ReferenceData): Promise<ReferenceData> {
  const appConfig = await loadAppConfigFresh();
  const prevPantry = data.appConfig?.defaultPantryIngredients ?? [];
  if (
    appConfig.paymentsEnabled === data.appConfig?.paymentsEnabled &&
    appConfig.paymentsMinAppVersion === data.appConfig?.paymentsMinAppVersion &&
    appConfig.defaultPantryIngredients.length === prevPantry.length &&
    appConfig.defaultPantryIngredients.every((item, index) => item === prevPantry[index])
  ) {
    return data;
  }
  return { ...data, appConfig };
}

async function loadReferenceFromSupabase(): Promise<ReferenceData> {
  const db = getRasoiDb();

  const [kitchenResult, regionalResult, pantryResult, settingsResult] = await Promise.all([
    db
      .from('KitchenStyle')
      .select('id, label, tagline, mood, region, heroImage')
      .eq('active', true)
      .order('sortOrder', { ascending: true }),
    db
      .from('RegionalCuisineOption')
      .select('label')
      .eq('active', true)
      .order('sortOrder', { ascending: true })
      .order('label', { ascending: true }),
    db
      .from('PantrySection')
      .select('title, items')
      .eq('active', true)
      .order('sortOrder', { ascending: true })
      .order('title', { ascending: true }),
    db.from('AppSettings').select('paymentsEnabled, paymentsMinAppVersion, defaultPantryIngredients').eq('id', 'default').maybeSingle(),
  ]);

  const firstError =
    kitchenResult.error ??
    regionalResult.error ??
    pantryResult.error ??
    settingsResult.error;
  if (firstError) {
    throw new Error(firstError.message);
  }

  return {
    regionalCuisines: (regionalResult.data ?? []).map((row) => row.label),
    pantrySections: (pantryResult.data ?? []).map((section) => ({
      title: section.title,
      items: parseJson<string[]>(section.items, []),
    })),
    kitchenStyles: (kitchenResult.data ?? []) as KitchenStyle[],
    appConfig: parseAppConfigRow(
      settingsResult.data?.paymentsEnabled,
      settingsResult.data?.defaultPantryIngredients,
      settingsResult.data?.paymentsMinAppVersion,
    ),
  };
}

export async function loadReferenceData(force = false): Promise<ReferenceData> {
  if (cachedReference && !force) {
    const merged = await mergeFreshAppConfig(cachedReference);
    cachedReference = merged;
    return merged;
  }

  if (!force) {
    const diskCached = await loadCachedReferenceData();
    if (diskCached) {
      const merged = await mergeFreshAppConfig({
        ...diskCached,
        appConfig: diskCached.appConfig ?? DEFAULT_APP_CONFIG,
      });
      cachedReference = merged;
      void saveCachedReferenceData(merged);
      return merged;
    }
  }

  if (loadPromise && !force) {
    return loadPromise;
  }

  loadPromise = (async () => {
    if (isDirectSupabaseCatalogEnabled()) {
      try {
        const data = await loadReferenceFromSupabase();
        cachedReference = {
          ...data,
          appConfig: data.appConfig ?? DEFAULT_APP_CONFIG,
        };
        void saveCachedReferenceData(cachedReference);
        return cachedReference;
      } catch (error) {
        console.warn('[reference] Supabase read failed, falling back to API', error);
      }
    }

    const data = await apiFetch<ReferenceData>('/api/reference');
    cachedReference = {
      ...data,
      appConfig: data.appConfig ?? DEFAULT_APP_CONFIG,
    };
    void saveCachedReferenceData(cachedReference);
    return cachedReference;
  })()
    .catch((error) => {
      if (cachedReference && !force) {
        return cachedReference;
      }
      throw error instanceof Error ? error : new Error('Could not load reference data from the server');
    })
    .finally(() => {
      loadPromise = null;
    });

  return loadPromise;
}

export function getCachedReferenceData(): ReferenceData {
  return cachedReference ?? EMPTY_REFERENCE;
}
