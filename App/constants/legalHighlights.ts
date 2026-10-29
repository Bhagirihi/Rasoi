/** Must match rasoi_backend/src/lib/legal-version.ts */
export const CURRENT_TERMS_VERSION = '2025-06-21';

/** Key points shown in the Terms & Privacy acceptance modal (full text on rasoiapplication.in). */
export const TERMS_HIGHLIGHTS = [
  'Recipe discovery, pantry matching, and saved favourites for home cooking.',
  'You are responsible for activity on your account and keeping your sign-in secure.',
  'Rasoi Plus and partner checkout (Blinkit, Zepto, etc.) follow third-party billing and fulfilment.',
  'App content and branding are protected — no scraping or redistribution.',
  'Recipes are guidance only; always check allergens and use safe food handling.',
] as const;

export const PRIVACY_HIGHLIGHTS = [
  'We collect name, email, optional phone, diet and kitchen style preferences, saved recipes, and pantry items.',
  'We use Firebase Analytics/Crashlytics, Sentry diagnostics, and AdMob ads on free/trial plans.',
  'Optional location (city) helps local relevance; partner checkout may log affiliate/sponsor events.',
  'Rasoi Plus purchases are processed by Google Play via RevenueCat — we do not store card details.',
  'We do not sell your personal data. You can export or delete your account in Settings.',
] as const;

export const LEGAL_URLS = {
  terms: 'https://rasoiapplication.in/terms',
  privacy: 'https://rasoiapplication.in/privacy',
  deleteAccount: 'https://rasoiapplication.in/delete-account',
} as const;

export const RECIPE_SAFETY_DISCLAIMER =
  'Recipes are for guidance only. Rasoi does not verify allergens or nutritional accuracy. Always check ingredients for your household — not medical or dietary advice.';

export const AFFILIATE_DISCLOSURE =
  'Opens a partner app. Rasoi may earn a fee when their affiliate program applies. Delivery times and availability vary.';

export const SUBSCRIPTION_UPSELL_DISCLOSURE =
  'Rasoi Plus unlocks partner checkout and removes ads. Free and trial plans may show ads.';
