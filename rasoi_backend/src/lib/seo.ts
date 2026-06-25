import type { Metadata } from 'next';

import {
  ANDROID_APK_URL,
  ANDROID_PACKAGE,
  APP_DEVELOPER,
  APP_NAME,
  APP_SHORT_NAME,
  PLAY_STORE_LISTING_URL,
  PLAY_STORE_SEO_PATH,
} from '@/lib/app-download';
import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-content';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://rasoiapplication.in';

export const SITE_NAME = APP_SHORT_NAME;

export const DEFAULT_TITLE =
  'Rasoi: Aaj Kya Banaye? | Indian Recipe App — Pantry Match & Regional Dishes';

export const DEFAULT_DESCRIPTION =
  'Rasoi: Aaj Kya Banaye? is a free Indian home-cooking app for Android. Match recipes to your pantry, browse 1,200+ regional dishes, and shop missing ingredients via Blinkit, Zepto, Instamart, Zomato, or Swiggy.';

export const DEFAULT_KEYWORDS = [
  'Rasoi: Aaj Kya Banaye?',
  'Rasoi Aaj Kya Banaye',
  'Rasoi app',
  'rasoiapplication.in',
  'aaj kya banaye app',
  'aaj kya banaye',
  'Indian recipe app',
  'home cooking app India',
  'pantry recipe app',
  'dinner recipe app',
  'regional Indian recipes',
  'Veg recipe app',
  'Jain recipes app',
  'Gujarati recipes app',
  'South Indian recipes app',
  'quick dinner recipes India',
  'what to cook tonight',
  'kitchen companion app',
  'Rasoi Google Play',
  'Rasoi Android app',
] as const;

/** High-intent Play Store & recipe-app search terms for the Google Play landing page. */
export const PLAY_STORE_KEYWORDS = [
  'Rasoi: Aaj Kya Banaye? Google Play',
  'Rasoi Aaj Kya Banaye Play Store',
  'Rasoi app download Google Play',
  'Indian recipe app Google Play',
  'best Indian cooking app Android',
  'aaj kya banaye app download',
  'aaj kya banaye recipe app',
  'dinner recipe app India',
  'what to cook tonight app India',
  'pantry recipe matcher app',
  'cook from pantry app',
  'home kitchen recipe app',
  'Veg recipe app India',
  'Jain recipe app Android',
  'Gujarati recipe app download',
  'South Indian recipe app',
  'Punjabi recipe app',
  'Bengali recipe app',
  'quick dinner recipes app',
  'regional Indian cuisine app',
  'Indian food recipe app free',
  'meal planner app India',
  'grocery recipe app Blinkit Zepto',
  'Rasoi Karbh It Solutions',
  'com.bhagihiri.rasoiapp',
  'Food & Drink app India',
] as const;

export const TWITTER_HANDLE = '@rasoiapp';

export const FAQ_ITEMS = [
  {
    question: 'What is Rasoi: Aaj Kya Banaye?',
    answer:
      'Rasoi: Aaj Kya Banaye? is a free Indian home-cooking app on Google Play. It answers "Aaj kya banaye?" by recommending dinners from ingredients in your pantry, with 15 regional cuisines and Veg, Jain, Egg, and Non-Veg filters.',
  },
  {
    question: 'What is Rasoi app?',
    answer:
      'Rasoi is the short name for Rasoi: Aaj Kya Banaye? — an Android recipe app that helps Indian home cooks decide dinner from what is already in the kitchen.',
  },
  {
    question: 'Is Rasoi free to download?',
    answer:
      `Yes. Rasoi: Aaj Kya Banaye? is free on Google Play at rasoiapplication.in${PLAY_STORE_SEO_PATH} or rasoiapplication.in/download. Rasoi Plus adds partner checkout (Blinkit, Zepto, Instamart, Zomato, Swiggy) with a 3-day trial.`,
  },
  {
    question: 'Which Indian cuisines does Rasoi support?',
    answer:
      'Rasoi covers North, South, East, West, and Central Indian home cooking — including Gujarati, Punjabi, South Indian, Bengali, Maharashtrian, and more regional picks.',
  },
  {
    question: 'How does pantry matching work?',
    answer:
      'Add what you have at home — dal, rice, paneer, vegetables, masalas — and Rasoi shows recipes with a match percentage so you cook from your kitchen instead of guessing.',
  },
  {
    question: 'Can I order missing ingredients from Rasoi?',
    answer:
      'With Rasoi Plus, tap missing items on a recipe to open Blinkit, Zepto, or Instamart. You can also jump to Zomato or Swiggy when you prefer delivery.',
  },
] as const;

