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
import { fetchPublishedRecipesPage } from '@/services/recipes';
import { buildHomePicksProfileKey, dedupeHomePicks, resolveHomeMealPicks } from '@/utils/homeMealPicks';
import { getScheduledMealWindow, type ScheduledMealWindow } from '@/utils/mealTime';
import { getAllOfflineRecipes } from '@/utils/offlineRecipeStorage';
import { getPlanRecipeIdsForHomeExclusion } from '@/utils/planMenu';
import { MEAL_SECTION_MINUTES, minutesSinceMidnight } from '@/constants/mealTimeWindows';
import { countFullyStockedRecipes, filterRecipes, sortRecipesByPantryMatch, sortRecipesForTonight } from '@/utils/recipes';
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
    offlineRecipeIds,
  } = useAppContext();
  const homePickCount = planLimits.homePickCount;
  const { recipes, loading: recipesLoading } = useRecipes();
  const [mealWindow, setMealWindow] = useState<ScheduledMealWindow>(() => getScheduledMealWindow());
  const deferredPantryIngredients = useDeferredValue(pantryIngredients);
  const deferredRecipes = useDeferredValue(recipes);
  const pantryFirstPicks = useCallback(
    (picks: Recipe[]) => {
      if (picks.length === 0 || deferredPantryIngredients.length === 0) return picks;
      return sortRecipesByPantryMatch(picks, deferredPantryIngredients);
    },
    [deferredPantryIngredients],
  );
  const [refreshNonce, setRefreshNonce] = useState(0);
  const forceNextRefreshRef = useRef(false);
  const excludeOnRefreshRef = useRef<string[]>([]);
  const homePicksRef = useRef<Recipe[]>([]);
  const lateNightPickRef = useRef<Recipe | undefined>(undefined);

  const canUseOfflineDownloads =
    planLimits.offlineRecipeLimit > 0 && offlineRecipeIds.length > 0;

  const resolveOfflineDownloadPicks = useCallback(async (): Promise<Recipe[]> => {
    if (!canUseOfflineDownloads) return [];
    const downloaded = await getAllOfflineRecipes();
    if (downloaded.length === 0) return [];

    // Diet/allergy only — keep intentional downloads even if cuisine filters would drop them.
    const dietFiltered = filterRecipes(downloaded, {
      dietPreference: dietChoiceToFilter(dietChoice),
      dietChoice,
      regionalCuisine: 'All India',
      favoriteCuisines: [],
      pantryIngredients: [],
      fastFilters: [],
      allergyExclusions: effectiveAllergyExclusions,
    });
    const pool = dietFiltered.length > 0 ? dietFiltered : downloaded;
    return pool.slice(0, homePickCount);
  }, [canUseOfflineDownloads, dietChoice, effectiveAllergyExclusions, homePickCount]);

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
      // Pantry is for ranking only — keep the diet/cuisine pool unfiltered by stock.
      pickPool,
      {
        regionalCuisine,
        pantryIngredients: deferredPantryIngredients,
        mealSlot: mealWindow.slot,
      },
    );
  }, [
    pickPool,
    regionalCuisine,
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
    const reservedRecipeIds = [...new Set([...excludeRecipeIds, ...planRecipeIds])];

    const loadPicks = async () => {
      try {
      if (userId) {
        try {
          const response = await fetchRecommendations({
            force: shouldForce,
            excludeRecipeIds: reservedRecipeIds.length > 0 ? reservedRecipeIds : undefined,
          });
          if (cancelled) return;

          const mapped = mapRecommendationPicks(response);
          const deduped = dedupeHomePicks(mapped.picks, mapped.lateNightPick);
          await saveOfflineRecommendations(mealWindow.windowKey, response);
          setSeasonalRail(null);

          if (deduped.picks.length > 0) {
            if (mealWindow.isOvernightDual) {
              setLateNightPick(deduped.lateNightPick);
              setHomePicks(pantryFirstPicks(deduped.picks.slice(0, homePickCount)));
              setPickReasons(mapped.reasons);
              setHomePicksReady(true);
              return;
            }

            setLateNightPick(undefined);
              setHomePicks(pantryFirstPicks(deduped.picks.slice(0, homePickCount)));
            setPickReasons(mapped.reasons);
            setHomePicksReady(true);
            return;
          }
          // API returned no picks — fall through to local meal picks below.
        } catch {
          // Prefer user downloads over stale recommendation cache.
          const downloadedPicks = await resolveOfflineDownloadPicks();
          if (downloadedPicks.length > 0 && !cancelled) {
            setSeasonalRail(null);
            setLateNightPick(undefined);
            setHomePicks(pantryFirstPicks(downloadedPicks));
            setPickReasons([]);
            setHomePicksReady(true);
            return;
          }

          const offline = await loadOfflineRecommendations(mealWindow.windowKey);
          if (offline && !cancelled) {
            const mapped = mapRecommendationPicks(offline);
            const deduped = dedupeHomePicks(mapped.picks, mapped.lateNightPick);
            if (deduped.picks.length > 0) {
              setSeasonalRail(null);
              setHomePicks(pantryFirstPicks(deduped.picks.slice(0, homePickCount)));
              setPickReasons(mapped.reasons);
              setLateNightPick(deduped.lateNightPick);
              setHomePicksReady(true);
              return;
            }
          }
        }
      }

      if (recipesLoading || pickPool.length === 0) {
        const downloadedPicks = await resolveOfflineDownloadPicks();
        if (downloadedPicks.length > 0 && !cancelled) {
          setSeasonalRail(null);
          setLateNightPick(undefined);
          setHomePicks(pantryFirstPicks(downloadedPicks.slice(0, homePickCount)));
          setPickReasons([]);
          setHomePicksReady(true);
          return;
        }

        if (pickPool.length === 0 && !recipesLoading) {
          try {
            const page = await fetchPublishedRecipesPage(
              { dietChoice, region: regionalCuisine },
              0,
              homePickCount,
              true,
              false,
            );
            const fallbackPool = filterRecipes(page.items, {
              dietPreference: dietChoiceToFilter(dietChoice),
              dietChoice,
              regionalCuisine,
              favoriteCuisines,
              pantryIngredients: [],
              fastFilters: [],
              allergyExclusions: effectiveAllergyExclusions,
            });
            if (fallbackPool.length > 0 && !cancelled) {
              const picks = await resolveHomeMealPicks({
                recipes: fallbackPool,
                windowKey: mealWindow.windowKey,
                profileKey,
                mealSlot: mealWindow.slot,
                count: homePickCount,
                excludeRecipeIds: reservedRecipeIds.length > 0 ? reservedRecipeIds : undefined,
                forceRegenerate: shouldForce,
              });
              if (cancelled) return;
              const deduped = dedupeHomePicks(picks);
              setLateNightPick(undefined);
              setHomePicks(pantryFirstPicks(deduped.picks));
              setPickReasons([]);
              setHomePicksReady(deduped.picks.length > 0);
              return;
            }
          } catch {
            // fall through to empty
          }
        }

        setHomePicks([]);
        setPickReasons([]);
        setLateNightPick(undefined);
        setSeasonalRail(null);
        setHomePicksReady(false);
        return;
      }

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
          count: 1,
          excludeRecipeIds: [
            ...reservedRecipeIds,
            ...(late ? [late.id] : []),
          ],
          forceRegenerate: shouldForce,
        });
        const deduped = dedupeHomePicks(tomorrowPicks, late);
        if (cancelled) return;
        setLateNightPick(deduped.lateNightPick);
        setHomePicks(pantryFirstPicks(deduped.picks));
        setPickReasons([]);
        setHomePicksReady(Boolean(deduped.lateNightPick) && deduped.picks.length > 0);
        return;
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
      if (cancelled) return;
      const deduped = dedupeHomePicks(picks);
      setLateNightPick(undefined);
      setHomePicks(pantryFirstPicks(deduped.picks));
      setPickReasons([]);
      setHomePicksReady(deduped.picks.length > 0);
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
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    effectiveAllergyExclusions,
    resolveOfflineDownloadPicks,
    pantryFirstPicks,
    deferredPantryIngredients,
  ]);

  const topPick = homePicks[0];
  const alsoFor = homePicks.slice(1, homePickCount);
  // Allow offline download picks to surface before the catalog refresh finishes.
  const rankingReady = homePicksReady && (!recipesLoading || homePicks.length > 0);

  const [readyToCookCount, setReadyToCookCount] = useState(0);
  const [readyToCookReady, setReadyToCookReady] = useState(false);

  useEffect(() => {
    setReadyToCookReady(false);

    if (pickPool.length === 0 || deferredPantryIngredients.length === 0) {
      setReadyToCookCount(0);
      setReadyToCookReady(true);
      return;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      const scanPool = pickPool.slice(0, READY_TO_COOK_SCAN_LIMIT);
      const count = countFullyStockedRecipes(scanPool, {
        dietPreference: dietChoiceToFilter(dietChoice),
        regionalCuisine,
        favoriteCuisines,
        pantryIngredients: deferredPantryIngredients,
        allergyExclusions: effectiveAllergyExclusions,
      });
      setReadyToCookCount(count);
      setReadyToCookReady(true);
    });

    return () => task.cancel();
  }, [
    pickPool,
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    deferredPantryIngredients,
    effectiveAllergyExclusions,
  ]);

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
