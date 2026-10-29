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

  // The local search path re-scores the whole catalog synchronously on every
  // keystroke (term expansion + tokenization + Levenshtein per recipe). Debounce
  // the query feeding the local useMemos so typing stays at 60fps; the remote
  // call keeps its own 400ms debounce below.
  const [debouncedQuery, setDebouncedQuery] = useState(trimmedQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(trimmedQuery), 200);
    return () => clearTimeout(timer);
  }, [trimmedQuery]);

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
    () => getRecipeSearchSuggestions(suggestionCatalog, debouncedQuery, 6),
    [suggestionCatalog, debouncedQuery],
  );

  const resolved = useMemo(
    () =>
      resolveRecipeListSearch({
        query: debouncedQuery,
        listRecipes,
        remoteResults,
        remoteSettled,
      }),
    [debouncedQuery, listRecipes, remoteResults, remoteSettled],
  );

  return {
    items: resolved.items,
    mode: resolved.mode,
    message: resolved.message,
    suggestions,
    searchLoading: searchLoading && trimmedQuery.length >= 2,
  };
}
