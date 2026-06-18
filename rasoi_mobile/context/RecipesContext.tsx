import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';

import { Recipe } from '@/data/mockRecipes';
import { fetchPublishedRecipes, fetchRecipeById } from '@/services/recipes';
import { getApiBaseUrl } from '@/utils/api';
import { useRasoiRealtimeTables } from '@/utils/realtime';

type RecipesContextValue = {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  refreshRecipes: () => Promise<void>;
  getRecipeById: (id: string) => Recipe | undefined;
  loadRecipeById: (id: string) => Promise<Recipe | null>;
};

const RecipesContext = createContext<RecipesContextValue | undefined>(undefined);

export function RecipesProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const next = await fetchPublishedRecipes();
      setRecipes(next);
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : 'Could not load recipes from the server';
      setError(`${message} (${getApiBaseUrl()})`);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshRecipes();
  }, [refreshRecipes]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;

      const now = Date.now();
      if (now - lastForegroundRefreshRef.current < 60_000) return;
      lastForegroundRefreshRef.current = now;

      void refreshRecipes();
    });

    return () => subscription.remove();
  }, [refreshRecipes]);

  useRasoiRealtimeTables(['Recipe'], () => {
    void refreshRecipes();
  }, 'recipes');

  const getRecipeById = useCallback(
    (id: string) => recipes.find((recipe) => recipe.id === id),
    [recipes],
  );

  const recipesRef = useRef(recipes);
  recipesRef.current = recipes;
  const lastForegroundRefreshRef = useRef(0);

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
      getRecipeById,
      loadRecipeById,
    }),
    [recipes, loading, error, refreshRecipes, getRecipeById, loadRecipeById],
  );

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}

export function useRecipes(): RecipesContextValue {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error('useRecipes must be used within RecipesProvider');
  }
  return context;
}
