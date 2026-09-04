import { useEffect, useMemo, useRef, useState } from 'react';

import { useAppContext } from '@/context/AppContext';
import { useRecipes } from '@/context/RecipesContext';
import type { Recipe } from '@/data/mockRecipes';

/** Resolves saved recipe IDs to full recipe objects, fetching missing rows by id. */
export function useSavedRecipes(): {
  savedRecipes: Recipe[];
  loading: boolean;
} {
  const { savedRecipeIds } = useAppContext();
  const { recipes, loadRecipeById } = useRecipes();
  const fetchedRef = useRef<Record<string, Recipe>>({});
  const [cacheVersion, setCacheVersion] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadedIds = new Set([
      ...recipes.map((recipe) => recipe.id),
      ...Object.keys(fetchedRef.current),
    ]);
    const missingIds = savedRecipeIds.filter((id) => !loadedIds.has(id));
    if (missingIds.length === 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void Promise.all(
      missingIds.map(async (id) => {
        const recipe = await loadRecipeById(id);
        return recipe ? ([id, recipe] as const) : null;
      }),
    ).then((pairs) => {
      if (cancelled) return;
      for (const pair of pairs) {
        if (pair) fetchedRef.current[pair[0]] = pair[1];
      }
      setCacheVersion((version) => version + 1);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [savedRecipeIds, recipes, loadRecipeById]);

  const savedRecipes = useMemo(() => {
    void cacheVersion;
    const byId = new Map<string, Recipe>();
    for (const recipe of recipes) byId.set(recipe.id, recipe);
    for (const recipe of Object.values(fetchedRef.current)) byId.set(recipe.id, recipe);
    return savedRecipeIds
      .map((id) => byId.get(id))
      .filter((recipe): recipe is Recipe => recipe != null);
  }, [savedRecipeIds, recipes, cacheVersion]);

  return { savedRecipes, loading };
}
