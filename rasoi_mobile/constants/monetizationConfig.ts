/** Set EXPO_PUBLIC_MONETIZATION_LIVE=1 when AdMob + real billing are wired for store launch. */
export const MONETIZATION_LIVE =
  process.env.EXPO_PUBLIC_MONETIZATION_LIVE === '1' ||
  process.env.EXPO_PUBLIC_MONETIZATION_LIVE === 'true';

export const MONETIZATION_BETA_NOTE =
  'Early access — partner links unlocked, ads and subscriptions coming with Play Store launch.';
