import { Platform } from 'react-native';
import type { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

import { isExpoGo } from '@/utils/expoGo';

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
  // RevenueCat's native module is not in the Expo Go binary.
  if (isExpoGo()) return false;
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

/** Profile fields synced to RevenueCat subscriber attributes (dashboard + integrations). */
export type RevenueCatSubscriberProfile = {
  email?: string | null;
  displayName?: string | null;
  phoneNumber?: string | null;
  /** Custom keys only — do not use RevenueCat reserved `$` keys here. */
  attributes?: Record<string, string | null | undefined>;
};

function normalizeSubscriberEmail(email?: string | null): string | null {
  const value = email?.trim();
  return value && value.includes('@') ? value : null;
}

function normalizeSubscriberPhone(phone?: string | null): string | null {
  const digits = phone?.replace(/\D/g, '') ?? '';
  if (digits.length < 10) return null;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  return phone?.trim().startsWith('+') ? phone.trim() : `+${digits}`;
}

function buildCustomAttributes(
  attributes: Record<string, string | null | undefined> | undefined,
): Record<string, string | null> {
  if (!attributes) return {};

  const result: Record<string, string | null> = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (!key || key.startsWith('$')) continue;
    const trimmed = value?.trim();
    result[key] = trimmed || null;
  }
  return result;
}

export async function syncRevenueCatUser(
  userId: string | null,
  profile?: RevenueCatSubscriberProfile,
): Promise<void> {
  if (!(await configureRevenueCat())) return;

  const Purchases = await getPurchasesModule();
  if (userId) {
    await Purchases.logIn(userId);
    await Purchases.setEmail(normalizeSubscriberEmail(profile?.email));
    await Purchases.setDisplayName(profile?.displayName?.trim() || null);
    await Purchases.setPhoneNumber(normalizeSubscriberPhone(profile?.phoneNumber));

    const customAttributes = buildCustomAttributes(profile?.attributes);
    if (Object.keys(customAttributes).length > 0) {
      await Purchases.setAttributes(customAttributes);
    }
    return;
  }

  const appUserId = await Purchases.getAppUserID();
  if (!appUserId.startsWith('$RCAnonymousID:')) {
    await Purchases.logOut();
  }
}

export function hasRasoiPlusEntitlement(customerInfo: CustomerInfo): boolean {
  return REVENUECAT_ENTITLEMENT_ID in customerInfo.entitlements.active;
}

export function getActiveSubscriptionTransactionId(customerInfo: CustomerInfo): string | undefined {
  const entitlement = customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT_ID];
  if (!entitlement) return undefined;
  return (
    entitlement.latestPurchaseDate ??
    entitlement.originalPurchaseDate ??
    entitlement.productIdentifier
  );
}

export function getActiveSubscriptionStoreProductId(customerInfo: CustomerInfo): string | undefined {
  const entitlement = customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT_ID];
  return entitlement?.productIdentifier;
}

async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  const Purchases = await getPurchasesModule();
  const offerings = await Purchases.getOfferings();
  return offerings.current ?? offerings.all.default ?? null;
}

export type RevenueCatStorePricing = {
  monthly: {
    priceString: string;
    subline: string;
  } | null;
  yearly: {
    priceString: string;
    subline: string;
    savingsLabel: string | null;
  } | null;
  storeReady: boolean;
};

function formatSavingsLabel(monthlyPrice: number, yearlyPrice: number, currencyCode: string): string | null {
  if (monthlyPrice <= 0 || yearlyPrice <= 0) return null;
  const fullYearMonthly = monthlyPrice * 12;
  const savings = fullYearMonthly - yearlyPrice;
  if (savings <= 0) return null;
  const pct = Math.round((savings / fullYearMonthly) * 100);
  try {
    const formatted = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(savings);
    return `Save ${pct}% · ${formatted}/year`;
  } catch {
    return `Save ${pct}%`;
  }
}

/** Live prices from the current RevenueCat offering (Play / App Store). */
export async function fetchRevenueCatStorePricing(): Promise<RevenueCatStorePricing> {
  const empty: RevenueCatStorePricing = {
    monthly: null,
    yearly: null,
    storeReady: false,
  };

  if (!(await configureRevenueCat())) return empty;

  try {
    const offering = await getCurrentOffering();
    if (!offering) return empty;

    const monthlyPkg = findPackage(offering, RASOI_PLUS_MONTHLY_PRODUCT_ID);
    const yearlyPkg = findPackage(offering, RASOI_PLUS_YEARLY_PRODUCT_ID);

    const monthlyPrice = monthlyPkg?.product.price ?? 0;
    const yearlyPrice = yearlyPkg?.product.price ?? 0;
    const currencyCode = yearlyPkg?.product.currencyCode ?? monthlyPkg?.product.currencyCode ?? 'INR';

    return {
      monthly: monthlyPkg
        ? {
            priceString: monthlyPkg.product.priceString,
            subline: `${monthlyPkg.product.priceString} · Cancel anytime`,
          }
        : null,
      yearly: yearlyPkg
        ? {
            priceString: yearlyPkg.product.priceString,
            subline: yearlyPkg.product.pricePerMonthString
              ? `${yearlyPkg.product.pricePerMonthString}/mo billed yearly`
              : `${yearlyPkg.product.priceString} per year`,
            savingsLabel: formatSavingsLabel(monthlyPrice, yearlyPrice, currencyCode),
          }
        : null,
      storeReady: Boolean(monthlyPkg || yearlyPkg),
    };
  } catch (error) {
    console.warn('[RevenueCat] fetchRevenueCatStorePricing failed', error);
    return empty;
  }
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
  googlePlayOfferTag?: string | null,
): Promise<{
  customerInfo: CustomerInfo;
  transactionId?: string;
  storeProductId?: string;
}> {
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

  if (googlePlayOfferTag && Platform.OS === 'android') {
    const subscriptionOptions = pkg.product.subscriptionOptions ?? [];
    const promoOption = subscriptionOptions.find((option) =>
      option.tags.includes(googlePlayOfferTag),
    );
    if (promoOption) {
      const { customerInfo } = await Purchases.purchaseSubscriptionOption(promoOption);
      if (!hasRasoiPlusEntitlement(customerInfo)) {
        throw new Error('Purchase completed but Rasoi Plus entitlement is not active.');
      }
      return {
        customerInfo,
        transactionId: getActiveSubscriptionTransactionId(customerInfo),
        storeProductId: getActiveSubscriptionStoreProductId(customerInfo),
      };
    }
  }

  const { customerInfo } = await Purchases.purchasePackage(pkg);

  if (!hasRasoiPlusEntitlement(customerInfo)) {
    throw new Error('Purchase completed but Rasoi Plus entitlement is not active.');
  }

  return {
    customerInfo,
    transactionId: getActiveSubscriptionTransactionId(customerInfo),
    storeProductId: getActiveSubscriptionStoreProductId(customerInfo),
  };
}

export async function restoreRevenueCatPurchases(): Promise<{
  customerInfo: CustomerInfo;
  transactionId?: string;
  storeProductId?: string;
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
    storeProductId: getActiveSubscriptionStoreProductId(customerInfo),
  };
}

