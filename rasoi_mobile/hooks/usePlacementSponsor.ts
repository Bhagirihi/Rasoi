import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { fetchSponsor, type SponsorCardData } from '@/services/sponsors';
import { useRasoiRealtimeTables } from '@/utils/realtime';

export function usePlacementSponsor(placement: 'home' | 'pantry') {
  const [sponsor, setSponsor] = useState<SponsorCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const next = await fetchSponsor(placement);
      setSponsor(next);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : 'Could not load sponsor from the server';
      setError(message);
      setSponsor(null);
    } finally {
      setLoading(false);
    }
  }, [placement]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void refresh();
      }
    });

    return () => subscription.remove();
  }, [refresh]);

  useRasoiRealtimeTables(['Sponsor'], () => {
    void refresh();
  }, `sponsor-${placement}`);

  return { sponsor, loading, error, refresh };
}
