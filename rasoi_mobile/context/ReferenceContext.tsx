import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import {
  loadAppConfigFresh,
  loadReferenceData,
  type KitchenStyle,
  type PantrySection,
  type ReferenceData,
} from '@/services/reference';
import { useRasoiRealtimeTables } from '@/utils/realtime';

const DEFAULT_APP_CONFIG = {
  paymentsEnabled: false,
  defaultPantryIngredients: [] as string[],
};

const EMPTY_REFERENCE: ReferenceData = {
  regionalCuisines: [],
  pantrySections: [],
  kitchenStyles: [],
  appConfig: DEFAULT_APP_CONFIG,
};

type ReferenceContextValue = {
  regionalCuisines: string[];
  pantrySections: PantrySection[];
  kitchenStyles: KitchenStyle[];
  paymentsEnabled: boolean;
  loading: boolean;
  error: string | null;
  refreshReference: () => Promise<void>;
};

const ReferenceContext = createContext<ReferenceContextValue | undefined>(undefined);

export function ReferenceProvider({ children }: { children: ReactNode }) {
  const [reference, setReference] = useState<ReferenceData>(EMPTY_REFERENCE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshReference = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loadReferenceData(force);
      setReference(data);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : 'Could not load reference data from the server';
      setError(message);
      setReference(EMPTY_REFERENCE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshReference();
  }, [refreshReference]);

  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState !== 'active') return;
      void (async () => {
        const appConfig = await loadAppConfigFresh();
        setReference((current) => {
          const prevPantry = current.appConfig?.defaultPantryIngredients ?? [];
          if (
            appConfig.paymentsEnabled === current.appConfig?.paymentsEnabled &&
            appConfig.defaultPantryIngredients.length === prevPantry.length &&
            appConfig.defaultPantryIngredients.every((item, index) => item === prevPantry[index])
          ) {
            return current;
          }
          return { ...current, appConfig };
        });
      })();
    };

    const appStateSub = AppState.addEventListener('change', handleAppState);
    return () => appStateSub.remove();
  }, []);

  useRasoiRealtimeTables(
    ['KitchenStyle', 'RegionalCuisineOption', 'PantrySection', 'AppSettings'],
    () => {
      void refreshReference(true);
    },
    'reference',
  );

  const value = useMemo<ReferenceContextValue>(
    () => ({
      regionalCuisines: reference.regionalCuisines,
      pantrySections: reference.pantrySections,
      kitchenStyles: reference.kitchenStyles,
      paymentsEnabled: reference.appConfig?.paymentsEnabled ?? false,
      loading,
      error,
      refreshReference,
    }),
    [reference, loading, error, refreshReference],
  );

  return <ReferenceContext.Provider value={value}>{children}</ReferenceContext.Provider>;
}

export function useReferenceData(): ReferenceContextValue {
  const context = useContext(ReferenceContext);
  if (!context) {
    throw new Error('useReferenceData must be used within ReferenceProvider');
  }
  return context;
}
