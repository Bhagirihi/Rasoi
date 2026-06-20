import { PURCHASES_ERROR_CODE } from 'react-native-purchases';

import type { PaymentProvider, PurchaseRequest, PurchaseResult } from '@/services/payments/types';
import {
  isRevenueCatSupported,
  purchaseRevenueCatProduct,
  restoreRevenueCatPurchases,
} from '@/services/payments/revenueCatClient';

function isPurchaseCancelled(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const code = 'code' in error ? String(error.code) : '';
  return (
    code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR ||
    code === '1' // legacy numeric code
  );
}

function formatPurchaseError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Purchase could not be completed.';
}

export const revenueCatPaymentProvider: PaymentProvider = {
  id: 'revenuecat',
  supportsRestore: true,

  async purchase(request: PurchaseRequest): Promise<PurchaseResult> {
    if (!isRevenueCatSupported()) {
      return {
        success: false,
        provider: 'revenuecat',
        errorMessage: 'Subscriptions are only available on iOS and Android.',
      };
    }

    try {
      const { transactionId } = await purchaseRevenueCatProduct(request.productId);
      return {
        success: true,
        provider: 'revenuecat',
        transactionId,
      };
    } catch (error) {
      return {
        success: false,
        provider: 'revenuecat',
        cancelled: isPurchaseCancelled(error),
        errorMessage: formatPurchaseError(error),
      };
    }
  },

  async restorePurchases(): Promise<PurchaseResult> {
    if (!isRevenueCatSupported()) {
      return {
        success: false,
        provider: 'revenuecat',
        errorMessage: 'Restore is only available on iOS and Android.',
      };
    }

    try {
      const { transactionId } = await restoreRevenueCatPurchases();
      return {
        success: true,
        provider: 'revenuecat',
        transactionId,
      };
    } catch (error) {
      return {
        success: false,
        provider: 'revenuecat',
        errorMessage: formatPurchaseError(error),
      };
    }
  },
};
