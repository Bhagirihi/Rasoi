import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AppState } from "react-native";

import { mergeOfflineStarterRecipes } from "@/data/offlineStarterRecipes";
import { Recipe } from "@/data/mockRecipes";
import {
  fetchPublishedRecipesPage,
  fetchRecipeById,
  type RecipeFetchFilters,
} from "@/services/recipes";
import { RECIPE_HOME_PAGE_SIZE, RECIPE_PAGE_SIZE } from "@/types/pagination";
import { formatUserFacingApiError, warmApiConnection } from "@/utils/api";
import { getOfflineRecipe } from "@/utils/offlineRecipeStorage";
import { useRasoiRealtimeTables } from "@/utils/realtime";

type RecipesContextValue = {
  recipes: Recipe[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  totalCount: number | null;
  error: string | null;
  refreshRecipes: () => Promise<void>;
  loadMoreRecipes: () => Promise<void>;
  syncRecipeFilters: (dietChoice: string, regionalCuisine: string) => void;
  getRecipeById: (id: string) => Recipe | undefined;
  loadRecipeById: (id: string) => Promise<Recipe | null>;
};

const RecipesContext = createContext<RecipesContextValue | undefined>(
  undefined,
);

function recipeFiltersKey(filters: RecipeFetchFilters): string {
  return `${filters.dietChoice ?? ""}|${filters.region ?? ""}`;
}

function filtersFromProfile(
  dietChoice: string,
  regionalCuisine: string,
): RecipeFetchFilters {
  return {
    dietChoice,
    region: regionalCuisine,
  };
}

function mergeRecipeList(current: Recipe[], incoming: Recipe[]): Recipe[] {
  if (incoming.length === 0) return current;
  const byId = new Map(current.map((recipe) => [recipe.id, recipe]));
  for (const recipe of incoming) {
    byId.set(recipe.id, recipe);
  }
  return [...byId.values()];
}

const FOREGROUND_RECIPE_REFRESH_MS = 15 * 60 * 1000;

export function RecipesProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const listFiltersRef = useRef<RecipeFetchFilters>({
    dietChoice: "Veg",
    region: "All India",
  });
  const lastFetchedKeyRef = useRef<string>("");
  const recipesRef = useRef(recipes);
  recipesRef.current = recipes;
  const nextOffsetRef = useRef(0);
  const hasMoreRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const lastForegroundRefreshRef = useRef(0);
  /** Bumped on refresh/filter change so in-flight pagination cannot apply stale pages. */
  const fetchGenerationRef = useRef(0);
  const realtimeRefreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyPage = useCallback((
    pageItems: Recipe[],
    pagination: { hasMore: boolean; nextOffset: number | null; total: number },
    replace: boolean,
    generation: number,
  ) => {
    if (generation !== fetchGenerationRef.current) return;
    setRecipes((current) => (replace ? pageItems : mergeRecipeList(current, pageItems)));
    setHasMore(pagination.hasMore);
    setTotalCount(pagination.total);
    hasMoreRef.current = pagination.hasMore;
    nextOffsetRef.current = pagination.nextOffset ?? nextOffsetRef.current + pageItems.length;
  }, []);

  const loadMoreRecipes = useCallback(async () => {
    if (!hasMoreRef.current || loadingMoreRef.current) return;

    const generation = fetchGenerationRef.current;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    setError(null);

    try {
      const page = await fetchPublishedRecipesPage(
        listFiltersRef.current,
        nextOffsetRef.current,
        RECIPE_PAGE_SIZE,
      );
      if (generation !== fetchGenerationRef.current) return;
      applyPage(page.items, page.pagination, false, generation);
    } catch (caught) {
      if (generation !== fetchGenerationRef.current) return;
      setError(
        formatUserFacingApiError(
          caught,
          "Could not load more recipes. Pull to refresh when you are back online.",
        ),
      );
    } finally {
      if (generation === fetchGenerationRef.current) {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  }, [applyPage]);

  const refreshRecipes = useCallback(async (options?: { bypassCache?: boolean }) => {
    const generation = ++fetchGenerationRef.current;
    loadingMoreRef.current = false;
    setLoadingMore(false);

    const filters = listFiltersRef.current;
    const hasRecipes = recipesRef.current.length > 0;
    if (!hasRecipes) {
      setLoading(true);
    }
    setError(null);

    try {
      // First page is the smaller home page: the hero only needs the top pick
      // + a few cards. Load-more pagination still uses RECIPE_PAGE_SIZE.
      const firstPage = await fetchPublishedRecipesPage(
        filters,
        0,
        RECIPE_HOME_PAGE_SIZE,
        options?.bypassCache ?? false,
      );
      if (generation !== fetchGenerationRef.current) return;
      applyPage(firstPage.items, firstPage.pagination, true, generation);
      lastFetchedKeyRef.current = recipeFiltersKey(filters);
    } catch (caught) {
      if (generation !== fetchGenerationRef.current) return;
      setError(
        formatUserFacingApiError(
          caught,
          "Could not load recipes. Pull to refresh when you are back online.",
        ),
      );
      if (!hasRecipes) {
        setRecipes(mergeOfflineStarterRecipes([]));
        setHasMore(false);
        setTotalCount(mergeOfflineStarterRecipes([]).length);
        hasMoreRef.current = false;
      }
    } finally {
      if (generation === fetchGenerationRef.current) {
        setLoading(false);
      }
    }
  }, [applyPage]);

  const syncRecipeFilters = useCallback(
    (dietChoice: string, regionalCuisine: string) => {
      const filters = filtersFromProfile(dietChoice, regionalCuisine);
      const key = recipeFiltersKey(filters);
      listFiltersRef.current = filters;

      if (key === lastFetchedKeyRef.current && recipesRef.current.length > 0) {
        return;
      }

      nextOffsetRef.current = 0;
      hasMoreRef.current = false;
      void refreshRecipes();
    },
    [refreshRecipes],
  );

  // Prefetch the first page with the default filters in parallel with
  // profile hydration (AppContext). Before this, the first recipe request
  // waited for session validation + profile load to finish. When the profile
  // arrives, syncRecipeFilters refetches only if the filters differ from
  // these defaults.
  useEffect(() => {
    void refreshRecipes();
  }, [refreshRecipes]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;

      const now = Date.now();
      if (now - lastForegroundRefreshRef.current < FOREGROUND_RECIPE_REFRESH_MS) return;
      lastForegroundRefreshRef.current = now;

      void refreshRecipes();
    });

    return () => subscription.remove();
  }, [refreshRecipes]);

  useRasoiRealtimeTables(
    ["Recipe"],
    () => {
      if (realtimeRefreshTimerRef.current) {
        clearTimeout(realtimeRefreshTimerRef.current);
      }
      realtimeRefreshTimerRef.current = setTimeout(() => {
        realtimeRefreshTimerRef.current = null;
        void refreshRecipes({ bypassCache: true });
      }, 2500);
    },
    "recipes",
  );

  useEffect(
    () => () => {
      if (realtimeRefreshTimerRef.current) {
        clearTimeout(realtimeRefreshTimerRef.current);
      }
    },
    [],
  );

  const getRecipeById = useCallback(
    (id: string) => recipes.find((recipe) => recipe.id === id),
    [recipes],
  );

  const mergeRecipe = useCallback((recipe: Recipe) => {
    setRecipes((current) => {
      const index = current.findIndex((item) => item.id === recipe.id);
      if (index === -1) {
        return [...current, recipe];
      }
      return current.map((item) => (item.id === recipe.id ? recipe : item));
    });
  }, []);

  const loadRecipeById = useCallback(
    async (id: string): Promise<Recipe | null> => {
      try {
        const recipe = await fetchRecipeById(id);
        mergeRecipe(recipe);
        return recipe;
      } catch {
        const cached = recipesRef.current.find((item) => item.id === id);
        if (cached) return cached;
        const offline = await getOfflineRecipe(id);
        if (offline) {
          mergeRecipe(offline);
          return offline;
        }
        return null;
      }
    },
    [mergeRecipe],
  );

  const value = useMemo<RecipesContextValue>(
    () => ({
      recipes,
      loading,
      loadingMore,
      hasMore,
      totalCount,
      error,
      refreshRecipes,
      loadMoreRecipes,
      syncRecipeFilters,
      getRecipeById,
      loadRecipeById,
    }),
    [
      recipes,
      loading,
      loadingMore,
      hasMore,
      totalCount,
      error,
      refreshRecipes,
      loadMoreRecipes,
      syncRecipeFilters,
      getRecipeById,
      loadRecipeById,
    ],
  );

  return (
    <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
  );
}

export function useRecipes(): RecipesContextValue {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error("useRecipes must be used within RecipesProvider");
  }
  return context;
}
