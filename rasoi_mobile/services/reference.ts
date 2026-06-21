import { apiFetch } from '@/utils/api';
import { parseJson } from '@/utils/parseJson';
import { getRasoiDb, isDirectSupabaseReadsEnabled } from '@/utils/rasoiDb';
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
  };
};

const DEFAULT_APP_CONFIG = {
  paymentsEnabled: false,
};

const EMPTY_REFERENCE: ReferenceData = {
  regionalCuisines: [],
  pantrySections: [],
  kitchenStyles: [],
  appConfig: DEFAULT_APP_CONFIG,
};

let cachedReference: ReferenceData | null = null;
let loadPromise: Promise<ReferenceData> | null = null;

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
    db.from('AppSettings').select('paymentsEnabled').eq('id', 'default').maybeSingle(),
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
    appConfig: {
      paymentsEnabled: settingsResult.data?.paymentsEnabled ?? DEFAULT_APP_CONFIG.paymentsEnabled,
    },
  };
}

export async function loadReferenceData(force = false): Promise<ReferenceData> {
  if (cachedReference && !force) {
    return cachedReference;
  }

  if (loadPromise && !force) {
    return loadPromise;
  }

  loadPromise = (async () => {
    if (isDirectSupabaseReadsEnabled()) {
      try {
        const data = await loadReferenceFromSupabase();
        cachedReference = {
          ...data,
          appConfig: data.appConfig ?? DEFAULT_APP_CONFIG,
        };
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