export function absoluteUrl(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function buildPageMetadata(options: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const title = options.title ?? DEFAULT_TITLE;
  const description = options.description ?? DEFAULT_DESCRIPTION;
  const canonical = absoluteUrl(options.path ?? '/');

  return {
    title,
    description,
    applicationName: APP_NAME,
    keywords: [...DEFAULT_KEYWORDS, ...(options.keywords ?? [])],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      types: {
        'application/vnd.android.package-archive': ANDROID_APK_URL,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.png', type: 'image/png' },
        { url: '/rasoi-logo.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: [{ url: '/apple-icon.png', type: 'image/png' }],
      shortcut: '/favicon.png',
    },
    manifest: '/site.webmanifest',
    robots: options.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: canonical,
      siteName: APP_NAME,
      title,
      description,
      images: [
        {
          url: absoluteUrl('/download-hero.png'),
          width: 1200,
          height: 630,
          alt: `${APP_NAME} — Indian home cooking app on Google Play`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title,
      description,
      images: [absoluteUrl('/download-hero.png')],
    },
    other: {
      'google-play-app': `app-id=${ANDROID_PACKAGE}`,
    },
    category: 'food',
  };
}

export const rootMetadata = buildPageMetadata({});

export const homeMetadata = buildPageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: '/',
});

export const downloadMetadata = buildPageMetadata({
  title: 'Download Rasoi: Aaj Kya Banaye? on Google Play | Android Recipe App',
  description:
    'Download Rasoi: Aaj Kya Banaye? free on Google Play for Android. Indian recipe app with pantry match, 1,200+ regional dishes, meal reminders, and partner checkout.',
  path: '/download',
  keywords: [
    'download Rasoi Aaj Kya Banaye',
    'Rasoi Google Play',
    'Rasoi Android download',
    'Indian recipe app Android',
  ],
});

export const playStoreMetadata = buildPageMetadata({
  title:
    'Rasoi: Aaj Kya Banaye? — Apps on Google Play | Indian Recipe App for Android',
  description:
    'Get Rasoi: Aaj Kya Banaye? on Google Play — the free Indian home-cooking app that answers "Aaj kya banaye?". 1,200+ regional recipes, pantry match %, Veg & Jain filters, Blinkit/Zepto/Instamart checkout, and Zomato/Swiggy delivery links.',
  path: PLAY_STORE_SEO_PATH,
  keywords: [...PLAY_STORE_KEYWORDS],
});

export const PLAY_STORE_FAQ_ITEMS = [
  {
    question: 'Where can I download Rasoi: Aaj Kya Banaye? on Google Play?',
    answer:
      'Open Rasoi on Google Play at play.google.com/store/apps/details?id=com.bhagihiri.rasoiapp or use our official link at rasoiapplication.in/google-play/rasoi-aaj-kya-banaye-indian-recipe-app-android.',
  },
  {
    question: 'Is Rasoi: Aaj Kya Banaye? free on the Play Store?',
    answer:
      'Yes. Rasoi is free to install on Android. Rasoi Plus (₹49/month or ₹499/year) adds ad-free browsing and partner grocery or delivery checkout.',
  },
  {
    question: 'What does Rasoi: Aaj Kya Banaye? do?',
    answer:
      'Rasoi helps Indian home cooks decide dinner from ingredients already in the kitchen — with smart meal picks, pantry matching, 15 regional cuisines, and filters for Veg, Jain, Egg, and Non-Veg.',
  },
] as const;

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_DEVELOPER,
    alternateName: [APP_NAME, APP_SHORT_NAME],
    url: SITE_URL,
    logo: absoluteUrl('/rasoi-logo.png'),
    description: DEFAULT_DESCRIPTION,
    email: LEGAL_CONTACT_EMAIL,
    areaServed: { '@type': 'Country', name: 'India' },
    sameAs: [PLAY_STORE_LISTING_URL, absoluteUrl(PLAY_STORE_SEO_PATH)],
  };
}

export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: APP_NAME,
    alternateName: [APP_SHORT_NAME, 'rasoiapplication.in'],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: ['en-IN', 'hi-IN'],
    publisher: {
      '@type': 'Organization',
      name: APP_DEVELOPER,
    },
  };
}

export function mobileAppJsonLd(pageUrl: string = SITE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: APP_NAME,
    alternateName: [APP_SHORT_NAME, 'Rasoi app', 'Rasoi Aaj Kya Banaye'],
    operatingSystem: 'Android',
    applicationCategory: 'FoodApplication',
    applicationSubCategory: 'RecipeApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description: DEFAULT_DESCRIPTION,
    downloadUrl: PLAY_STORE_LISTING_URL,
    installUrl: PLAY_STORE_LISTING_URL,
    screenshot: absoluteUrl('/download-hero.png'),
    image: absoluteUrl('/download-hero.png'),
    sameAs: [PLAY_STORE_LISTING_URL, absoluteUrl(PLAY_STORE_SEO_PATH), ANDROID_APK_URL],
    url: pageUrl,
    author: {
      '@type': 'Organization',
      name: APP_DEVELOPER,
    },
    publisher: {
      '@type': 'Organization',
      name: APP_DEVELOPER,
    },
    countriesSupported: 'IN',
    inLanguage: ['en-IN', 'hi-IN'],
    featureList: [
      'Aaj kya banaye — tonight\'s meal picks',
      'Pantry-to-recipe matching',
      '1,200+ recipes across 15 regional Indian cuisines',
      'Veg, Jain, Egg, Non-Veg filters',
      'Partner grocery checkout via Blinkit, Zepto, Instamart',
      'Food delivery via Zomato and Swiggy',
      'Daily meal reminders',
    ],
  };
}

export function faqJsonLd(
  items: ReadonlyArray<{ question: string; answer: string }> = FAQ_ITEMS,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function playStoreBreadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Rasoi',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Google Play',
        item: absoluteUrl(PLAY_STORE_SEO_PATH),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: APP_NAME,
        item: PLAY_STORE_LISTING_URL,
      },
    ],
  };
}
