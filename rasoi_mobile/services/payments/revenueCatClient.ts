import { Platform } from 'react-native';
import type { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

import {
  REVENUECAT_ENTITLEMENT_ID,
  REVENUECAT_PACKAGE_ANNUAL,
  REVENUECAT_PACKAGE_MONTHLY,
} from '@/constants/revenuecat';
import {
  getRevenueCatApiKey,
  RASOI_PLUS_MONTHLY_PRODUCT_ID,
  RASOI_PLUS_YEARLY_PRODUCT_ID,
} from '@/constants/payments';
import type { PurchaseProductId } from '@/services/payments/types';

type PurchasesModule = typeof import('react-native-purchases').default;

let purchasesModulePromise: Promise<PurchasesModule> | null = null;
let configured = false;
let configurePromise: Promise<void> | null = null;

export function isRevenueCatSupported(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

async function getPurchasesModule(): Promise<PurchasesModule> {
  if (!purchasesModulePromise) {
    purchasesModulePromise = import('react-native-purchases').then((module) => module.default);
  }
  return purchasesModulePromise;
}

export async function configureRevenueCat(): Promise<boolean> {
  if (!isRevenueCatSupported()) return false;
  if (configured) return true;

  const apiKey = getRevenueCatApiKey(
    Platform.OS === 'ios' || Platform.OS === 'android' ? Platform.OS : 'web',
  );
  if (!apiKey) {
    console.warn('[RevenueCat] Missing API key for platform:', Platform.OS);
    return false;
  }

  if (!configurePromise) {
    configurePromise = (async () => {
      const Purchases = await getPurchasesModule();
      const { LOG_LEVEL } = await import('react-native-purchases');
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }
      Purchases.configure({ apiKey });
      configured = true;
    })();
  }

  await configurePromise;
  return true;
}

export async function syncRevenueCatUser(userId: string | null): Promise<void> {
  if (!(await configureRevenueCat())) return;

  const Purchases = await getPurchasesModule();
  if (userId) {
    await Purchases.logIn(userId);
    return;
  }
  await Purchases.logOut();
}

export function hasRasoiPlusEntitlement(customerInfo: CustomerInfo): boolean {
  return REVENUECAT_ENTITLEMENT_ID in customerInfo.entitlements.active;
}

export function getActiveSubscriptionTransactionId(customerInfo: CustomerInfo): string | undefined {
  const entitlement = customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT_ID];
  return entitlement?.productIdentifier ?? entitlement?.originalPurchaseDate;
}

async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  const Purchases = await getPurchasesModule();
  const offerings = await Purchases.getOfferings();
  return offerings.current ?? offerings.all.default ?? null;
}

function findPackage(
  offering: PurchasesOffering,
  productId: PurchaseProductId,
): PurchasesPackage | null {
  if (productId === RASOI_PLUS_YEARLY_PRODUCT_ID) {
    return (
      offering.annual ??
      offering.availablePackages.find((pkg) => pkg.identifier === REVENUECAT_PACKAGE_ANNUAL) ??
      null
    );
  }

  return (
    offering.monthly ??
    offering.availablePackages.find((pkg) => pkg.identifier === REVENUECAT_PACKAGE_MONTHLY) ??
    null
  );
}

export async function purchaseRevenueCatProduct(
  productId: PurchaseProductId,
): Promise<{ customerInfo: CustomerInfo; transactionId?: string }> {
  if (!(await configureRevenueCat())) {
    throw new Error('RevenueCat is not configured on this platform.');
  }

  const offering = await getCurrentOffering();
  if (!offering) {
    throw new Error('No subscription offering is available. Check RevenueCat dashboard.');
  }

  const pkg = findPackage(offering, productId);
  if (!pkg) {
    throw new Error(`Package not found for ${productId}.`);
  }

  const Purchases = await getPurchasesModule();
  const { customerInfo } = await Purchases.purchasePackage(pkg);

  if (!hasRasoiPlusEntitlement(customerInfo)) {
    throw new Error('Purchase completed but Rasoi Plus entitlement is not active.');
  }

  return {
    customerInfo,
    transactionId: getActiveSubscriptionTransactionId(customerInfo),
  };
}

export async function restoreRevenueCatPurchases(): Promise<{
  customerInfo: CustomerInfo;
  transactionId?: string;
}> {
  if (!(await configureRevenueCat())) {
    throw new Error('RevenueCat is not configured on this platform.');
  }

  const Purchases = await getPurchasesModule();
  const customerInfo = await Purchases.restorePurchases();

  if (!hasRasoiPlusEntitlement(customerInfo)) {
    throw new Error('No active Rasoi Plus subscription found.');
  }

  return {
    customerInfo,
    transactionId: getActiveSubscriptionTransactionId(customerInfo),
  };
}
