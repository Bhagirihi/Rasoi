import {
  ADMOB_ANDROID_APP_ID as ANDROID_APP_ID,
  ADMOB_IOS_APP_ID as IOS_APP_ID,
} from './admobAppIds.js';

/** AdMob IDs — owned by my.website.email2@gmail.com (pub-4173581536398147). */
export const ADMOB_GOOGLE_ACCOUNT = 'my.website.email2@gmail.com';

export const ADMOB_ANDROID_APP_ID = ANDROID_APP_ID;

/** iOS app not registered in AdMob yet — keep Google test ID until you add Rasoi iOS in console. */
export const ADMOB_IOS_APP_ID = IOS_APP_ID;

/** Google sample banner units — used in __DEV__ only. */
export const ADMOB_TEST_BANNER_ANDROID = 'ca-app-pub-3940256099942544/6300978111';
export const ADMOB_TEST_BANNER_IOS = 'ca-app-pub-3940256099942544/2934735716';

/** Production banner units — one per sponsor placement screen. */
export const ADMOB_BANNER_UNITS = {
  home: 'ca-app-pub-4173581536398147/7428111605',
  recipes: 'ca-app-pub-4173581536398147/6597369959',
  pantry: 'ca-app-pub-4173581536398147/8565057748',
  saved: 'ca-app-pub-4173581536398147/3971206617',
  recipe: 'ca-app-pub-4173581536398147/2658124940',
} as const;

export type AdMobBannerPlacement = keyof typeof ADMOB_BANNER_UNITS;

const PLACEMENT_ALIASES: Record<string, AdMobBannerPlacement> = {
  settings: 'home',
  paywall: 'home',
  plan: 'home',
  /** Low-traffic screens share the home unit for better fill on small DAU. */
  recipe: 'home',
  recipes: 'home',
  pantry: 'home',
  saved: 'home',
};

export function getAdMobBannerUnitId(
  platform: 'ios' | 'android' | 'web' | 'windows' | 'macos',
  placement?: string,
): string {
  if (__DEV__) {
    return platform === 'ios' ? ADMOB_TEST_BANNER_IOS : ADMOB_TEST_BANNER_ANDROID;
  }

  if (platform === 'ios') {
    return ADMOB_TEST_BANNER_IOS;
  }

  const key = placement ? PLACEMENT_ALIASES[placement] ?? placement : 'home';
  const unit = ADMOB_BANNER_UNITS[key as AdMobBannerPlacement];
  return unit ?? ADMOB_BANNER_UNITS.home;
}

export function isAdMobUsingTestBannerUnits(): boolean {
  return __DEV__;
}
