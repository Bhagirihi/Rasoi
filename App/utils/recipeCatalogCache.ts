import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Recipe } from '@/data/mockRecipes';
import type { PaginationMeta } from '@/types/pagination';

const CACHE_KEY = '@rasoi/recipe_catalog_pages_v2';
/** Reuse cached list pages unless older than this (cuts repeat Supabase egress on cold start). */
export const RECIPE_CATALOG_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

type CachedRecipePage = {
  filterKey: string;
  offset: number;
  items: Recipe[];
  pagination: PaginationMeta;
  fetchedAt: number;
};

type RecipeCatalogStore = {
  pages: CachedRecipePage[];
};

function readStore(raw: string | null): RecipeCatalogStore {
  if (!raw) return { pages: [] };
  try {
    const parsed = JSON.parse(raw) as RecipeCatalogStore;
    if (!Array.isArray(parsed.pages)) return { pages: [] };
    return parsed;
  } catch {
    return { pages: [] };
  }
}

export function recipeCatalogFilterKey(filters: {
  dietChoice?: string;
  region?: string;
  dietType?: string;
  tag?: string;
}): string {
  return `${filters.dietChoice ?? ''}|${filters.region ?? ''}|${filters.dietType ?? ''}|${filters.tag ?? ''}`;
}

export async function loadCachedRecipePage(
  filterKey: string,
  offset: number,
): Promise<CachedRecipePage | null> {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  const store = readStore(raw);
  const entry = store.pages.find((page) => page.filterKey === filterKey && page.offset === offset);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > RECIPE_CATALOG_CACHE_TTL_MS) {
    return null;
  }
  return entry;
}

export async function saveCachedRecipePage(
  filterKey: string,
  offset: number,
  items: Recipe[],
  pagination: PaginationMeta,
): Promise<void> {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  const store = readStore(raw);
  const next: CachedRecipePage = {
    filterKey,
    offset,
    items,
    pagination,
    fetchedAt: Date.now(),
  };

  const pages = store.pages.filter(
    (page) => !(page.filterKey === filterKey && page.offset === offset),
  );
  pages.push(next);

  // Keep the newest page per filter/offset only (bounded storage).
  const trimmed = pages
    .sort((a, b) => b.fetchedAt - a.fetchedAt)
    .slice(0, 12);

  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ pages: trimmed }));
}

export async function clearRecipeCatalogCache(): Promise<void> {
  await AsyncStorage.removeItem(CACHE_KEY);
}
