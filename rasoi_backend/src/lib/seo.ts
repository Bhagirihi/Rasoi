import type { Metadata } from 'next';

import {
  ANDROID_PACKAGE,
  APP_DEVELOPER,
  APP_NAME,
  APP_SHORT_NAME,
  PLAY_STORE_LISTING_URL,
  PLAY_STORE_SEO_PATH,
  RECIPE_LIBRARY_LABEL,
} from '@/lib/app-download';
import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-content';
import { TRIAL_DURATION_DAYS } from '@/lib/plan-pricing';
import {
  getAllMarkets,
  getMarketConfig,
  type MarketConfig,
  type MarketId,
} from '@/lib/markets';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://rasoiapplication.in';

export const SITE_NAME = APP_SHORT_NAME;

export { RECIPE_LIBRARY_LABEL } from '@/lib/app-download';

export const DEFAULT_TITLE =
  `${APP_NAME} | Indian Recipe App — Pantry Match & Regional Dishes`;

export const DEFAULT_DESCRIPTION =
  `${APP_NAME} is a free Indian home-cooking app for Android. Match recipes to your pantry, browse ${RECIPE_LIBRARY_LABEL} regional dishes, and shop missing ingredients via Blinkit, Zepto, Instamart, Zomato, or Swiggy.`;

export const DEFAULT_KEYWORDS = [
  APP_NAME,
  'Rasoi App Aaj Kya Banaye',
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
  'cook from pantry app',
  'meal reminder app',
  'jamvanu recipe app',
  'kitchen companion app',
  'Rasoi Google Play',
  'Rasoi Android app',
] as const;

/** High-intent Play Store & recipe-app search terms for the Google Play landing page. */
export const PLAY_STORE_KEYWORDS = [
  `${APP_NAME} Google Play`,
  'Rasoi App Aaj Kya Banaye Play Store',
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
  'Gujarati recipe app Gujarat',
  'Marathi recipe app',
  'Tamil recipe app',
  'Telugu recipe app',
  'Bengali recipe app',
  'ગુજરાતી રસોઈ એપ',
  'मराठी पाककृती अॅप',
  'தமிழ் சமையல் ஆப்',
  'తెలుగు వంటకాల యాప్',
  'বাংলা রেসিপি অ্যাপ',
] as const;

export const PLAY_STORE_TAGS = [
  'Recipes',
  'Cooking',
  'Food & drink',
  'Meal planning',
  'Lifestyle',
  'Health & fitness',
] as const;

export const PLAY_STORE_HIGHLIGHTS = [
  'Aaj kya banaye? — smart dinner picks from your pantry',
  `${RECIPE_LIBRARY_LABEL} Indian recipes across 15 regional cuisines`,
  'Veg, Jain, Egg & Non-Veg filters for every home',
  'Pantry match % — cook with what you already have',
  'Play Store listings in Hindi, Marathi, Tamil & Telugu (Gujarati & Bengali copy ready)',
  'Blinkit, Zepto & Instamart for missing groceries',
  'Zomato & Swiggy when you want delivery instead',
  'Free to install · Rasoi Plus from ₹49/month',
] as const;

