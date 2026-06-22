import type { BillingInterval } from '@/constants/plans';
import {
  getConfiguredPaymentProviderId,
  getRevenueCatApiKey,
  RASOI_PLUS_MONTHLY_PRODUCT_ID,
  RASOI_PLUS_YEARLY_PRODUCT_ID,
} from '@/constants/payments';
import { confirmBillingSubscription } from '@/services/billing';
import { stubPaymentProvider } from '@/services/payments/stubProvider';
import { revenueCatPaymentProvider } from '@/services/payments/revenueCatProvider';
import type {
  ApplyPaidPlanOptions,
  PaymentProvider,
  PurchaseFlowResult,
  PurchaseProductId,
  PurchaseResult,
} from '@/services/payments/types';
import { updateUserPlan } from '@/services/user';
import { Platform } from 'react-native';

let cachedProvider: PaymentProvider | null = null;

function createRevenueCatProvider(): PaymentProvider {
  const hasKeys =
    Platform.OS === 'ios'
      ? getRevenueCatApiKey('ios').length > 0
      : Platform.OS === 'android'
        ? getRevenueCatApiKey('android').length > 0
        : false;

  if (!hasKeys) {
    console.warn('[Payments] RevenueCat selected but API keys missing — falling back to stub.');
    return stubPaymentProvider;
  }

  return revenueCatPaymentProvider;
}

function createRazorpayProvider(): PaymentProvider {
  return {
    id: 'razorpay',
    supportsRestore: false,
    async purchase() {
      return {
        success: false,
        provider: 'razorpay',
        errorMessage: 'Razorpay checkout will open here once EXPO_PUBLIC_RAZORPAY_KEY_ID is set.',
      };
    },
    async restorePurchases() {
      return {
        success: false,
        provider: 'razorpay',
        errorMessage: 'Restore is not used for Razorpay subscriptions.',
      };
    },
  };
}

export function getPaymentProvider(): PaymentProvider {
  if (cachedProvider) return cachedProvider;

  const id = getConfiguredPaymentProviderId();
  switch (id) {
    case 'revenuecat':
      cachedProvider = createRevenueCatProvider();
      break;
    case 'razorpay':
      cachedProvider = createRazorpayProvider();
      break;
    default:
      cachedProvider = stubPaymentProvider;
  }
  return cachedProvider;
}

export function resetPaymentProviderCache(): void {
  cachedProvider = null;
}

async function applyPaidPlanOnServer(
  options: ApplyPaidPlanOptions,
  purchase?: PurchaseResult,
): Promise<PurchaseFlowResult> {
  const localPaid: PurchaseFlowResult = {
    ok: true,
    planState: {
      planTier: 'paid',
      trialStartedAt: options.trialStartedAt,
      hasUsedTrial: true,
      trialBonusDays: 0,
      yearlyPromoOfferTag: null,
    },
  };

  if (!options.isLoggedIn) {
    return localPaid;
  }

  if (
    purchase?.provider === 'revenuecat' &&
    purchase.transactionId &&
    purchase.productId
  ) {
    try {
      const plan = await confirmBillingSubscription({
        provider: 'revenuecat',
        productId: purchase.productId,
        transactionId: purchase.transactionId,
      });
      return {
        ok: true,
        planState: {
          planTier: plan.planTier,
          trialStartedAt: plan.trialStartedAt,
          hasUsedTrial: plan.hasUsedTrial,
          trialBonusDays: plan.trialBonusDays ?? 0,
          yearlyPromoOfferTag: plan.yearlyPromoOfferTag ?? null,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Could not confirm subscription on server.',
      };
    }
  }

  try {
    const plan = await updateUserPlan({
      planTier: 'paid',
      trialStartedAt: options.trialStartedAt,
      hasUsedTrial: true,
    });
    return {
      ok: true,
      planState: {
        planTier: plan.planTier,
        trialStartedAt: plan.trialStartedAt,
        hasUsedTrial: plan.hasUsedTrial,
        trialBonusDays: plan.trialBonusDays ?? 0,
        yearlyPromoOfferTag: plan.yearlyPromoOfferTag ?? null,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Could not update subscription on server.',
    };
  }
}

export async function purchaseRasoiPlus(
  productId: PurchaseProductId,
  options: ApplyPaidPlanOptions,
): Promise<PurchaseFlowResult> {
  const configuredId = getConfiguredPaymentProviderId();
  const provider = getPaymentProvider();

  if (configuredId === 'revenuecat' && provider.id === 'stub') {
    return {
      ok: false,
      error:
        'Google Play / App Store billing is not configured in this build. Add RevenueCat keys to EAS and rebuild.',
    };
  }

  const purchase = await provider.purchase({
    productId,
    googlePlayOfferTag:
      productId === RASOI_PLUS_YEARLY_PRODUCT_ID ? options.yearlyPromoOfferTag : null,
  });

  if (!purchase.success) {
    return {
      ok: false,
      error: purchase.errorMessage ?? 'Purchase was not completed.',
      cancelled: purchase.cancelled,
    };
  }

  return applyPaidPlanOnServer(options, purchase);
}

export async function restoreRasoiPlus(options: ApplyPaidPlanOptions): Promise<PurchaseFlowResult> {
  const provider = getPaymentProvider();
  if (!provider.supportsRestore) {
    return {
      ok: false,
      error: 'Restore purchases is not available in preview mode.',
    };
  }

  const restored = await provider.restorePurchases();
  if (!restored.success) {
    return {
      ok: false,
      error: restored.errorMessage ?? 'No active subscription found.',
    };
  }

  return applyPaidPlanOnServer(options, restored);
}

export async function purchaseRasoiPlusDefault(
  options: ApplyPaidPlanOptions,
  interval: BillingInterval = 'monthly',
): Promise<PurchaseFlowResult> {
  const productId =
    interval === 'yearly' ? RASOI_PLUS_YEARLY_PRODUCT_ID : RASOI_PLUS_MONTHLY_PRODUCT_ID;
  return purchaseRasoiPlus(productId, options);
}
