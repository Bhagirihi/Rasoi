import { useCallback, useMemo, useState } from 'react';

import type { BillingInterval } from '@/constants/plans';
import {
  getConfiguredPaymentProviderId,
  PAYMENT_DISCLAIMERS,
  PAYMENT_PROVIDER_LABELS,
} from '@/constants/payments';
import { MONETIZATION_LIVE } from '@/constants/monetizationConfig';
import { getPaymentProvider } from '@/services/payments';
import type { PurchaseFlowResult } from '@/services/payments/types';

export type UsePaywallOptions = {
  upgradeToPaid: (interval?: BillingInterval) => Promise<void>;
  restorePurchases: () => Promise<void>;
};

export function usePaywall({ upgradeToPaid, restorePurchases }: UsePaywallOptions) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const providerId = getConfiguredPaymentProviderId();
  const provider = getPaymentProvider();

  const purchasePlus = useCallback(
    async (interval: BillingInterval = 'monthly'): Promise<PurchaseFlowResult> => {
      if (!MONETIZATION_LIVE) {
        const message =
          'Subscriptions are not open yet during early access. Partner links are unlocked for free.';
        setLastError(message);
        return { ok: false, error: message };
      }
      setIsPurchasing(true);
      setLastError(null);
      try {
        await upgradeToPaid(interval);
        return {
          ok: true,
          planState: { planTier: 'paid', trialStartedAt: null, hasUsedTrial: true },
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Purchase could not be completed.';
        setLastError(message);
        return { ok: false, error: message };
      } finally {
        setIsPurchasing(false);
      }
    },
    [upgradeToPaid],
  );

  const restore = useCallback(async (): Promise<PurchaseFlowResult> => {
    setIsRestoring(true);
    setLastError(null);
    try {
      await restorePurchases();
      return { ok: true, planState: { planTier: 'paid', trialStartedAt: null, hasUsedTrial: true } };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not restore purchases.';
      setLastError(message);
      return { ok: false, error: message };
    } finally {
      setIsRestoring(false);
    }
  }, [restorePurchases]);

  return useMemo(
    () => ({
      providerId,
      providerLabel: PAYMENT_PROVIDER_LABELS[providerId],
      paymentDisclaimer: PAYMENT_DISCLAIMERS[providerId],
      supportsRestore: provider.supportsRestore,
      isPurchasing,
      isRestoring,
      isBusy: isPurchasing || isRestoring,
      lastError,
      purchasePlus,
      restorePurchases: restore,
      clearError: () => setLastError(null),
    }),
    [
      providerId,
      provider.supportsRestore,
      isPurchasing,
      isRestoring,
      lastError,
      purchasePlus,
      restore,
    ],
  );
}
