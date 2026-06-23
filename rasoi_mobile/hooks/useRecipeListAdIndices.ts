import { useMemo } from 'react';

import {
  getRecipeListAdIndices,
  recipeListAdSeed,
  type RecipeListAdOptions,
} from '@/utils/recipeListAds';

export function useRecipeListAdIndices(
  recipes: readonly { id: string }[],
  options?: RecipeListAdOptions,
): Set<number> {
  const seed = useMemo(() => recipeListAdSeed(recipes), [recipes]);
  const count = recipes.length;
  const minRecipesBeforeFirstAd = options?.minRecipesBeforeFirstAd;
  const minGap = options?.minGap;
  const maxGapJitter = options?.maxGapJitter;
  const maxAds = options?.maxAds;

  return useMemo(
    () =>
      getRecipeListAdIndices(count, seed, {
        minRecipesBeforeFirstAd,
        minGap,
        maxGapJitter,
        maxAds,
      }),
    [count, seed, minRecipesBeforeFirstAd, minGap, maxGapJitter, maxAds],
  );
}
