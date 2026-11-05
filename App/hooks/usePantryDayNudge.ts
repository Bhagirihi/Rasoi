import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { useAppContext } from '@/context/AppContext';
import { useTonightRecipes } from '@/context/TonightRecipesContext';
import { usePantryScreenData } from '@/hooks/usePantryScreenData';
import { isAnnouncementModalActive } from '@/utils/announcementModalGate';
import {
  markPantryNudgeShownForWindow,
  wasPantryNudgeShownForWindow,
} from '@/utils/pantryNudgeStorage';
import {
  getActivePantryNudgeWindow,
  type PantryNudgeWindow,
} from '@/utils/pantryNudgeWindows';
import { partitionIngredients } from '@/utils/recipes';
import { PAYWALL_HREF } from '@/utils/routes';

const SHOW_DELAY_MS = 900;

export function usePantryDayNudge() {
  const router = useRouter();
  const {
    isHydrated,
    hasCompletedOnboarding,
    isLoggedIn,
    pendingPantrySetup,
    pendingTrialWelcome,
    pendingEmailVerification,
    emailVerificationModalVisible,
    showPartners,
    pantryIngredients,
  } = useAppContext();
  const { restockItems } = usePantryScreenData();
  const { topPick } = useTonightRecipes();

  const tonightMissing = useMemo(() => {
    if (!topPick) return [] as string[];
    return partitionIngredients(topPick, pantryIngredients).missing;
  }, [topPick, pantryIngredients]);

  // Prefer ingredients missing for tonight's pick; fall back to broader restock list.
  const missingItems = tonightMissing.length > 0 ? tonightMissing : restockItems;
  const focusRecipeTitle = tonightMissing.length > 0 ? topPick?.title : undefined;
  const focusRecipeId = tonightMissing.length > 0 ? topPick?.id : undefined;

  const [visible, setVisible] = useState(false);
  const [activeWindow, setActiveWindow] = useState<PantryNudgeWindow | null>(null);
  const [shopModalVisible, setShopModalVisible] = useState(false);
  const evaluatingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    setActiveWindow(null);
  }, []);

  const evaluate = useCallback(async () => {
    if (evaluatingRef.current || visible) return;
    evaluatingRef.current = true;

    try {
      if (
        !isHydrated ||
        !isLoggedIn ||
        !hasCompletedOnboarding ||
        pendingPantrySetup ||
        pendingTrialWelcome ||
        pendingEmailVerification ||
        emailVerificationModalVisible ||
        isAnnouncementModalActive() ||
        missingItems.length === 0
      ) {
        return;
      }

      const window = getActivePantryNudgeWindow();
      if (!window) return;

      const alreadyShown = await wasPantryNudgeShownForWindow(window);
      if (alreadyShown) return;

      clearTimer();
      timerRef.current = setTimeout(() => {
        if (isAnnouncementModalActive()) return;
        setActiveWindow(window);
        setVisible(true);
      }, SHOW_DELAY_MS);
    } finally {
      evaluatingRef.current = false;
    }
  }, [
    isHydrated,
    isLoggedIn,
    hasCompletedOnboarding,
    pendingPantrySetup,
    pendingTrialWelcome,
    pendingEmailVerification,
    emailVerificationModalVisible,
    missingItems.length,
    visible,
    clearTimer,
  ]);

  useEffect(() => {
    if (!visible || !activeWindow) return;
    void markPantryNudgeShownForWindow(activeWindow);
  }, [visible, activeWindow]);

  useFocusEffect(
    useCallback(() => {
      void evaluate();
      return () => {
        clearTimer();
      };
    }, [evaluate, clearTimer]),
  );

  useEffect(() => {
    const onAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        void evaluate();
      }
    };
    const sub = AppState.addEventListener('change', onAppStateChange);
    return () => {
      sub.remove();
      clearTimer();
    };
  }, [evaluate, clearTimer]);

  const handleCheckPantry = useCallback(async () => {
    await dismiss();
    router.push('/(tabs)/pantry');
  }, [dismiss, router]);

  const handleOrderMissing = useCallback(async () => {
    await dismiss();
    if (showPartners) {
      setShopModalVisible(true);
    } else {
      router.push(PAYWALL_HREF);
    }
  }, [dismiss, showPartners, router]);

  const handleCookTonight = useCallback(async () => {
    await dismiss();
    if (focusRecipeId) {
      router.push(`/recipe/${focusRecipeId}?cook=1`);
      return;
    }
    router.push('/(tabs)');
  }, [dismiss, focusRecipeId, router]);

  return {
    visible,
    activeWindow,
    missingItems,
    focusRecipeTitle,
    focusRecipeId,
    shopModalVisible,
    setShopModalVisible,
    dismiss,
    handleCheckPantry,
    handleOrderMissing,
    handleCookTonight,
  };
}
