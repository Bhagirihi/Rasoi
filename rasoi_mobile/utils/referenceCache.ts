import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ReferenceData } from '@/services/reference';

const CACHE_KEY = '@rasoi/reference_data_v1';
export const REFERENCE_CACHE_TTL_MS = 30 * 60 * 1000;

type CachedReference = {
  data: ReferenceData;
  fetchedAt: number;
};

export async function loadCachedReferenceData(): Promise<ReferenceData | null> {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as CachedReference;
    if (!parsed.data || typeof parsed.fetchedAt !== 'number') return null;
    if (Date.now() - parsed.fetchedAt > REFERENCE_CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export async function saveCachedReferenceData(data: ReferenceData): Promise<void> {
  const payload: CachedReference = { data, fetchedAt: Date.now() };
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
}

export async function clearReferenceCache(): Promise<void> {
  await AsyncStorage.removeItem(CACHE_KEY);
}
