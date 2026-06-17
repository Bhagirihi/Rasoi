const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://rasoiapplication.in';

/** Served from /public/rasoi-release.apk on Vercel (rasoiapplication.in). */
export const ANDROID_APK_URL = `${SITE_URL}/rasoi-release.apk`;

export const APP_DOWNLOAD_PATH = '/download';

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