export const PLAY_STORE_LOCALE_BLURBS = [
  {
    lang: 'gu-IN',
    label: 'Gujarati · ગુજરાતી',
    headline: 'આજે શું બનાવું?',
    body: 'કાઠિયાવાડી, સૂરતી અને ગુજરાતી થાળી — તમારી રસોઈમાંથી રોજિંદા રસોઈ સૂચનો.',
  },
  {
    lang: 'mr-IN',
    label: 'Marathi · मराठी',
    headline: 'आज काय बनवायचे?',
    body: 'महाराष्ट्रीयन, कोकणी आणि घरगुती पाककृती — पॅन्ट्रीमधून जेवणाचे आयडिया.',
  },
  {
    lang: 'ta-IN',
    label: 'Tamil · தமிழ்',
    headline: 'இன்று என்ன சமைக்கலாம்?',
    body: 'தென்னிந்திய சமையல், சைவ & நாவேரி வடிப்புகள் — உங்கள் சமையலறையிலிருந்து.',
  },
  {
    lang: 'te-IN',
    label: 'Telugu · తెలుగు',
    headline: 'ఈరోజు ఏం వండాలి?',
    body: 'ఆంధ్ర & తెలంగాణ వంటకాలు — మీ పాంట్రీ నుంచి రోజువారీ భోజన సూచనలు.',
  },
  {
    lang: 'bn-IN',
    label: 'Bengali · বাংলা',
    headline: 'আজ কী রান্না করব?',
    body: 'বাঙালি ঘরোয়া রেসিপি — প্যান্ট্রি মিলিয়ে দৈনিক রান্নার ধারণা.',
  },
  {
    lang: 'hi-IN',
    label: 'Hindi · हिन्दी',
    headline: 'आज क्या बनाएं?',
    body: 'उत्तर भारतीय, जैन सेफ और रोज़मर्रा की रेसिपी — रसोई से मैच % के साथ.',
  },
] as const;

/** hreflang for Play Store landing — Indian regional languages + English. */
export function playStoreHreflangLanguages(): Record<string, string> {
  const base = absoluteUrl(PLAY_STORE_SEO_PATH);
  return {
    'en-IN': base,
    'hi-IN': base,
    'gu-IN': base,
    'mr-IN': base,
    'ta-IN': base,
    'te-IN': base,
    'bn-IN': base,
    'x-default': base,
  };
}

export const TWITTER_HANDLE = '@rasoiapp';

/** Use on all /admin routes — defense in depth alongside robots.txt disallow. */
export const ADMIN_NOINDEX_METADATA: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

/** hreflang for recipe blogs — same diaspora-inclusive content, regional English variants. */
export function recipeBlogHreflangLanguages(path: string): Record<string, string> {
  const url = absoluteUrl(path);
  return {
    'en-IN': url,
    'en-US': url,
    'en-CA': url,
    'en-AU': url,
    'en-NZ': url,
    'x-default': url,
  };
}

