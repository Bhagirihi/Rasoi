import React, {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { InteractionManager } from 'react-native';

import { useAppContext } from '@/context/AppContext';
import { useRecipes } from '@/context/RecipesContext';
import type { Recipe } from '@/data/mockRecipes';
import {
  fetchRecommendations,
  loadOfflineRecommendations,
  mapRecommendationPicks,
  saveOfflineRecommendations,
} from '@/services/recommendations';
import { buildHomePicksProfileKey, resolveHomeMealPicks } from '@/utils/homeMealPicks';
import { getScheduledMealWindow, type ScheduledMealWindow } from '@/utils/mealTime';
import { MEAL_SECTION_MINUTES, minutesSinceMidnight } from '@/constants/mealTimeWindows';
import { countFullyStockedRecipes, filterRecipes, sortRecipesForTonight } from '@/utils/recipes';
import { dietChoiceToFilter } from '@/utils/storage';

type TonightRecipesContextValue = {
  rankedRecipes: Recipe[];
  topPick: Recipe | undefined;
  alsoFor: Recipe[];
  lateNightPick: Recipe | undefined;
  pickReasons: string[];
  seasonalRail: { id: string; title: string; subtitle: string; picks: Recipe[] } | null;
  readyToCookCount: number;
  readyToCookReady: boolean;
  rankingReady: boolean;
  picksRefreshing: boolean;
  refreshHomePicks: (force?: boolean) => Promise<void>;
};

const TonightRecipesContext = createContext<TonightRecipesContextValue | undefined>(undefined);

const READY_TO_COOK_SCAN_LIMIT = 300;
const HOME_PICK_COUNT = 4;
const MEAL_WINDOW_POLL_MS = 60_000;

export function TonightRecipesProvider({ children }: { children: ReactNode }) {
  const { dietChoice, regionalCuisine, favoriteCuisines, pantryIngredients, userId, allergyExclusions } =
    useAppContext();
  const { recipes, loading: recipesLoading } = useRecipes();
  const [mealWindow, setMealWindow] = useState<ScheduledMealWindow>(() => getScheduledMealWindow());
  const deferredPantryIngredients = useDeferredValue(pantryIngredients);
  const deferredRecipes = useDeferredValue(recipes);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const forceNextRefreshRef = useRef(false);
  const excludeOnRefreshRef = useRef<string[]>([]);
  const homePicksRef = useRef<Recipe[]>([]);
  const lateNightPickRef = useRef<Recipe | undefined>(undefined);

  useEffect(() => {
    const syncWindow = () => setMealWindow(getScheduledMealWindow());
    const intervalId = setInterval(syncWindow, MEAL_WINDOW_POLL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const profileKey = useMemo(
    () =>
      buildHomePicksProfileKey({
        dietChoice,
        regionalCuisine,
        favoriteCuisines,
        userId,
      }),
    [dietChoice, regionalCuisine, favoriteCuisines, userId],
  );

  const pickPool = useMemo(() => {
    if (recipesLoading || deferredRecipes.length === 0) {
      return [];
    }

    return filterRecipes(deferredRecipes, {
      dietPreference: dietChoiceToFilter(dietChoice),
      dietChoice,
      regionalCuisine,
      favoriteCuisines,
      pantryIngredients: [],
      fastFilters: [],
      allergyExclusions,
    });
  }, [deferredRecipes, recipesLoading, dietChoice, regionalCuisine, favoriteCuisines, allergyExclusions]);

  const rankedRecipes = useMemo(() => {
    if (pickPool.length === 0) {
      return [];
    }

    return sortRecipesForTonight(
      filterRecipes(pickPool, {
        dietPreference: dietChoiceToFilter(dietChoice),
        dietChoice,
        regionalCuisine,
        favoriteCuisines,
        pantryIngredients: deferredPantryIngredients,
        fastFilters: [],
      }),
      {
        regionalCuisine,
        pantryIngredients: deferredPantryIngredients,
        mealSlot: mealWindow.slot,
      },
    );
  }, [
    pickPool,
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    deferredPantryIngredients,
    mealWindow.slot,
  ]);

  const [homePicks, setHomePicks] = useState<Recipe[]>([]);
  const [pickReasons, setPickReasons] = useState<string[]>([]);
  const [lateNightPick, setLateNightPick] = useState<Recipe | undefined>();
  const [seasonalRail, setSeasonalRail] = useState<TonightRecipesContextValue['seasonalRail']>(null);
  const [homePicksReady, setHomePicksReady] = useState(false);
  const [picksRefreshing, setPicksRefreshing] = useState(false);

  useEffect(() => {
    homePicksRef.current = homePicks;
  }, [homePicks]);

  useEffect(() => {
    lateNightPickRef.current = lateNightPick;
  }, [lateNightPick]);

  const refreshHomePicks = useCallback(async (force = false) => {
    if (force) {
      const excludeIds = [
        ...homePicksRef.current.map((recipe) => recipe.id),
        ...(lateNightPickRef.current ? [lateNightPickRef.current.id] : []),
      ];
      excludeOnRefreshRef.current = [...new Set(excludeIds)];
      setPicksRefreshing(true);
    }
    forceNextRefreshRef.current = force;
    setRefreshNonce((nonce) => nonce + 1);
  }, []);

  useEffect(() => {
    const now = new Date();
    const nowMinutes = minutesSinceMidnight(now.getHours(), now.getMinutes());
    const boundaries = Object.values(MEAL_SECTION_MINUTES).sort((a, b) => a - b);
    let windowStart = boundaries[0];
    let windowEnd = boundaries[boundaries.length - 1];

    for (let index = 0; index < boundaries.length - 1; index += 1) {
      if (nowMinutes >= boundaries[index] && nowMinutes < boundaries[index + 1]) {
        windowStart = boundaries[index];
        windowEnd = boundaries[index + 1];
        break;
      }
    }

    const elapsed = nowMinutes - windowStart;
    const duration = Math.max(30, windowEnd - windowStart);
    const midpointMs = Math.max(60_000, (duration / 2 - elapsed) * 60_000);

    const timerId = setTimeout(() => {
      void refreshHomePicks(false);
    }, midpointMs);

    return () => clearTimeout(timerId);
  }, [mealWindow.windowKey, refreshHomePicks]);

  useEffect(() => {
    let cancelled = false;
    setHomePicksReady(false);
    const shouldForce = forceNextRefreshRef.current;
    forceNextRefreshRef.current = false;
    const excludeRecipeIds = shouldForce ? excludeOnRefreshRef.current : [];
    excludeOnRefreshRef.current = [];

    const loadPicks = async () => {
      try {
      if (userId) {
        try {
          const response = await fetchRecommendations({
            force: shouldForce,
            excludeRecipeIds: excludeRecipeIds.length > 0 ? excludeRecipeIds : undefined,
          });
          if (cancelled) return;

          const mapped = mapRecommendationPicks(response);
          await saveOfflineRecommendations(mealWindow.windowKey, response);
          setSeasonalRail(mapped.seasonalRail ?? null);

          if (mealWindow.isOvernightDual) {
            setLateNightPick(mapped.lateNightPick);
            setHomePicks(mapped.picks.slice(0, HOME_PICK_COUNT));
            setPickReasons(mapped.reasons);
            setHomePicksReady(mapped.picks.length > 0);
            return;
          }

          setLateNightPick(undefined);
          setHomePicks(mapped.picks.slice(0, HOME_PICK_COUNT));
          setPickReasons(mapped.reasons);
          setHomePicksReady(mapped.picks.length > 0);
          return;
        } catch {
          const offline = await loadOfflineRecommendations(mealWindow.windowKey);
          if (offline && !cancelled) {
            const mapped = mapRecommendationPicks(offline);
            setSeasonalRail(mapped.seasonalRail ?? null);
            setHomePicks(mapped.picks.slice(0, HOME_PICK_COUNT));
            setPickReasons(mapped.reasons);
            setLateNightPick(mapped.lateNightPick);
            setHomePicksReady(mapped.picks.length > 0);
            return;
          }
        }
      }

      if (recipesLoading || pickPool.length === 0) {
      setHomePicks([]);
      setPickReasons([]);
      setLateNightPick(undefined);
      setSeasonalRail(null);
      return;
      }

      if (mealWindow.isOvernightDual && mealWindow.tomorrowBreakfastWindowKey) {
        const latePicks = await resolveHomeMealPicks({
          recipes: pickPool,
          windowKey: mealWindow.windowKey,
          profileKey,
          mealSlot: 'lateNight',
          count: 1,
          excludeRecipeIds: excludeRecipeIds.length > 0 ? excludeRecipeIds : undefined,
          forceRegenerate: shouldForce,
        });
        const late = latePicks[0];
        const tomorrowPicks = await resolveHomeMealPicks({
          recipes: pickPool,
          windowKey: mealWindow.tomorrowBreakfastWindowKey,
          profileKey,
          mealSlot: 'breakfast',
          count: HOME_PICK_COUNT,
          excludeRecipeIds: [
            ...excludeRecipeIds,
            ...(late ? [late.id] : []),
          ],
          forceRegenerate: shouldForce,
        });
        const tomorrowFinal = late
          ? tomorrowPicks.filter((recipe) => recipe.id !== late.id)
          : tomorrowPicks;
        if (cancelled) return;
        setLateNightPick(late);
        setHomePicks(tomorrowFinal);
        setPickReasons([]);
        setHomePicksReady(Boolean(late) && tomorrowFinal.length > 0);
        return;
      }

      const picks = await resolveHomeMealPicks({
        recipes: pickPool,
        windowKey: mealWindow.windowKey,
        profileKey,
        mealSlot: mealWindow.slot,
        count: HOME_PICK_COUNT,
        excludeRecipeIds: excludeRecipeIds.length > 0 ? excludeRecipeIds : undefined,
        forceRegenerate: shouldForce,
      });
      if (cancelled) return;
      setLateNightPick(undefined);
      setHomePicks(picks);
      setPickReasons([]);
      setHomePicksReady(picks.length > 0);
      } finally {
        if (!cancelled && shouldForce) {
          setPicksRefreshing(false);
        }
      }
    };

    void loadPicks();

    return () => {
      cancelled = true;
    };
  }, [
    userId,
    mealWindow.windowKey,
    mealWindow.tomorrowBreakfastWindowKey,
    mealWindow.slot,
    mealWindow.isOvernightDual,
    profileKey,
    recipesLoading,
    pickPool,
    refreshNonce,
  ]);

  const topPick = homePicks[0];
  const alsoFor = homePicks.slice(1, HOME_PICK_COUNT);
  const rankingReady = !recipesLoading && homePicksReady;

  const [readyToCookCount, setReadyToCookCount] = useState(0);
  const [readyToCookReady, setReadyToCookReady] = useState(false);

  useEffect(() => {
    setReadyToCookReady(false);

    if (recipes.length === 0 || pantryIngredients.length === 0) {
      setReadyToCookCount(0);
      setReadyToCookReady(true);
      return;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      const scanPool = recipes.slice(0, READY_TO_COOK_SCAN_LIMIT);
      const count = countFullyStockedRecipes(scanPool, {
        dietPreference: dietChoiceToFilter(dietChoice),
        regionalCuisine,
        pantryIngredients,
      });
      setReadyToCookCount(count);
      setReadyToCookReady(true);
    });

    return () => task.cancel();
  }, [recipes.length, dietChoice, regionalCuisine, pantryIngredients]);

  const value = useMemo<TonightRecipesContextValue>(
    () => ({
      rankedRecipes,
      topPick,
      alsoFor,
      lateNightPick,
      pickReasons,
      seasonalRail,
      readyToCookCount,
      readyToCookReady,
      rankingReady,
      picksRefreshing,
      refreshHomePicks,
    }),
    [
      rankedRecipes,
      topPick,
      alsoFor,
      lateNightPick,
      pickReasons,
      seasonalRail,
      readyToCookCount,
      readyToCookReady,
      rankingReady,
      picksRefreshing,
      refreshHomePicks,
    ],
  );

  return <TonightRecipesContext.Provider value={value}>{children}</TonightRecipesContext.Provider>;
}

export function useTonightRecipes(): TonightRecipesContextValue {
  const context = useContext(TonightRecipesContext);
  if (!context) {
    throw new Error('useTonightRecipes must be used within TonightRecipesProvider');
  }
  return context;
}
