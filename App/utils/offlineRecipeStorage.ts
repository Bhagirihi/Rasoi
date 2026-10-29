import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Recipe } from '@/data/mockRecipes';

/**
 * Offline-saved recipes.
 *
 * Each recipe lives under its own AsyncStorage key so saves/removes never
 * rewrite the whole collection (the old single-blob format did a full
 * JSON.parse + JSON.stringify per save, and grew unbounded against
 * AsyncStorage's ~6MB Android limit). An index key tracks insertion order for
 * LRU eviction; the collection is capped at MAX_OFFLINE_RECIPES.
 *
 * Images stay remote URLs — offline recipes render imageless unless the URL
 * is already in the expo-image disk cache (see RecipeImage).
 */

const LEGACY_STORAGE_KEY = '@rasoi/offline_recipes_v1';
const KEY_PREFIX = '@rasoi/offline_recipe/';
const INDEX_KEY = '@rasoi/offline_recipe_index_v1';
const MAX_OFFLINE_RECIPES = 50;

type OfflineRecipeEntry = {
  recipe: Recipe;
  downloadedAt: number;
};

async function readIndex(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(INDEX_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed.filter((id) => typeof id === 'string');
    }
  } catch {
    // Corrupt index — rebuild from legacy data below.
  }
  return migrateLegacyStore();
}

/** One-time migration from the old single-blob format. */
async function migrateLegacyStore(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as {
      order?: string[];
      recipes?: Record<string, OfflineRecipeEntry>;
    };
    const order = Array.isArray(parsed.order) ? parsed.order : [];
    const recipes = parsed.recipes ?? {};
    const migrated: string[] = [];
    for (const id of order.slice(-MAX_OFFLINE_RECIPES)) {
      const entry = recipes[id];
      if (!entry?.recipe) continue;
      await AsyncStorage.setItem(KEY_PREFIX + id, JSON.stringify(entry));
      migrated.push(id);
    }
    await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(migrated));
    await AsyncStorage.removeItem(LEGACY_STORAGE_KEY);
    return migrated;
  } catch {
    return [];
  }
}

async function writeIndex(order: string[]): Promise<void> {
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(order));
}

async function readEntry(id: string): Promise<OfflineRecipeEntry | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY_PREFIX + id);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OfflineRecipeEntry;
    if (!parsed?.recipe?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function listOfflineRecipeIds(): Promise<string[]> {
  return readIndex();
}

export async function getOfflineRecipe(id: string): Promise<Recipe | null> {
  const entry = await readEntry(id);
  return entry?.recipe ?? null;
}

export async function getAllOfflineRecipes(): Promise<Recipe[]> {
  const order = await readIndex();
  const recipes: Recipe[] = [];
  for (const id of order) {
    const entry = await readEntry(id);
    if (entry) recipes.push(entry.recipe);
  }
  return recipes;
}

export async function saveOfflineRecipe(recipe: Recipe): Promise<void> {
  const existing = await readEntry(recipe.id);
  await AsyncStorage.setItem(
    KEY_PREFIX + recipe.id,
    JSON.stringify({
      recipe,
      downloadedAt: existing?.downloadedAt ?? Date.now(),
    } satisfies OfflineRecipeEntry),
  );

  const order = (await readIndex()).filter((id) => id !== recipe.id);
  order.push(recipe.id);

  // LRU eviction: drop oldest first so the store never grows unbounded.
  while (order.length > MAX_OFFLINE_RECIPES) {
    const evicted = order.shift();
    if (evicted) await AsyncStorage.removeItem(KEY_PREFIX + evicted);
  }
  await writeIndex(order);
}

export async function removeOfflineRecipe(id: string): Promise<void> {
  await AsyncStorage.removeItem(KEY_PREFIX + id);
  await writeIndex((await readIndex()).filter((recipeId) => recipeId !== id));
}

export async function clearOfflineRecipes(): Promise<void> {
  const order = await readIndex();
  await Promise.all(order.map((id) => AsyncStorage.removeItem(KEY_PREFIX + id)));
  await AsyncStorage.multiRemove([INDEX_KEY, LEGACY_STORAGE_KEY]);
}
