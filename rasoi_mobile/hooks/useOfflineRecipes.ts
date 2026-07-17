import { useEffect, useMemo, useState } from 'react';

import { useAppContext } from '@/context/AppContext';
import { useRecipes } from '@/context/RecipesContext';
import type { Recipe } from '@/data/mockRecipes';
import { getOfflineRecipe } from '@/utils/offlineRecipeStorage';

/** Resolves offline recipe IDs to full recipe objects from device storage. */
export function useOfflineRecipes(): {
  offlineRecipes: Recipe[];
  loading: boolean;
} {
  const { offlineRecipeIds } = useAppContext();
  const { recipes, loadRecipeById } = useRecipes();
  const [resolved, setResolved] = useState<Record<string, Recipe>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (offlineRecipeIds.length === 0) {
      setResolved({});
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void Promise.all(
      offlineRecipeIds.map(async (id) => {
        const fromMemory = recipes.find((recipe) => recipe.id === id);
        if (fromMemory) return [id, fromMemory] as const;

        const stored = await getOfflineRecipe(id);
        if (stored) return [id, stored] as const;

        const fetched = await loadRecipeById(id);
        return fetched ? ([id, fetched] as const) : null;
      }),
    ).then((pairs) => {
      if (cancelled) return;
      const next: Record<string, Recipe> = {};
      for (const pair of pairs) {
        if (pair) next[pair[0]] = pair[1];
      }
      setResolved(next);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [loadRecipeById, offlineRecipeIds, recipes]);

  const offlineRecipes = useMemo(
    () =>
      offlineRecipeIds
        .map((id) => resolved[id] ?? recipes.find((recipe) => recipe.id === id))
        .filter((recipe): recipe is Recipe => recipe != null),
    [offlineRecipeIds, recipes, resolved],
  );

  return { offlineRecipes, loading };
}
