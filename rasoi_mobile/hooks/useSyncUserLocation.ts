import { useCallback, useEffect, useRef } from 'react';

import { useAppContext } from '@/context/AppContext';
import { ensureLocationPermissions, requestUserLocation } from '@/utils/location';

/** Sync GPS city to backend once per session when logged in and location is missing. */
export function useSyncUserLocation(enabled = true) {
  const { isLoggedIn, isHydrated, userCity, syncUserLocation } = useAppContext();
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !isHydrated || !isLoggedIn || userCity || attemptedRef.current) return;
    attemptedRef.current = true;

    void (async () => {
      try {
        const snapshot = await requestUserLocation();
        if (!snapshot?.latitude || !snapshot.longitude) return;
        await syncUserLocation(snapshot);
      } catch {
        // Location sync is optional — missing permission or undeployed API is OK.
      }
    })().catch(() => undefined);
  }, [enabled, isHydrated, isLoggedIn, syncUserLocation, userCity]);
}

export function useRefreshUserLocation() {
  const { syncUserLocation } = useAppContext();

  return useCallback(async () => {
    const granted = await ensureLocationPermissions();
    if (!granted) {
      return { ok: false as const, reason: 'permission_denied' as const };
    }

    const snapshot = await requestUserLocation();
    if (!snapshot || snapshot.latitude == null || snapshot.longitude == null) {
      return { ok: false as const, reason: 'unavailable' as const };
    }
    try {
      const saved = await syncUserLocation(snapshot);
      if (!saved) {
        return { ok: false as const, reason: 'sync_failed' as const };
      }
      return { ok: true as const, snapshot };
    } catch {
      return { ok: false as const, reason: 'sync_failed' as const };
    }
  }, [syncUserLocation]);
}