export const FAQ_ITEMS = [
  {
    question: `What is ${APP_NAME}?`,
    answer:
      `${APP_NAME} is a free Indian home-cooking app on Google Play. It answers "Aaj kya banaye?" by recommending dinners from ingredients in your pantry, with ${RECIPE_LIBRARY_LABEL} recipes, 15 regional cuisines, and Veg, Jain, Egg, and Non-Veg filters.`,
  },
  {
    question: 'What is Rasoi app?',
    answer:
      `Rasoi is the short name for ${APP_NAME} — an Android recipe app that helps Indian home cooks decide dinner from what is already in the kitchen.`,
  },
  {
    question: 'Is Rasoi free to download?',
    answer:
      `Yes. ${APP_NAME} is free on Google Play at rasoiapplication.in${PLAY_STORE_SEO_PATH} or rasoiapplication.in/download. Rasoi Plus adds partner checkout (Blinkit, Zepto, Instamart, Zomato, Swiggy) with a ${TRIAL_DURATION_DAYS}-day trial.`,
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
      ...(options.path === PLAY_STORE_SEO_PATH
        ? { languages: playStoreHreflangLanguages() }
        : {}),
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

export const downloadMetadata: Metadata = {
  ...buildPageMetadata({
    title: `Download ${APP_NAME} on Google Play | Android Recipe App`,
    description:
      `Download ${APP_NAME} free on Google Play for Android. Indian recipe app with pantry match, ${RECIPE_LIBRARY_LABEL} regional dishes, meal reminders, and partner checkout — available in India, USA, Canada & Australia.`,
    path: '/download',
    keywords: [
      'download Rasoi Aaj Kya Banaye',
      'Rasoi Google Play',
      'Rasoi Android download',
      'Indian recipe app Android',
      'Indian recipe app USA',
      'Indian recipe app Canada',
      'Indian recipe app Australia',
    ],
  }),
  alternates: {
    canonical: absoluteUrl('/download'),
    languages: marketHreflangLanguages(),
  },
};

export const PLAY_STORE_PAGE_DESCRIPTION =
  `Install ${APP_NAME} from Google Play — free Indian home-cooking app by Karbh It Solutions. ${RECIPE_LIBRARY_LABEL} Gujarati, Marathi, Tamil, Telugu & Bengali recipes, pantry match %, Veg & Jain filters, meal planning & Blinkit/Zepto checkout.`;

export const playStoreMetadata: Metadata = {
  ...buildPageMetadata({
    title:
      'Rasoi - Indian Recipe App — Apps on Google Play | Aaj Kya Banaye for Android',
    description: PLAY_STORE_PAGE_DESCRIPTION,
    path: PLAY_STORE_SEO_PATH,
    keywords: [...PLAY_STORE_KEYWORDS],
  }),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    alternateLocale: ['hi_IN', 'gu_IN', 'mr_IN', 'ta_IN', 'te_IN', 'bn_IN'],
    url: absoluteUrl(PLAY_STORE_SEO_PATH),
    siteName: APP_NAME,
    title: `${APP_NAME} — Apps on Google Play`,
    description:
      'Install Rasoi from Google Play — Indian recipe app with pantry match, regional cuisines & meal planning.',
    images: [
      {
        url: absoluteUrl('/download-hero.png'),
        width: 1200,
        height: 630,
        alt: `${APP_NAME} on Google Play — install for Android`,
      },
    ],
  },
};

export const PLAY_STORE_FAQ_ITEMS = [
  {
    question: `Where can I download ${APP_NAME} on Google Play?`,
    answer:
      `Install Rasoi from Google Play at play.google.com/store/apps/details?id=com.bhagihiri.rasoiapp or visit rasoiapplication.in${PLAY_STORE_SEO_PATH} for the official listing page.`,
  },
  {
    question: 'Who publishes Rasoi on Google Play?',
    answer:
      `${APP_NAME} is published on Google Play by Karbh It Solutions (package com.bhagihiri.rasoiapp).`,
  },
  {
    question: `Is ${APP_NAME} free on the Play Store?`,
    answer:
      'Yes. Rasoi is free to install on Android via Google Play. Rasoi Plus (₹49/month or ₹499/year) adds ad-free browsing and partner grocery or delivery checkout.',
  },
  {
    question: `What does ${APP_NAME} do?`,
    answer:
      `Rasoi helps Indian home cooks decide dinner from ingredients already in the kitchen — with smart meal picks, pantry matching, ${RECIPE_LIBRARY_LABEL} recipes, 15 regional cuisines, and filters for Veg, Jain, Egg, and Non-Veg.`,
  },
  {
    question: 'Does Rasoi have Gujarati, Marathi, Tamil, Telugu, or Bengali recipes?',
    answer:
      'Yes. Rasoi includes regional Indian cuisines. Play Store listings are live in Hindi, Marathi, Tamil, and Telugu; enable Gujarati and Bengali under Main store listing → Manage translations, then re-push listings.',
  },
  {
    question: 'Should I install from Google Play or download an APK?',
    answer:
      'Install from Google Play for automatic updates, secure signing, and in-app subscriptions. Rasoi no longer promotes APK sideloading as the primary install path — use the official Play Store listing.',
  },
  {
    question: 'What Play Store category and tags does Rasoi use?',
    answer:
      'Rasoi is in Food & Drink on Google Play with tags: Recipes, Cooking, Food & drink, Meal planning, Lifestyle, and Health & fitness.',
  },
] as const;

export function playStoreWebPageJsonLd(pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${APP_NAME} — Apps on Google Play`,
    description: PLAY_STORE_PAGE_DESCRIPTION,
    url: pageUrl,
    inLanguage: ['en-IN', 'hi-IN', 'gu-IN', 'mr-IN', 'ta-IN', 'te-IN', 'bn-IN'],
    isPartOf: {
      '@type': 'WebSite',
      name: APP_NAME,
      url: SITE_URL,
    },
    about: {
      '@type': 'MobileApplication',
      name: APP_NAME,
      operatingSystem: 'Android',
      applicationCategory: 'FoodApplication',
      downloadUrl: PLAY_STORE_LISTING_URL,
      installUrl: PLAY_STORE_LISTING_URL,
      author: { '@type': 'Organization', name: APP_DEVELOPER },
    },
    primaryImageOfPage: absoluteUrl('/download-hero.png'),
  };
}

export function softwareApplicationJsonLd(pageUrl: string = PLAY_STORE_LISTING_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP_NAME,
    alternateName: [
      APP_SHORT_NAME,
      'Rasoi app',
      'Indian recipe app',
      'Rasoi App Aaj Kya Banaye',
      'Rasoi Aaj Kya Banaye',
    ],
    operatingSystem: 'Android',
    applicationCategory: 'LifestyleApplication',
    applicationSubCategory: 'RecipeApplication',
    identifier: ANDROID_PACKAGE,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    downloadUrl: PLAY_STORE_LISTING_URL,
    installUrl: PLAY_STORE_LISTING_URL,
    keywords: PLAY_STORE_TAGS.join(', '),
    description: PLAY_STORE_PAGE_DESCRIPTION,
    image: absoluteUrl('/download-hero.png'),
    screenshot: absoluteUrl('/download-hero.png'),
    sameAs: [PLAY_STORE_LISTING_URL, absoluteUrl(PLAY_STORE_SEO_PATH), SITE_URL],
    url: pageUrl,
    author: { '@type': 'Organization', name: APP_DEVELOPER },
    publisher: { '@type': 'Organization', name: APP_DEVELOPER },
    inLanguage: ['en-IN', 'hi-IN', 'gu-IN', 'mr-IN', 'ta-IN', 'te-IN', 'bn-IN'],
    featureList: [
      'Aaj kya banaye — tonight\'s meal picks',
      'Pantry-to-recipe matching',
      `${RECIPE_LIBRARY_LABEL} recipes across 15 regional Indian cuisines`,
      'Veg, Jain, Egg, Non-Veg filters',
      'Partner grocery checkout via Blinkit, Zepto, Instamart',
    ],
  };
}

export function playStoreJsonLdBundle(pageUrl: string) {
  return jsonLdGraph([
    organizationJsonLd(),
    playStoreWebPageJsonLd(pageUrl),
    softwareApplicationJsonLd(PLAY_STORE_LISTING_URL),
  ]);
}

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
    sameAs: [PLAY_STORE_LISTING_URL, absoluteUrl(PLAY_STORE_SEO_PATH), SITE_URL],
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
    inLanguage: ['en-IN', 'hi-IN', 'gu-IN', 'mr-IN', 'ta-IN', 'te-IN', 'bn-IN'],
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
    alternateName: [APP_SHORT_NAME, 'Rasoi app', 'Indian recipe app', 'Rasoi App Aaj Kya Banaye', 'Rasoi Aaj Kya Banaye'],
    operatingSystem: 'Android',
    applicationCategory: 'FoodApplication',
    applicationSubCategory: 'RecipeApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description: DEFAULT_DESCRIPTION,
    downloadUrl: PLAY_STORE_LISTING_URL,
    installUrl: PLAY_STORE_LISTING_URL,
    screenshot: absoluteUrl('/download-hero.png'),
    image: absoluteUrl('/download-hero.png'),
    sameAs: [PLAY_STORE_LISTING_URL, absoluteUrl(PLAY_STORE_SEO_PATH), SITE_URL],
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
    inLanguage: ['en-IN', 'hi-IN', 'gu-IN', 'mr-IN', 'ta-IN', 'te-IN', 'bn-IN'],
    featureList: [
      'Aaj kya banaye — tonight\'s meal picks',
      'Pantry-to-recipe matching',
      `${RECIPE_LIBRARY_LABEL} recipes across 15 regional Indian cuisines`,
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

/** hreflang alternates for all market landing pages */
export function marketHreflangLanguages(): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const market of getAllMarkets()) {
    languages[market.hreflang] = absoluteUrl(market.path);
  }
  languages['x-default'] = absoluteUrl('/');
  return languages;
}

export function jsonLdGraph(nodes: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.map((node) => {
      const { '@context': _context, ...rest } = node;
      return rest;
    }),
  };
}

function ogLocaleForHreflang(hreflang: string): string {
  const map: Record<string, string> = {
    'en-IN': 'en_IN',
    'en-US': 'en_US',
    'en-CA': 'en_CA',
    'en-AU': 'en_AU',
    'en-NZ': 'en_NZ',
  };
  return map[hreflang] ?? 'en_US';
}

export function buildMarketMetadata(market: MarketConfig): Metadata {
  const canonical = absoluteUrl(market.path);
  const ogLocale = ogLocaleForHreflang(market.hreflang);

  const keywords =
    market.id === 'IN'
      ? [...market.keywords, ...DEFAULT_KEYWORDS.slice(0, 6)]
      : [...market.keywords];

  return {
    title: market.title,
    description: market.description,
    applicationName: APP_NAME,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: marketHreflangLanguages(),
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
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      alternateLocale: getAllMarkets()
        .filter((m) => m.id !== market.id)
        .map((m) => ogLocaleForHreflang(m.hreflang)),
      url: canonical,
      siteName: APP_NAME,
      title: market.title,
      description: market.description,
      images: [
        {
          url: absoluteUrl('/download-hero.png'),
          width: 1200,
          height: 630,
          alt: `${APP_NAME} — Indian recipe app for ${market.countryName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title: market.title,
      description: market.description,
      images: [absoluteUrl('/download-hero.png')],
    },
    other: {
      'google-play-app': `app-id=${ANDROID_PACKAGE}`,
    },
    category: 'food',
  };
}

