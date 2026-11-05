import type { Recipe } from '@/data/mockRecipes';

/**
 * Some hotlinked recipe CDNs return 403 without a browser-like User-Agent.
 * Used when loading the original URL (fallback after the display proxy).
 */
export const RECIPE_IMAGE_REQUEST_HEADERS: Record<string, string> = {
  Accept: 'image/avif,image/webp,image/apng,image/jpeg,image/*,*/*;q=0.8',
  'User-Agent':
    'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
};

/**
 * Many catalog photos are progressive JPEGs. On Android they often paint as a
 * black rectangle without calling onError (RN Image and some Glide paths).
 * wsrv.nl re-encodes to a baseline JPEG that decodes reliably.
 */
export function toDisplayRecipeImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/(?:^|\.)wsrv\.nl$/i.test(safeHostname(trimmed)) || /images\.weserv\.nl/i.test(trimmed)) {
    return trimmed;
  }
  // Do NOT pass `il` — that enables interlaced/progressive JPEG (black on Android).
  // Default wsrv JPEG output is baseline (SOF0), which Android BitmapFactory decodes.
  return `https://wsrv.nl/?url=${encodeURIComponent(trimmed)}&output=jpg&q=75&n=-1`;
}

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

/** Ordered display candidates: baseline proxy first, then original. */
export function getRecipeImageCandidates(url: string): string[] {
  const trimmed = url.trim();
  if (!trimmed) return [];
  const proxied = toDisplayRecipeImageUrl(trimmed);
  return proxied === trimmed ? [trimmed] : [proxied, trimmed];
}

/** Returns a loadable recipe hero URL, or null when missing / invalid. */
export function getRecipeImageUrl(recipe: Pick<Recipe, 'imageUrl'>): string | null {
  const url = recipe.imageUrl?.trim();
  if (!url || !/^https?:\/\//i.test(url)) return null;
  return url;
}

export function hasRecipeImage(recipe: Pick<Recipe, 'imageUrl'>): boolean {
  return getRecipeImageUrl(recipe) != null;
}

/** expo-image source for a concrete candidate URL. */
export function getRecipeImageSource(uri: string): {
  uri: string;
  headers?: Record<string, string>;
} {
  // Proxy already fetches upstream with a normal UA; don't send custom headers there.
  if (uri.includes('wsrv.nl') || uri.includes('images.weserv.nl')) {
    return { uri };
  }
  return { uri, headers: RECIPE_IMAGE_REQUEST_HEADERS };
}
