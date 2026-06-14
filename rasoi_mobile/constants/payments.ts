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
    'Subscription billed through Apple or Google. Cancel anytime in your store settings.',
  razorpay: 'Pay securely with UPI, cards, or net banking. Managed by Razorpay.',
};

/** Placeholder store keys — set when you pick a provider. */
export const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY?.trim() ?? '';
export const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY?.trim() ?? '';
export const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID?.trim() ?? '';

export const PAYWALL_COMPARE_ROWS = [
  { label: 'Recipes & pantry', free: true, trial: true, paid: true },
  { label: 'AdMob ads', free: true, trial: true, paid: false },
  { label: 'Blinkit · Zepto · Instamart', free: false, trial: true, paid: true },
  { label: 'Zomato · Swiggy delivery', free: false, trial: true, paid: true },
] as const;
