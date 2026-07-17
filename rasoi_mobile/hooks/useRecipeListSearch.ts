import { useEffect, useMemo, useState } from 'react';

import type { Recipe } from '@/data/mockRecipes';
import { searchRecipes } from '@/services/recipeSearch';
import {
  getRecipeSearchSuggestions,
  resolveRecipeListSearch,
  type RecipeSearchMode,
  type RecipeSearchSuggestion,
} from '@/utils/recipeSearchLocal';

type UseRecipeListSearchOptions = {
  query: string;
  listRecipes: Recipe[];
  suggestionCatalog: Recipe[];
  dietChoice: string;
  regionalCuisine: string;
};

type UseRecipeListSearchResult = {
  items: Recipe[];
  mode: RecipeSearchMode;
  message: string | null;
  suggestions: RecipeSearchSuggestion[];
  searchLoading: boolean;
};

export function useRecipeListSearch({
  query,
  listRecipes,
  suggestionCatalog,
  dietChoice,
  regionalCuisine,
}: UseRecipeListSearchOptions): UseRecipeListSearchResult {
  const [remoteResults, setRemoteResults] = useState<Recipe[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [remoteSettled, setRemoteSettled] = useState(true);

  const trimmedQuery = query.trim();

  useEffect(() => {
    if (trimmedQuery.length < 2) {
      setRemoteResults([]);
      setSearchLoading(false);
      setRemoteSettled(true);
      return;
    }

    let cancelled = false;
    setRemoteSettled(false);
    const timer = setTimeout(() => {
      setSearchLoading(true);
      void searchRecipes({
        query: trimmedQuery,
        dietChoice,
        region: regionalCuisine,
        limit: 60,
      })
        .then((response) => {
          if (!cancelled) setRemoteResults(response.items);
        })
        .catch(() => {
          if (!cancelled) setRemoteResults([]);
        })
        .finally(() => {
          if (!cancelled) {
            setSearchLoading(false);
            setRemoteSettled(true);
          }
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmedQuery, dietChoice, regionalCuisine]);

  const suggestions = useMemo(
    () => getRecipeSearchSuggestions(suggestionCatalog, trimmedQuery, 6),
    [suggestionCatalog, trimmedQuery],
  );

  const resolved = useMemo(
    () =>
      resolveRecipeListSearch({
        query: trimmedQuery,
        listRecipes,
        remoteResults,
        remoteSettled,
      }),
    [trimmedQuery, listRecipes, remoteResults, remoteSettled],
  );

  return {
    items: resolved.items,
    mode: resolved.mode,
    message: resolved.message,
    suggestions,
    searchLoading: searchLoading && trimmedQuery.length >= 2,
  };
}
