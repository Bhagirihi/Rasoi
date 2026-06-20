import type { Metadata } from 'next';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://rasoiapplication.in';

export const SITE_NAME = 'Rasoi';

export const DEFAULT_TITLE =
  'Rasoi — Aaj Kya Banaye? Indian Recipe App | Pantry Match & Regional Dishes';

export const DEFAULT_DESCRIPTION =
  'Rasoi helps Indian home cooks decide dinner from what is already in the kitchen. 1,200+ regional recipes, pantry match %, Veg/Jain filters, and Blinkit/Zepto checkout. Free on Google Play for Android.';

export const DEFAULT_KEYWORDS = [
  'Rasoi app',
  'rasoiapplication.in',
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
] as const;

export const TWITTER_HANDLE = '@rasoiapp';

import { ANDROID_APK_URL, PLAY_STORE_LISTING_URL } from '@/lib/app-download';
import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-content';

export const FAQ_ITEMS = [
  {
    question: 'What is Rasoi app?',
    answer:
      'Rasoi is a free Indian home-cooking app that answers "Aaj kya banaye?" — it recommends dinners from ingredients already in your pantry, with 15 regional cuisines and diet filters for Veg, Jain, Egg, and Non-Veg.',
  },
  {
    question: 'Is Rasoi free to download?',
    answer:
      'Yes. Rasoi is free on Android from Google Play at rasoiapplication.in/download. Rasoi Plus adds partner checkout (Blinkit, Zepto, Instamart, Zomato, Swiggy) with a 3-day trial.',
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
    keywords: [...DEFAULT_KEYWORDS, ...(options.keywords ?? [])],
    metadataBase: new URL(SITE_URL),
    alternates: { canonical },
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
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: absoluteUrl('/download-hero.png'), width: 1200, height: 630, alt: 'Rasoi — Indian home cooking app' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl('/download-hero.png')],
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
  title: 'Download Rasoi on Google Play | rasoiapplication.in',
  description:
    'Download Rasoi free on Google Play for Android. Indian recipe app with pantry match, regional cuisines, meal reminders, and partner checkout.',
  path: '/download',
  keywords: [
    'download Rasoi app',
    'Rasoi Google Play',
    'Rasoi Android download',
    'Indian recipe app Android',
  ],
});

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/rasoi-logo.png'),
    description: DEFAULT_DESCRIPTION,
    email: LEGAL_CONTACT_EMAIL,
    areaServed: { '@type': 'Country', name: 'India' },
  };
}

export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: ['en-IN', 'hi-IN'],
  };
}

export function mobileAppJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: SITE_NAME,
    operatingSystem: 'Android',
    applicationCategory: 'LifestyleApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description: DEFAULT_DESCRIPTION,
    downloadUrl: PLAY_STORE_LISTING_URL,
    installUrl: PLAY_STORE_LISTING_URL,
    sameAs: [PLAY_STORE_LISTING_URL, ANDROID_APK_URL],
    url: SITE_URL,
    featureList: [
      'Pantry-to-recipe matching',
      '15 regional Indian cuisines',
      'Veg, Jain, Egg, Non-Veg filters',
      'Partner grocery checkout',
      'Daily meal reminders',
    ],
  };
}

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
