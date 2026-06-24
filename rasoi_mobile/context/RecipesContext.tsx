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

import { Recipe } from "@/data/mockRecipes";
import {
  fetchPublishedRecipes,
  fetchRecipeById,
  type RecipeFetchFilters,
} from "@/services/recipes";
import { formatUserFacingApiError } from "@/utils/api";
import { useRasoiRealtimeTables } from "@/utils/realtime";

type RecipesContextValue = {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  refreshRecipes: () => Promise<void>;
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

export function RecipesProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const listFiltersRef = useRef<RecipeFetchFilters>({
    dietChoice: "Veg",
    region: "All India",
  });
  const lastFetchedKeyRef = useRef<string>("");
  const recipesRef = useRef(recipes);
  recipesRef.current = recipes;
  const lastForegroundRefreshRef = useRef(0);

  const refreshRecipes = useCallback(async () => {
    const filters = listFiltersRef.current;
    const hasRecipes = recipesRef.current.length > 0;
    if (!hasRecipes) {
      setLoading(true);
    }
    setError(null);

    try {
      const next = await fetchPublishedRecipes(filters);
      setRecipes(next);
      lastFetchedKeyRef.current = recipeFiltersKey(filters);
    } catch (caught) {
      setError(
        formatUserFacingApiError(
          caught,
          "Could not load recipes. Pull to refresh when you are back online.",
        ),
      );
      if (!hasRecipes) {
        setRecipes([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const syncRecipeFilters = useCallback(
    (dietChoice: string, regionalCuisine: string) => {
      const filters = filtersFromProfile(dietChoice, regionalCuisine);
      const key = recipeFiltersKey(filters);
      listFiltersRef.current = filters;

      if (key === lastFetchedKeyRef.current && recipesRef.current.length > 0) {
        return;
      }

      void refreshRecipes();
    },
    [refreshRecipes],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;

      const now = Date.now();
      if (now - lastForegroundRefreshRef.current < 60_000) return;
      lastForegroundRefreshRef.current = now;

      void refreshRecipes();
    });

    return () => subscription.remove();
  }, [refreshRecipes]);

  useRasoiRealtimeTables(
    ["Recipe"],
    () => {
      void refreshRecipes();
    },
    "recipes",
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
        return recipesRef.current.find((item) => item.id === id) ?? null;
      }
    },
    [mergeRecipe],
  );

  const value = useMemo<RecipesContextValue>(
    () => ({
      recipes,
      loading,
      error,
      refreshRecipes,
      syncRecipeFilters,
      getRecipeById,
      loadRecipeById,
    }),
    [
      recipes,
      loading,
      error,
      refreshRecipes,
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
