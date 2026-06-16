import type { NotificationResponse } from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

import { useAppContext } from '@/context/AppContext';
import {
  getLastNotificationResponse,
  getNavigationFromNotificationResponse,
  isNewNotificationResponse,
  markNotificationResponseHandled,
  subscribeToNotificationResponses,
  type NotificationNavigationTarget,
} from '@/utils/notifications';

export function useNotificationNavigation(): void {
  const router = useRouter();
  const {
    isHydrated,
    hasCompletedOnboarding,
    isLoggedIn,
    pendingTrialWelcome,
    toggleSavedRecipe,
    isRecipeSaved,
  } = useAppContext();

  const appReady =
    isHydrated && hasCompletedOnboarding && isLoggedIn && !pendingTrialWelcome;

  const navigate = useCallback(
    (target: NotificationNavigationTarget) => {
      if (target.type === 'recipes_tab') {
        router.push('/(tabs)/recipes');
        return;
      }

      if (target.save && !isRecipeSaved(target.recipeId)) {
        toggleSavedRecipe(target.recipeId);
      }

      router.push(target.cook ? `/recipe/${target.recipeId}?cook=1` : `/recipe/${target.recipeId}`);
    },
    [router, toggleSavedRecipe, isRecipeSaved],
  );

  const handleResponse = useCallback(
    async (response: NotificationResponse) => {
      const isNew = await isNewNotificationResponse(response);
      if (!isNew) return;

      const target = getNavigationFromNotificationResponse(response);
      if (!target) return;

      await markNotificationResponseHandled(response);
      navigate(target);
    },
    [navigate],
  );

  useEffect(() => {
    if (Platform.OS === 'web' || !appReady) return;

    let unsubscribe = () => undefined;
    let cancelled = false;

    void (async () => {
      const response = await getLastNotificationResponse();
      if (!cancelled && response) {
        await handleResponse(response);
      }

      unsubscribe = await subscribeToNotificationResponses((nextResponse) => {
        void handleResponse(nextResponse);
      });
    })();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [appReady, handleResponse]);
}
