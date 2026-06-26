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
import {
  getAllMarkets,
  getMarketConfig,
  type MarketConfig,
  type MarketId,
} from '@/lib/markets';

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

export const downloadMetadata: Metadata = {
  ...buildPageMetadata({
    title: 'Download Rasoi: Aaj Kya Banaye? on Google Play | Android Recipe App',
    description:
      'Download Rasoi: Aaj Kya Banaye? free on Google Play for Android. Indian recipe app with pantry match, 1,200+ regional dishes, meal reminders, and partner checkout — available in India, USA, Canada & Australia.',
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
    types: {
      'application/vnd.android.package-archive': ANDROID_APK_URL,
    },
  },
};

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

export function buildMarketMetadata(market: MarketConfig): Metadata {
  const canonical = absoluteUrl(market.path);
  const ogLocale =
    market.hreflang === 'en-IN'
      ? 'en_IN'
      : market.hreflang === 'en-US'
        ? 'en_US'
        : market.hreflang === 'en-CA'
          ? 'en_CA'
          : 'en_AU';

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
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      alternateLocale: getAllMarkets()
        .filter((m) => m.id !== market.id)
        .map((m) =>
          m.hreflang === 'en-IN'
            ? 'en_IN'
            : m.hreflang === 'en-US'
              ? 'en_US'
              : m.hreflang === 'en-CA'
                ? 'en_CA'
                : 'en_AU',
        ),
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
    '1,200+ recipes across 15 regional Indian cuisines',
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
    alternateName: [APP_SHORT_NAME, `Indian home cooking ${market.countryName}`],
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: market.priceCurrency,
    },
    description: market.description,
    url: absoluteUrl(market.path),
    image: absoluteUrl('/download-hero.png'),
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
    sameAs: [PLAY_STORE_LISTING_URL, absoluteUrl(PLAY_STORE_SEO_PATH), ANDROID_APK_URL],
    url: absoluteUrl(market.path),
    author: { '@type': 'Organization', name: APP_DEVELOPER },
    publisher: { '@type': 'Organization', name: APP_DEVELOPER },
    countriesSupported: market.id,
    inLanguage: market.hreflang,
    featureList: [
      'Aaj kya banaye — tonight\'s meal picks',
      'Pantry-to-recipe matching',
      '1,200+ recipes across 15 regional Indian cuisines',
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
}): Metadata {
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
      images: [
        {
          url: absoluteUrl('/download-hero.png'),
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
      images: [absoluteUrl('/download-hero.png')],
    },
    category: 'food',
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
