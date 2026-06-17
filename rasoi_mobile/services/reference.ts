import { apiFetch } from '@/utils/api';
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

export async function loadReferenceData(force = false): Promise<ReferenceData> {
  if (cachedReference && !force) {
    return cachedReference;
  }

  if (loadPromise && !force) {
    return loadPromise;
  }

  loadPromise = apiFetch<ReferenceData>('/api/reference')
    .then((data) => {
      cachedReference = {
        ...data,
        appConfig: data.appConfig ?? DEFAULT_APP_CONFIG,
      };
      return cachedReference;
    })
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
