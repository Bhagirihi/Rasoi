import { PURCHASES_ERROR_CODE } from 'react-native-purchases';

import { normalizeRasoiPlusProductId } from '@/constants/payments';
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

function buildPurchaseResult(
  request: PurchaseRequest,
  input: { transactionId?: string; storeProductId?: string },
): PurchaseResult {
  const storeProductId = input.storeProductId;
  const normalizedProductId =
    normalizeRasoiPlusProductId(storeProductId ?? request.productId) ?? request.productId;

  return {
    success: true,
    provider: 'revenuecat',
    productId: normalizedProductId,
    storeProductId,
    transactionId: input.transactionId ?? storeProductId ?? request.productId,
  };
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
      const result = await purchaseRevenueCatProduct(
        request.productId,
        request.googlePlayOfferTag,
      );
      return buildPurchaseResult(request, result);
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
      const result = await restoreRevenueCatPurchases();
      const storeProductId = result.storeProductId;
      const productId = storeProductId
        ? normalizeRasoiPlusProductId(storeProductId)
        : undefined;

      return {
        success: true,
        provider: 'revenuecat',
        productId: productId ?? undefined,
        storeProductId,
        transactionId: result.transactionId ?? storeProductId,
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
