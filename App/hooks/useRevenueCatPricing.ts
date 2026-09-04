import { useEffect, useState } from 'react';

import { getConfiguredPaymentProviderId } from '@/constants/payments';
import {
  fetchRevenueCatStorePricing,
  type RevenueCatStorePricing,
} from '@/services/payments/revenueCatClient';

const EMPTY_PRICING: RevenueCatStorePricing = {
  monthly: null,
  yearly: null,
  storeReady: false,
};

export function useRevenueCatPricing(enabled = true) {
  const [pricing, setPricing] = useState<RevenueCatStorePricing>(EMPTY_PRICING);
  const [loading, setLoading] = useState(enabled && getConfiguredPaymentProviderId() === 'revenuecat');

  useEffect(() => {
    if (!enabled || getConfiguredPaymentProviderId() !== 'revenuecat') {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void fetchRevenueCatStorePricing()
      .then((next) => {
        if (!cancelled) setPricing(next);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { pricing, loading, storeReady: pricing.storeReady };
}
