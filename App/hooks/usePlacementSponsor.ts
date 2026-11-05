import { useCallback, useEffect, useState } from 'react';
import { runAfterInteractions } from '@/utils/runAfterInteractions';

import {
  fetchSponsor,
  invalidateSponsorCache,
  type SponsorCardData,
  type SponsorScreenPlacement,
} from '@/services/sponsors';
import { useRasoiRealtimeTables } from '@/utils/realtime';

/**
 * Loads an active sponsor for a UI placement.
 * Uses a shared TTL cache (sponsors.ts) so tab remounts / foreground resumes
 * do not each hit Supabase. Realtime invalidates + refreshes on change.
 */
export function usePlacementSponsor(placement: SponsorScreenPlacement) {
  const [sponsor, setSponsor] = useState<SponsorCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(
    async (force = false) => {
      setLoading(true);
      setError(null);

      try {
        const next = await fetchSponsor(placement, undefined, force);
        setSponsor(next);
      } catch (caught) {
        const message =
          caught instanceof Error ? caught.message : 'Could not load sponsor from the server';
        setError(message);
        setSponsor(null);
      } finally {
        setLoading(false);
      }
    },
    [placement],
  );

  useEffect(() => {
    let cancelled = false;
    const task = runAfterInteractions(() => {
      if (!cancelled) void refresh(false);
    });
    return () => {
      cancelled = true;
      task.cancel();
    };
  }, [refresh]);

  useRasoiRealtimeTables(
    ['Sponsor'],
    () => {
      invalidateSponsorCache(placement);
      void refresh(true);
    },
    `sponsor-${placement}`,
  );

  return { sponsor, loading, error, refresh: () => refresh(true) };
}
