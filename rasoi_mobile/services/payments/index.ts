import type { BillingInterval } from '@/constants/plans';
import {
  getConfiguredPaymentProviderId,
  RASOI_PLUS_MONTHLY_PRODUCT_ID,
  RASOI_PLUS_YEARLY_PRODUCT_ID,
  REVENUECAT_API_KEY_ANDROID,
  REVENUECAT_API_KEY_IOS,
} from '@/constants/payments';
import { stubPaymentProvider } from '@/services/payments/stubProvider';
import type {
  ApplyPaidPlanOptions,
  PaymentProvider,
  PurchaseFlowResult,
  PurchaseProductId,
} from '@/services/payments/types';
import { updateUserPlan } from '@/services/user';
import { Platform } from 'react-native';

let cachedProvider: PaymentProvider | null = null;

function createRevenueCatProvider(): PaymentProvider {
  const hasKeys =
    Platform.OS === 'ios'
      ? REVENUECAT_API_KEY_IOS.length > 0
      : Platform.OS === 'android'
        ? REVENUECAT_API_KEY_ANDROID.length > 0
        : false;

  if (!hasKeys) {
    console.warn('[Payments] RevenueCat selected but API keys missing — falling back to stub.');
    return stubPaymentProvider;
  }

  // Swap this block for `react-native-purchases` when you enable RevenueCat.
  return {
    id: 'revenuecat',
    supportsRestore: true,
    async purchase() {
      return {
        success: false,
        provider: 'revenuecat',
        errorMessage: 'Install react-native-purchases and configure offerings to enable billing.',
      };
    },
    async restorePurchases() {
      return {
        success: false,
        provider: 'revenuecat',
        errorMessage: 'Restore not configured yet.',
      };
    },
  };
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

async function applyPaidPlanOnServer(options: ApplyPaidPlanOptions): Promise<PurchaseFlowResult> {
  const localPaid: PurchaseFlowResult = {
    ok: true,
    planState: {
      planTier: 'paid',
      trialStartedAt: options.trialStartedAt,
      hasUsedTrial: true,
    },
  };

  if (!options.isLoggedIn) {
    return localPaid;
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
  const provider = getPaymentProvider();
  const purchase = await provider.purchase({ productId });

  if (!purchase.success) {
    return {
      ok: false,
      error: purchase.errorMessage ?? 'Purchase was not completed.',
      cancelled: purchase.cancelled,
    };
  }

  return applyPaidPlanOnServer(options);
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

  return applyPaidPlanOnServer(options);
}

export async function purchaseRasoiPlusDefault(
  options: ApplyPaidPlanOptions,
  interval: BillingInterval = 'monthly',
): Promise<PurchaseFlowResult> {
  const productId =
    interval === 'yearly' ? RASOI_PLUS_YEARLY_PRODUCT_ID : RASOI_PLUS_MONTHLY_PRODUCT_ID;
  return purchaseRasoiPlus(productId, options);
}
