import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'expo-router';

import { useAppContext } from '@/context/AppContext';
import { useNetworkConnectivity } from '@/context/NetworkConnectivityContext';
import { useTonightRecipes } from '@/context/TonightRecipesContext';

/**
 * When the device goes offline:
 * 1. Refresh home picks so Home can fall back to downloads.
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
  const { refreshHomePicks } = useTonightRecipes();
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (isOffline && !wasOfflineRef.current) {
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
    refreshHomePicks,
    router,
  ]);

  return null;
}
