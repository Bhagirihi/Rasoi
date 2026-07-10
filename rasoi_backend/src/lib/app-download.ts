const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://rasoiapplication.in';

/** Matches Google Play listing title — use in SEO titles and JSON-LD. */
export const APP_NAME = 'Rasoi - Indian Recipe App';

export const APP_SHORT_NAME = 'Rasoi';

/** Marketing-safe recipe library size — keep in sync with Play Store manifest. */
export const RECIPE_LIBRARY_LABEL = '5,000+' as const;

export const APP_DEVELOPER = 'Karbh It Solutions';

export const ANDROID_PACKAGE = 'com.bhagihiri.rasoiapp';

/** Google Play open testing — anyone can opt in and install from Play Store. */
export const PLAY_STORE_OPEN_TESTING_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_TESTING_URL?.trim() ||
  'https://play.google.com/apps/testing/com.bhagihiri.rasoiapp';

/** Public Play Store listing (works after joining open testing). */
export const PLAY_STORE_LISTING_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim() ||
  `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

/**
 * Direct APK sideload. Resolves to Expo EAS artifact when ANDROID_APK_EXPO_URL is set on Vercel,
 * otherwise falls back to the APK in /public on this site.
 */
export const ANDROID_APK_URL = `${SITE_URL}/api/download/apk`;

export const APP_DOWNLOAD_PATH = '/download';

/** Canonical indexable URL for Google Play SEO landing page. */
export const PLAY_STORE_SEO_PATH = '/play-store';

/** Legacy keyword-rich path — 301 redirects to PLAY_STORE_SEO_PATH. */
export const PLAY_STORE_LEGACY_SEO_PATH =
  '/google-play/rasoi-aaj-kya-banaye-indian-recipe-app-android';

/** Short redirect — 302 to Play Store listing (share in campaigns). */
export const PLAY_STORE_REDIRECT_PATH = '/play-store';

/** API redirect — same as PLAY_STORE_REDIRECT_PATH for smoke tests and deep links. */
export const PLAY_STORE_REDIRECT_API_PATH = '/api/play-store';

export const APP_FEATURES = [
  {
    title: 'Regional recipes',
    body: 'Browse North, South, East, West, and Central Indian dishes with Veg, Jain, Egg, and Non-Veg filters.',
  },
  {
    title: 'Smart pantry',
    body: 'See what you can cook tonight with ingredients already in your kitchen — or what you need to buy.',
  },
  {
    title: 'Saved favourites',
    body: 'Bookmark dishes for weeknight rotation, festive menus, and family go-tos.',
  },
  {
    title: 'Quick filters',
    body: 'Under 20 minutes, kid-friendly, leftover-friendly, and festive tags for faster decisions.',
  },
  {
    title: 'Partner checkout',
    body: 'Order missing ingredients from Blinkit, Zepto, Instamart, Zomato, or Swiggy in one tap with Rasoi Plus.',
  },
  {
    title: 'Personalised for you',
    body: 'Phone login, diet and cuisine preferences, meal reminders, and a 3-day Rasoi Plus trial.',
  },
] as const;