export const homeMetadata = buildMarketMetadata(getMarketConfig('IN'));

export function marketOrganizationJsonLd(market: MarketConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_DEVELOPER,
    alternateName: [APP_NAME, APP_SHORT_NAME],
    url: absoluteUrl(market.path),
    logo: absoluteUrl('/rasoi-logo.png'),
    description: market.description,
    email: LEGAL_CONTACT_EMAIL,
    areaServed: { '@type': 'Country', name: market.countryName },
    sameAs: [PLAY_STORE_LISTING_URL, absoluteUrl(PLAY_STORE_SEO_PATH)],
  };
}

export function marketWebSiteJsonLd(market: MarketConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${APP_NAME} — ${market.countryName}`,
    alternateName: [APP_SHORT_NAME, 'rasoiapplication.in', market.title],
    url: absoluteUrl(market.path),
    description: market.description,
    inLanguage: market.hreflang,
    publisher: {
      '@type': 'Organization',
      name: APP_DEVELOPER,
    },
  };
}

export function marketSoftwareJsonLd(market: MarketConfig) {
  const partnerNames = market.partners.map((p) => p.name).join(', ');
  const featureList = [
    'Aaj kya banaye — tonight\'s meal picks',
    'Pantry-to-recipe matching',
    `${RECIPE_LIBRARY_LABEL} recipes across 15 regional Indian cuisines`,
    'Veg, Jain, Egg, Non-Veg filters',
    market.partnersStatus === 'live'
      ? `Partner checkout: ${partnerNames}`
      : `Grocery partners rolling out: ${partnerNames}`,
    'Daily meal planning guides on rasoiapplication.in',
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP_NAME,
    alternateName: [APP_SHORT_NAME, `Indian home cooking ${market.countryName}`, 'Indian recipe app'],
    applicationCategory: 'LifestyleApplication',
    applicationSubCategory: 'RecipeApplication',
    operatingSystem: 'Android',
    identifier: ANDROID_PACKAGE,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: market.priceCurrency,
    },
    description: market.description,
    url: absoluteUrl(market.path),
    downloadUrl: PLAY_STORE_LISTING_URL,
    installUrl: PLAY_STORE_LISTING_URL,
    image: absoluteUrl('/download-hero.png'),
    sameAs: [PLAY_STORE_LISTING_URL, absoluteUrl(PLAY_STORE_SEO_PATH), SITE_URL],
    author: { '@type': 'Organization', name: APP_DEVELOPER },
    publisher: { '@type': 'Organization', name: APP_DEVELOPER },
    countriesSupported: market.id,
    inLanguage: market.hreflang,
    featureList,
  };
}

/** @deprecated Use marketSoftwareJsonLd — kept for Play/download pages */
export function marketMobileAppJsonLd(market: MarketConfig) {
  const partnerNames = market.partners.map((p) => p.name).join(', ');
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: APP_NAME,
    alternateName: [APP_SHORT_NAME, 'Rasoi app', `Indian recipe app ${market.countryName}`],
    operatingSystem: 'Android',
    applicationCategory: 'FoodApplication',
    applicationSubCategory: 'RecipeApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: market.priceCurrency,
    },
    description: market.description,
    downloadUrl: PLAY_STORE_LISTING_URL,
    installUrl: PLAY_STORE_LISTING_URL,
    screenshot: absoluteUrl('/download-hero.png'),
    image: absoluteUrl('/download-hero.png'),
    sameAs: [PLAY_STORE_LISTING_URL, absoluteUrl(PLAY_STORE_SEO_PATH)],
    url: absoluteUrl(market.path),
    author: { '@type': 'Organization', name: APP_DEVELOPER },
    publisher: { '@type': 'Organization', name: APP_DEVELOPER },
    countriesSupported: market.id,
    inLanguage: market.hreflang,
    featureList: [
      'Aaj kya banaye — tonight\'s meal picks',
      'Pantry-to-recipe matching',
      `${RECIPE_LIBRARY_LABEL} recipes across 15 regional Indian cuisines`,
      'Veg, Jain, Egg, Non-Veg filters',
      `Partner checkout: ${partnerNames}`,
      'Daily meal reminders',
    ],
  };
}

export function marketWebPageJsonLd(market: MarketConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: market.title,
    description: market.description,
    url: absoluteUrl(market.path),
    inLanguage: market.hreflang,
    isPartOf: {
      '@type': 'WebSite',
      name: APP_NAME,
      url: SITE_URL,
    },
    about: {
      '@type': 'Thing',
      name: `Indian home cooking for ${market.countryName}`,
    },
    primaryImageOfPage: absoluteUrl('/download-hero.png'),
  };
}

export function marketBreadcrumbJsonLd(market: MarketConfig) {
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Rasoi', item: SITE_URL },
  ];
  if (market.id !== 'IN') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: market.countryName,
      item: absoluteUrl(market.path),
    });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

export function marketJsonLdBundle(marketId: MarketId) {
  const market = getMarketConfig(marketId);
  return jsonLdGraph([
    marketOrganizationJsonLd(market),
    marketWebSiteJsonLd(market),
    marketSoftwareJsonLd(market),
    marketWebPageJsonLd(market),
    marketBreadcrumbJsonLd(market),
    faqJsonLd(market.faqs),
  ]);
}

export function buildContentPageMetadata(options: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  imageUrl?: string;
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const ogImage = options.imageUrl
    ? absoluteUrl(options.imageUrl)
    : absoluteUrl('/download-hero.png');

  return {
    title: options.title,
    description: options.description,
    applicationName: APP_NAME,
    keywords: options.keywords ?? [],
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: absoluteUrl(options.path) },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: 'article',
      url: absoluteUrl(options.path),
      siteName: APP_NAME,
      title: options.title,
      description: options.description,
      ...(options.publishedTime ? { publishedTime: options.publishedTime } : {}),
      ...(options.modifiedTime ? { modifiedTime: options.modifiedTime } : {}),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: options.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title: options.title,
      description: options.description,
      images: [ogImage],
    },
    category: 'food',
  };
}

function parseRecipeDurationIso(timeLabel?: string): string | undefined {
  if (!timeLabel) return undefined;
  const match = timeLabel.match(/(\d+)\s*min/i);
  if (!match) return undefined;
  const minutes = Number.parseInt(match[1], 10);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return remainder > 0 ? `PT${hours}H${remainder}M` : `PT${hours}H`;
  }
  return `PT${minutes}M`;
}

function dietToSchemaRestriction(diet?: string): string | undefined {
  const normalized = diet?.toLowerCase() ?? '';
  if (normalized.includes('veg') && !normalized.includes('non')) {
    return 'https://schema.org/VegetarianDiet';
  }
  return undefined;
}

export function buildRecipeBlogMetadata(options: {
  title: string;
  description: string;
  slug: string;
  keywords: string[];
  imageUrl?: string;
  h1: string;
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const path = `/recipes/${options.slug}`;
  const base = buildContentPageMetadata({
    title: options.title,
    description: options.description,
    path,
    keywords: options.keywords,
    imageUrl: options.imageUrl,
    publishedTime: options.publishedTime,
    modifiedTime: options.modifiedTime,
  });

  return {
    ...base,
    alternates: {
      ...base.alternates,
      canonical: absoluteUrl(path),
      languages: recipeBlogHreflangLanguages(path),
    },
    openGraph: {
      ...base.openGraph,
      type: 'article',
      section: 'Indian home cooking',
      tags: options.keywords.slice(0, 8),
    },
    other: {
      'article:section': 'Recipes',
      'article:tag': options.keywords.slice(0, 5).join(', '),
    },
  };
}

export function articlePageJsonLd(options: {
  title: string;
  description: string;
  path: string;
  faqs?: ReadonlyArray<{ question: string; answer: string }>;
}) {
  const nodes: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: options.title,
      description: options.description,
      url: absoluteUrl(options.path),
      image: absoluteUrl('/download-hero.png'),
      author: { '@type': 'Organization', name: APP_DEVELOPER },
      publisher: {
        '@type': 'Organization',
        name: APP_DEVELOPER,
        logo: { '@type': 'ImageObject', url: absoluteUrl('/rasoi-logo.png') },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Rasoi', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: options.title, item: absoluteUrl(options.path) },
      ],
    },
  ];
  if (options.faqs?.length) {
    nodes.push(faqJsonLd(options.faqs));
  }
  return jsonLdGraph(nodes);
}

export function recipeBlogJsonLd(options: {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  cuisine?: string;
  diet?: string;
  time?: string;
  keywords?: string[];
  ingredients?: string[];
  steps?: string[];
  faqs?: ReadonlyArray<{ question: string; answer: string }>;
  publishedTime?: string;
  modifiedTime?: string;
}) {
  const pageUrl = absoluteUrl(options.path);
  const image = options.imageUrl
    ? absoluteUrl(options.imageUrl)
    : absoluteUrl('/download-hero.png');
  const recipeName = options.title
    .replace(/ \| Rasoi$/, '')
    .replace(/ — Indian Home Cooking Guide$/, '')
    .replace(/ — .*$/, '');
  const totalTime = parseRecipeDurationIso(options.time);

  const recipe: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    '@id': `${pageUrl}#recipe`,
    name: recipeName,
    headline: recipeName,
    description: options.description,
    url: pageUrl,
    image: [image],
    author: { '@type': 'Organization', name: APP_DEVELOPER, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: APP_DEVELOPER,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/rasoi-logo.png') },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    recipeCuisine: options.cuisine ?? 'Indian',
    recipeCategory: options.diet ?? 'Indian',
    recipeYield: '4 servings',
    inLanguage: 'en',
    isAccessibleForFree: true,
    ...(options.publishedTime ? { datePublished: options.publishedTime } : {}),
    ...(options.modifiedTime ? { dateModified: options.modifiedTime } : {}),
    ...(totalTime ? { totalTime } : {}),
    ...(options.keywords?.length ? { keywords: options.keywords.slice(0, 12).join(', ') } : {}),
  };

  const dietRestriction = dietToSchemaRestriction(options.diet);
  if (dietRestriction) {
    recipe.suitableForDiet = dietRestriction;
  }

  if (options.ingredients?.length) {
    recipe.recipeIngredient = options.ingredients;
  }
  if (options.steps?.length) {
    recipe.recipeInstructions = options.steps.map((text, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text,
      url: `${pageUrl}#step-${index + 1}`,
    }));
  }

  const nodes: Record<string, unknown>[] = [
    recipe,
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': pageUrl,
      url: pageUrl,
      name: options.title,
      description: options.description,
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', name: APP_NAME, url: SITE_URL },
      breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      primaryImageOfPage: { '@type': 'ImageObject', url: image },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Rasoi', item: SITE_URL },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Recipe guides',
          item: absoluteUrl('/recipes'),
        },
        { '@type': 'ListItem', position: 3, name: recipeName, item: pageUrl },
      ],
    },
  ];

  if (options.faqs?.length) {
    nodes.push(faqJsonLd(options.faqs));
  }

  return jsonLdGraph(nodes);
}

