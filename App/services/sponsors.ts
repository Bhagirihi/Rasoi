import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SponsorResponse } from '@/types/api';
import { apiFetch } from '@/utils/api';
import { getRasoiDb, isDirectSupabaseCatalogEnabled } from '@/utils/rasoiDb';

export type SponsorCardData = {
  id: string;
  brandName: string;
  productLabel: string;
  tagline: string;
  logoUrl: string;
  cta?: string;
  searchQuery?: string;
};

function mapSponsor(sponsor: SponsorResponse): SponsorCardData {
  return {
    id: sponsor.id,
    brandName: sponsor.brandName,
    productLabel: sponsor.productLabel,
    tagline: sponsor.tagline,
    logoUrl: sponsor.logoUrl,
    cta: sponsor.cta,
    searchQuery: sponsor.searchQuery,
  };
}

export type SponsorScreenPlacement = 'home' | 'recipes' | 'pantry' | 'saved';

const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Sponsor fetch must never hang the ad slot: a stalled fetch holds
 * `loading=true` in usePlacementSponsor, so SponsorOrAd keeps returning null
 * and the AdMob fallback never mounts. 5s bounds both the direct Supabase
 * read and the API fallback (worst case ~10s total, then stale cache / null).
 */
const SPONSOR_FETCH_TIMEOUT_MS = 5000;
const STORAGE_PREFIX = 'rasoi_sponsor_v1_';

type CacheEntry = {
  value: SponsorCardData | null;
  fetchedAt: number;
};

const memoryCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<SponsorCardData | null>>();

function cacheKey(placement: string, recipeId?: string): string {
  return recipeId ? `${placement}:${recipeId}` : placement;
}

function storageKey(key: string): string {
  return `${STORAGE_PREFIX}${key.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
}

async function readDisk(key: string): Promise<SponsorCardData | null | undefined> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(key));
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (!parsed || typeof parsed.fetchedAt !== 'number') return undefined;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return undefined;
    memoryCache.set(key, parsed);
    return parsed.value;
  } catch {
    return undefined;
  }
}

async function writeDisk(key: string, value: SponsorCardData | null): Promise<void> {
  const entry: CacheEntry = { value, fetchedAt: Date.now() };
  memoryCache.set(key, entry);
  try {
    await AsyncStorage.setItem(storageKey(key), JSON.stringify(entry));
  } catch {
    // ignore
  }
}

async function fetchSponsorsFromSupabase(
  placement: SponsorScreenPlacement | 'recipe',
): Promise<SponsorResponse[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SPONSOR_FETCH_TIMEOUT_MS);

  try {
    const { data, error } = await getRasoiDb()
      .from('Sponsor')
      .select(
        'id, placement, brandName, productLabel, tagline, logoUrl, cta, searchQuery, recipeId, active, priority',
      )
      .eq('placement', placement)
      .eq('active', true)
      .order('priority', { ascending: false })
      .order('createdAt', { ascending: false })
      .abortSignal(controller.signal);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      placement: row.placement as SponsorResponse['placement'],
      brandName: row.brandName,
      productLabel: row.productLabel,
      tagline: row.tagline,
      logoUrl: row.logoUrl,
      cta: row.cta,
      searchQuery: row.searchQuery ?? undefined,
      recipeId: row.recipeId ?? undefined,
      active: row.active,
      priority: row.priority,
    }));
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchSponsorNetwork(
  placement: SponsorScreenPlacement | 'recipe',
  recipeId?: string,
): Promise<SponsorCardData | null> {
  let sponsors: SponsorResponse[];

  if (isDirectSupabaseCatalogEnabled()) {
    try {
      sponsors = await fetchSponsorsFromSupabase(placement);
    } catch (error) {
      console.warn('[sponsors] Supabase read failed, falling back to API', error);
      sponsors = await apiFetch<SponsorResponse[]>(
        `/api/sponsors?placement=${placement}&active=true`,
        undefined,
        { timeoutMs: SPONSOR_FETCH_TIMEOUT_MS },
      );
    }
  } else {
    sponsors = await apiFetch<SponsorResponse[]>(
      `/api/sponsors?placement=${placement}&active=true`,
      undefined,
      { timeoutMs: SPONSOR_FETCH_TIMEOUT_MS },
    );
  }

  let candidates = sponsors;
  if (placement === 'recipe' && recipeId) {
    const scoped = sponsors.filter(
      (sponsor) => !sponsor.recipeId || sponsor.recipeId === recipeId,
    );
    if (scoped.length > 0) {
      candidates = scoped;
    }
  }

  const top = candidates[0];
  return top ? mapSponsor(top) : null;
}

/**
 * Placement sponsors rarely change. Memory + AsyncStorage TTL (5 min) and
 * in-flight dedupe prevent Home/tabs from each firing duplicate Sponsor GETs.
 */
export async function fetchSponsor(
  placement: SponsorScreenPlacement | 'recipe',
  recipeId?: string,
  force = false,
): Promise<SponsorCardData | null> {
  const key = cacheKey(placement, recipeId);

  if (!force) {
    const mem = memoryCache.get(key);
    if (mem && Date.now() - mem.fetchedAt < CACHE_TTL_MS) {
      return mem.value;
    }
    const pending = inflight.get(key);
    if (pending) return pending;
    const disk = await readDisk(key);
    if (disk !== undefined) return disk;
  }

  const existing = inflight.get(key);
  if (existing && !force) return existing;

  const promise = (async () => {
    try {
      const value = await fetchSponsorNetwork(placement, recipeId);
      await writeDisk(key, value);
      return value;
    } catch {
      const mem = memoryCache.get(key);
      return mem?.value ?? null;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
}

/** Drop cache after Realtime Sponsor changes. */
export function invalidateSponsorCache(placement?: string): void {
  if (placement) {
    for (const key of [...memoryCache.keys()]) {
      if (key === placement || key.startsWith(`${placement}:`)) {
        memoryCache.delete(key);
        inflight.delete(key);
        void AsyncStorage.removeItem(storageKey(key)).catch(() => undefined);
      }
    }
    return;
  }
  memoryCache.clear();
  inflight.clear();
}

export function fetchHomeSponsor(): Promise<SponsorCardData | null> {
  return fetchSponsor('home');
}

export function fetchRecipesSponsor(): Promise<SponsorCardData | null> {
  return fetchSponsor('recipes');
}

export function fetchPantrySponsor(): Promise<SponsorCardData | null> {
  return fetchSponsor('pantry');
}

export function fetchSavedSponsor(): Promise<SponsorCardData | null> {
  return fetchSponsor('saved');
}

export async function fetchRecipeSponsor(recipeId: string): Promise<SponsorCardData | null> {
  return fetchSponsor('recipe', recipeId);
}
