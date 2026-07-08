import { Platform } from 'react-native';

export type PaymentProviderId = 'stub' | 'revenuecat' | 'razorpay';

export type RasoiPlusCatalogProductId = 'rasoi_plus_monthly' | 'rasoi_plus_yearly';

/** Product ids — map in RevenueCat / Play / App Store. */
export const RASOI_PLUS_MONTHLY_PRODUCT_ID = 'rasoi_plus_monthly';
export const RASOI_PLUS_YEARLY_PRODUCT_ID = 'rasoi_plus_yearly';
/** Google Play Billing Library v5+ includes base plan id. */
export const RASOI_PLUS_MONTHLY_PLAY_PRODUCT_ID = 'rasoi_plus_monthly:monthly';
export const RASOI_PLUS_YEARLY_PLAY_PRODUCT_ID = 'rasoi_plus_yearly:yearly';

const RASOI_PLUS_STORE_PRODUCT_IDS = new Set([
  RASOI_PLUS_MONTHLY_PRODUCT_ID,
  RASOI_PLUS_YEARLY_PRODUCT_ID,
  RASOI_PLUS_MONTHLY_PLAY_PRODUCT_ID,
  RASOI_PLUS_YEARLY_PLAY_PRODUCT_ID,
]);

/** Normalize Play/App Store product id to Rasoi catalog id. */
export function normalizeRasoiPlusProductId(
  storeProductId: string,
): RasoiPlusCatalogProductId | null {
  if (
    storeProductId === RASOI_PLUS_MONTHLY_PRODUCT_ID ||
    storeProductId === RASOI_PLUS_MONTHLY_PLAY_PRODUCT_ID
  ) {
    return RASOI_PLUS_MONTHLY_PRODUCT_ID;
  }
  if (
    storeProductId === RASOI_PLUS_YEARLY_PRODUCT_ID ||
    storeProductId === RASOI_PLUS_YEARLY_PLAY_PRODUCT_ID
  ) {
    return RASOI_PLUS_YEARLY_PRODUCT_ID;
  }
  return null;
}

export function isRasoiPlusStoreProductId(storeProductId: string): boolean {
  return RASOI_PLUS_STORE_PRODUCT_IDS.has(storeProductId);
}

/** @deprecated Use RASOI_PLUS_MONTHLY_PRODUCT_ID */
export const RASOI_PLUS_PRODUCT_ID = RASOI_PLUS_MONTHLY_PRODUCT_ID;

const configured = process.env.EXPO_PUBLIC_PAYMENT_PROVIDER?.trim().toLowerCase();

export function getConfiguredPaymentProviderId(): PaymentProviderId {
  if (configured === 'revenuecat' || configured === 'razorpay') {
    return configured;
  }
  return 'stub';
}

/** Actual provider at runtime (RevenueCat falls back to stub when API keys are missing). */
export function getEffectivePaymentProviderId(): PaymentProviderId {
  const id = getConfiguredPaymentProviderId();
  if (id !== 'revenuecat') return id;

  const platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';
  if (platform === 'web') return 'stub';
  return getRevenueCatApiKey(platform).length > 0 ? 'revenuecat' : 'stub';
}

export const PAYMENT_PROVIDER_LABELS: Record<PaymentProviderId, string> = {
  stub: 'Preview mode',
  revenuecat: 'App Store / Google Play',
  razorpay: 'UPI & cards',
};

export const PAYMENT_DISCLAIMERS: Record<PaymentProviderId, string> = {
  stub:
    'Billing is not connected yet. Subscribe updates your Rasoi Plus plan for testing. Choose App Store, Play, or UPI billing when you go live.',
  revenuecat:
    'Recurring subscription billed through Google Play or the App Store. Renews automatically until you cancel in your store subscription settings.',
  razorpay:
    'Recurring Rasoi Plus subscription. You authorise automatic renewal each billing period until you cancel in the app or by emailing us.',
};

export const RECURRING_PAYMENT_NOTICE =
  'You are starting a recurring subscription. It renews automatically each month or year until cancelled.';

/** RevenueCat public SDK keys — from Project → Apps → API keys. */
export const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY?.trim() ?? '';
export const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY?.trim() ?? '';
/** Test Store key for local dev / sandbox purchases before Play Store goes live. */
export const REVENUECAT_API_KEY_TEST = process.env.EXPO_PUBLIC_REVENUECAT_TEST_KEY?.trim() ?? '';
export const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID?.trim() ?? '';

export function getRevenueCatApiKey(platform: 'ios' | 'android' | 'web'): string {
  if (platform === 'web') return '';
  if (__DEV__ && REVENUECAT_API_KEY_TEST) return REVENUECAT_API_KEY_TEST;
  return platform === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
}

export type PaywallCompareCell = boolean | 'limited';

export const PAYWALL_COMPARE_ROWS: ReadonlyArray<{
  label: string;
  free: PaywallCompareCell;
  trial: PaywallCompareCell;
  paid: PaywallCompareCell;
}> = [
  { label: 'Recipes & pantry', free: true, trial: true, paid: true },
  { label: 'AdMob ads', free: true, trial: true, paid: false },
  { label: 'Partner grocery & delivery checkout', free: 'limited', trial: true, paid: true },
];
