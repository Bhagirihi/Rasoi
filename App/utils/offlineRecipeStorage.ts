import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Recipe } from '@/data/mockRecipes';

const STORAGE_KEY = '@rasoi/offline_recipes_v1';

type OfflineRecipeEntry = {
  recipe: Recipe;
  downloadedAt: number;
};

type OfflineRecipeStore = {
  order: string[];
  recipes: Record<string, OfflineRecipeEntry>;
};

function emptyStore(): OfflineRecipeStore {
  return { order: [], recipes: {} };
}

function readStore(raw: string | null): OfflineRecipeStore {
  if (!raw) return emptyStore();
  try {
    const parsed = JSON.parse(raw) as OfflineRecipeStore;
    if (!parsed || typeof parsed.recipes !== 'object' || !Array.isArray(parsed.order)) {
      return emptyStore();
    }
    return parsed;
  } catch {
    return emptyStore();
  }
}

async function loadStore(): Promise<OfflineRecipeStore> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return readStore(raw);
}

async function persistStore(store: OfflineRecipeStore): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export async function listOfflineRecipeIds(): Promise<string[]> {
  const store = await loadStore();
  return [...store.order];
}

export async function getOfflineRecipe(id: string): Promise<Recipe | null> {
  const store = await loadStore();
  return store.recipes[id]?.recipe ?? null;
}

export async function getAllOfflineRecipes(): Promise<Recipe[]> {
  const store = await loadStore();
  return store.order
    .map((id) => store.recipes[id]?.recipe)
    .filter((recipe): recipe is Recipe => recipe != null);
}

export async function saveOfflineRecipe(recipe: Recipe): Promise<void> {
  const store = await loadStore();
  const now = Date.now();
  const existing = store.recipes[recipe.id];

  store.recipes[recipe.id] = {
    recipe,
    downloadedAt: existing?.downloadedAt ?? now,
  };
  store.order = store.order.filter((id) => id !== recipe.id);
  store.order.push(recipe.id);

  await persistStore(store);
}

export async function removeOfflineRecipe(id: string): Promise<void> {
  const store = await loadStore();
  if (!store.recipes[id]) return;

  delete store.recipes[id];
  store.order = store.order.filter((recipeId) => recipeId !== id);
  await persistStore(store);
}

export async function clearOfflineRecipes(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
