export type PaymentProviderId = 'stub' | 'revenuecat' | 'razorpay';

/** Product ids — map in RevenueCat / Play / App Store later. */
export const RASOI_PLUS_MONTHLY_PRODUCT_ID = 'rasoi_plus_monthly';
export const RASOI_PLUS_YEARLY_PRODUCT_ID = 'rasoi_plus_yearly';

/** @deprecated Use RASOI_PLUS_MONTHLY_PRODUCT_ID */
export const RASOI_PLUS_PRODUCT_ID = RASOI_PLUS_MONTHLY_PRODUCT_ID;

const configured = process.env.EXPO_PUBLIC_PAYMENT_PROVIDER?.trim().toLowerCase();

export function getConfiguredPaymentProviderId(): PaymentProviderId {
  if (configured === 'revenuecat' || configured === 'razorpay') {
    return configured;
  }
  return 'stub';
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

export const PAYWALL_COMPARE_ROWS = [
  { label: 'Recipes & pantry', free: true, trial: true, paid: true },
  { label: 'AdMob ads', free: true, trial: true, paid: false },
  { label: 'Blinkit · Zepto · Instamart', free: false, trial: true, paid: true },
  { label: 'Zomato · Swiggy delivery', free: false, trial: true, paid: true },
] as const;
