import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'expo-router';

import { useAppContext } from '@/context/AppContext';
import { useNetworkConnectivity } from '@/context/NetworkConnectivityContext';
import { useRecipes } from '@/context/RecipesContext';
import { useTonightRecipes } from '@/context/TonightRecipesContext';

/**
 * When the device goes offline:
 * 1. Refresh catalog/picks so Home can fall back to downloads.
 * 2. If the user's plan includes offline cooking and they have downloads,
 *    redirect to Saved → Offline ready.
 */
export default function OfflineModeRefreshBridge() {
  const router = useRouter();
  const pathname = usePathname();
  const { isOffline } = useNetworkConnectivity();
  const {
    isLoggedIn,
    pendingPantrySetup,
    offlineRecipeIds,
    planLimits,
  } = useAppContext();
  const { refreshRecipes } = useRecipes();
  const { refreshHomePicks } = useTonightRecipes();
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (isOffline && !wasOfflineRef.current) {
      void refreshRecipes({ bypassCache: true });
      void refreshHomePicks(false);

      const planAllowsOffline = planLimits.offlineRecipeLimit > 0;
      const hasDownloads = offlineRecipeIds.length > 0;
      const canRedirect =
        isLoggedIn &&
        !pendingPantrySetup &&
        planAllowsOffline &&
        hasDownloads;

      if (canRedirect) {
        const alreadyOnSaved = pathname?.includes('/saved') ?? false;
        if (!alreadyOnSaved) {
          router.replace({
            pathname: '/(tabs)/saved',
            params: { offline: '1' },
          });
        }
      }
    }
    wasOfflineRef.current = isOffline;
  }, [
    isOffline,
    isLoggedIn,
    pendingPantrySetup,
    planLimits.offlineRecipeLimit,
    offlineRecipeIds.length,
    pathname,
    refreshRecipes,
    refreshHomePicks,
    router,
  ]);

  return null;
}
