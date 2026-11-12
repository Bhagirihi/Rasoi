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
import { runAfterInteractions } from '@/utils/runAfterInteractions';

import { useAppContext } from '@/context/AppContext';
import { useRecipes } from '@/context/RecipesContext';
import type { Recipe } from '@/data/mockRecipes';
import {
  fetchRecommendations,
  loadOfflineRecommendations,
  mapRecommendationPicks,
  saveOfflineRecommendations,
} from '@/services/recommendations';
import { buildHomePicksProfileKey, dedupeHomePicks, resolveHomeMealPicks } from '@/utils/homeMealPicks';
import { getScheduledMealWindow, type ScheduledMealWindow } from '@/utils/mealTime';
import { getPlanRecipeIdsForHomeExclusion } from '@/utils/planMenu';
import { MEAL_SECTION_MINUTES, minutesSinceMidnight } from '@/constants/mealTimeWindows';
import { SEASONAL_RAIL_PICK_COUNTS } from '@/constants/planFeatureLimits';
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
const MEAL_WINDOW_POLL_MS = 60_000;

export function TonightRecipesProvider({ children }: { children: ReactNode }) {
  const {
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    pantryIngredients,
    userId,
    effectiveAllergyExclusions,
    planLimits,
  } = useAppContext();
  const homePickCount = planLimits.homePickCount;
  const { recipes, loading: recipesLoading } = useRecipes();
  const [mealWindow, setMealWindow] = useState<ScheduledMealWindow>(() => getScheduledMealWindow());
  const deferredPantryIngredients = useDeferredValue(pantryIngredients);
  const deferredRecipes = useDeferredValue(recipes);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const forceNextRefreshRef = useRef(false);
  const excludeOnRefreshRef = useRef<string[]>([]);
  /** windowKey|profileKey of the picks currently on screen. */
  const lastPicksKeyRef = useRef('');
  /** Server-fetch key already requested, so effect re-runs don't re-hit the API. */
  const serverFetchKeyRef = useRef('');
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
      allergyExclusions: effectiveAllergyExclusions,
    });
  }, [deferredRecipes, recipesLoading, dietChoice, regionalCuisine, favoriteCuisines, effectiveAllergyExclusions]);

  const planRecipeIds = useMemo(
    () => (pickPool.length > 0 ? getPlanRecipeIdsForHomeExclusion(pickPool) : []),
    [pickPool],
  );

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
    const shouldForce = forceNextRefreshRef.current;
    forceNextRefreshRef.current = false;
    const excludeRecipeIds = shouldForce ? excludeOnRefreshRef.current : [];
    excludeOnRefreshRef.current = [];
    const reservedRecipeIds = [...new Set([...excludeRecipeIds, ...planRecipeIds])];
    const picksKey = `${mealWindow.windowKey}|${profileKey}`;
    // Stale-while-revalidate: keep the current picks on screen while the same
    // meal window re-validates (e.g. the recipes just finished loading). Only
    // show the skeleton when the window/profile actually changed or the user
    // forced a refresh — otherwise the hero flickers back to loading on
    // every effect re-run.
    if (shouldForce || picksKey !== lastPicksKeyRef.current) {
      setHomePicksReady(false);
    }

    const applyMappedPicks = (
      mapped: ReturnType<typeof mapRecommendationPicks>,
      markReady: boolean,
    ) => {
      const deduped = dedupeHomePicks(mapped.picks, mapped.lateNightPick);
      const seasonalPickCount = SEASONAL_RAIL_PICK_COUNTS[planLimits.seasonalRailMode];
      setSeasonalRail(
        mapped.seasonalRail && seasonalPickCount > 0
          ? {
              ...mapped.seasonalRail,
              picks: mapped.seasonalRail.picks.slice(0, seasonalPickCount),
            }
          : null,
      );
      if (mealWindow.isOvernightDual) {
        setLateNightPick(deduped.lateNightPick);
      } else {
        setLateNightPick(undefined);
      }
      setHomePicks(deduped.picks.slice(0, homePickCount));
      setPickReasons(mapped.reasons);
      if (markReady) {
        setHomePicksReady(deduped.picks.length > 0);
      }
      return deduped.picks.length > 0;
    };

    // Server picks with no entries must not wipe the picks already on screen
    // (the API can return empty while the local pool still has picks).
    const applyServerPicks = (
      mapped: ReturnType<typeof mapRecommendationPicks>,
    ): boolean => {
      if (mapped.picks.length === 0 && !mapped.lateNightPick) return false;
      return applyMappedPicks(mapped, true);
    };

    // Local picks from the recipe pool. Only touches state when it produces
    // picks, so an empty local result never wipes cached server picks.
    const applyLocalPicks = async (): Promise<boolean> => {
      if (mealWindow.isOvernightDual && mealWindow.tomorrowBreakfastWindowKey) {
        const latePicks = await resolveHomeMealPicks({
          recipes: pickPool,
          windowKey: mealWindow.windowKey,
          profileKey,
          mealSlot: 'lateNight',
          count: 1,
          excludeRecipeIds: reservedRecipeIds.length > 0 ? reservedRecipeIds : undefined,
          forceRegenerate: shouldForce,
        });
        const late = latePicks[0];
        const tomorrowPicks = await resolveHomeMealPicks({
          recipes: pickPool,
          windowKey: mealWindow.tomorrowBreakfastWindowKey,
          profileKey,
          mealSlot: 'breakfast',
          count: homePickCount,
          excludeRecipeIds: [
            ...reservedRecipeIds,
            ...(late ? [late.id] : []),
          ],
          forceRegenerate: shouldForce,
        });
        const deduped = dedupeHomePicks(tomorrowPicks, late);
        if (cancelled) return false;
        if (!deduped.lateNightPick || deduped.picks.length === 0) return false;
        setLateNightPick(deduped.lateNightPick);
        setHomePicks(deduped.picks);
        setPickReasons([]);
        setHomePicksReady(true);
        return true;
      }

      const picks = await resolveHomeMealPicks({
        recipes: pickPool,
        windowKey: mealWindow.windowKey,
        profileKey,
        mealSlot: mealWindow.slot,
        count: homePickCount,
        excludeRecipeIds: reservedRecipeIds.length > 0 ? reservedRecipeIds : undefined,
        forceRegenerate: shouldForce,
      });
      if (cancelled) return false;
      const deduped = dedupeHomePicks(picks);
      if (deduped.picks.length === 0) return false;
      setLateNightPick(undefined);
      setHomePicks(deduped.picks);
      setPickReasons([]);
      setHomePicksReady(true);
      return true;
    };

    const loadPicks = async () => {
      try {
        let painted = false;

        // 1. Offline server picks (logged-in users): paint immediately from cache.
        if (userId && !shouldForce) {
          const offline = await loadOfflineRecommendations(mealWindow.windowKey);
          if (offline && !cancelled) {
            if (applyServerPicks(mapRecommendationPicks(offline))) {
              lastPicksKeyRef.current = picksKey;
              painted = true;
            }
          }
        }

        // 2. Local picks from the (possibly cached) recipe pool — computed
        // now, without waiting for the server. This is the fast path for
        // guests, who have no offline picks.
        if (!cancelled && pickPool.length > 0) {
          if (await applyLocalPicks()) {
            lastPicksKeyRef.current = picksKey;
            painted = true;
          }
        }

        // 3. Server picks in the background (once per window, or when
        // forced): they replace the local picks when they arrive. The hero
        // never blocks on this request.
        const serverKey = shouldForce ? `${picksKey}|force:${refreshNonce}` : picksKey;
        if (!cancelled && (shouldForce || serverFetchKeyRef.current !== serverKey)) {
          serverFetchKeyRef.current = serverKey;
          void fetchRecommendations({
            force: shouldForce,
            excludeRecipeIds: reservedRecipeIds.length > 0 ? reservedRecipeIds : undefined,
          })
            .then(async (response) => {
              if (cancelled || response.windowKey !== mealWindow.windowKey) return;
              await saveOfflineRecommendations(mealWindow.windowKey, response);
              if (cancelled) return;
              if (applyServerPicks(mapRecommendationPicks(response))) {
                lastPicksKeyRef.current = picksKey;
              }
            })
            .catch(() => undefined);
        }

        // Nothing to show yet (no pool, no cached picks): stay in the
        // loading state. The effect re-runs when the recipes arrive.
        if (
          !cancelled &&
          !painted &&
          homePicksRef.current.length === 0 &&
          pickPool.length === 0
        ) {
          setHomePicksReady(false);
        }
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
    planRecipeIds,
    refreshNonce,
    homePickCount,
    planLimits.seasonalRailMode,
  ]);

  const topPick = homePicks[0];
  const alsoFor = homePicks.slice(1, homePickCount);
  // The hero no longer waits for the recipe list when picks are already on
  // screen (offline/server picks carry full recipe objects). Local picks are
  // computed from the pool, so they already imply the list has loaded.
  const rankingReady = homePicksReady && (!recipesLoading || homePicks.length > 0);

  const [readyToCookCount, setReadyToCookCount] = useState(0);
  const [readyToCookReady, setReadyToCookReady] = useState(false);

  useEffect(() => {
    setReadyToCookReady(false);

    if (pickPool.length === 0 || pantryIngredients.length === 0) {
      setReadyToCookCount(0);
      setReadyToCookReady(true);
      return;
    }

    const task = runAfterInteractions(() => {
      const scanPool = pickPool.slice(0, READY_TO_COOK_SCAN_LIMIT);
      const count = countFullyStockedRecipes(scanPool, {
        dietPreference: dietChoiceToFilter(dietChoice),
        regionalCuisine,
        favoriteCuisines,
        pantryIngredients,
        allergyExclusions: effectiveAllergyExclusions,
      });
      setReadyToCookCount(count);
      setReadyToCookReady(true);
    });

    return () => task.cancel();
  }, [pickPool, dietChoice, regionalCuisine, favoriteCuisines, pantryIngredients, effectiveAllergyExclusions]);

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