export function recipeIndexJsonLd(
  recipes: ReadonlyArray<{ name: string; slug: string; description: string; imageUrl?: string }>,
) {
  return jsonLdGraph([
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': absoluteUrl('/recipes'),
      name: 'Top Indian Recipe Guides — Rasoi',
      description:
        '55 high-search Indian recipe blogs with ingredients, method, and diaspora tips for India, USA, Canada, Australia, and New Zealand.',
      url: absoluteUrl('/recipes'),
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', name: APP_NAME, url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Top 55 Indian recipe guides',
      numberOfItems: recipes.length,
      itemListElement: recipes.map((recipe, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: recipe.name,
        url: absoluteUrl(`/recipes/${recipe.slug}`),
        description: recipe.description,
        ...(recipe.imageUrl ? { image: absoluteUrl(recipe.imageUrl) } : {}),
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Rasoi', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Recipe guides', item: absoluteUrl('/recipes') },
      ],
    },
  ]);
}

export function buildTaxonomyMetadata(options: {
  title: string;
  description: string;
  path: string;
  keywords: string[];
}): Metadata {
  return buildContentPageMetadata({
    title: options.title,
    description: options.description,
    path: options.path,
    keywords: options.keywords,
  });
}

export function taxonomyHubJsonLd(options: {
  title: string;
  description: string;
  path: string;
  faqs: ReadonlyArray<{ question: string; answer: string }>;
  recipes: ReadonlyArray<{ name: string; slug: string }>;
}) {
  const pageUrl = absoluteUrl(options.path);
  const nodes: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': pageUrl,
      name: options.title,
      description: options.description,
      url: pageUrl,
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', name: APP_NAME, url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: options.title,
      numberOfItems: options.recipes.length,
      itemListElement: options.recipes.map((recipe, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: recipe.name,
        url: absoluteUrl(`/recipes/${recipe.slug}`),
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Rasoi', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: absoluteUrl('/indian-recipe-app') },
        { '@type': 'ListItem', position: 3, name: options.title, item: pageUrl },
      ],
    },
  ];

  if (options.faqs.length) {
    nodes.push(faqJsonLd(options.faqs));
  }

  return jsonLdGraph(nodes);
}
