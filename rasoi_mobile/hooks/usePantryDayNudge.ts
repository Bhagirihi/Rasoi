import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { useAppContext } from '@/context/AppContext';
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
  } = useAppContext();
  const { restockItems } = usePantryScreenData();

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
        restockItems.length === 0
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
    restockItems.length,
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

  return {
    visible,
    activeWindow,
    missingItems: restockItems,
    shopModalVisible,
    setShopModalVisible,
    dismiss,
    handleCheckPantry,
    handleOrderMissing,
  };
}
