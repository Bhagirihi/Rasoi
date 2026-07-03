import { APP_NAME } from '@/lib/app-download';

export const MARKET_COOKIE = 'rasoi_market';

export const MARKET_IDS = ['IN', 'US', 'CA', 'AU'] as const;
export type MarketId = (typeof MARKET_IDS)[number];

export type MarketPartner = {
  name: string;
  note: string;
  color: string;
};

export type MarketFaq = {
  question: string;
  answer: string;
};

export type MarketConfig = {
  id: MarketId;
  label: string;
  flag: string;
  /** Canonical indexable path */
  path: string;
  /** Short alias that 301-redirects to path */
  shortPath?: string;
  hreflang: string;
  countryName: string;
  geoCountryCodes: readonly string[];
  title: string;
  description: string;
  keywords: readonly string[];
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBody: string;
  phonePartners: readonly string[];
  partners: readonly MarketPartner[];
  partnersIntro: string;
  partnersStatus: 'live' | 'rolling_out';
  plusIntro: string;
  plusFeatures: readonly string[];
  plusPricing: string;
  faqs: readonly MarketFaq[];
  showSponsor: boolean;
  /** Phone placeholder on sponsor application form */
  sponsorPhonePlaceholder: string;
  /** Brand name placeholder examples for sponsor form */
  sponsorBrandExample: string;
  priceCurrency: string;
  schemaMonthlyPrice: string;
};

const SHARED_FEATURES = [
  {
    title: 'Regional recipes',
    body: 'Filter by North, South, East, West, or Central cuisines with diet preferences from Veg to Non-Veg.',
  },
  {
    title: 'Smart pantry',
    body: 'See what you can cook tonight with ingredients already in your kitchen — or what you need to buy.',
  },
  {
    title: 'Saved collection',
    body: 'Bookmark dishes for weeknight rotation, festive menus, and family favourites.',
  },
  {
    title: 'Tonight\'s picks',
    body: 'Meal suggestions for breakfast, lunch, dinner, and late-night based on your diet and cuisine.',
  },
  {
    title: 'Quick filters',
    body: 'Under 20 minutes, kid-friendly, leftover-friendly, and festive tags for faster decisions.',
  },
  {
    title: 'Meal reminders',
    body: 'Daily nudges so dinner planning becomes a habit — not a last-minute scramble.',
  },
] as const;

export const MARKET_FEATURES = SHARED_FEATURES;

export const MARKET_PATHS = {
  IN: '/',
  US: '/indian-recipe-app-usa',
  CA: '/indian-recipe-app-canada',
  AU: '/indian-recipe-app-australia',
} as const;

export const MARKET_SHORT_PATHS = {
  US: '/us',
  CA: '/ca',
  AU: '/au',
} as const;

const WEB_INTERNATIONAL_FAQ_BASE = (
  country: string,
  partners: string,
): MarketFaq[] => [
  {
    question: `Can I use Rasoi in ${country}?`,
    answer: `Yes. Rasoi is built for Indian home cooks in ${country} — regional recipes, pantry matching, Veg and Jain filters, and dinner ideas from what you already have in the kitchen.`,
  },
  {
    question: 'Do I need grocery partner links to use Rasoi?',
    answer:
      'No. Recipes, pantry match, diet filters, and regional cuisines work on their own. Grocery partner checkout is an optional Plus feature rolling out by region.',
  },
  {
    question: `Which grocery partners are coming to ${country}?`,
    answer: `Rasoi is rolling out deep links to ${partners} so you can shop missing ingredients from a recipe. Core cooking features are available today on rasoiapplication.in.`,
  },
  {
    question: 'What makes Rasoi different from generic recipe sites?',
    answer:
      'Rasoi focuses on Indian home cooking — pantry match %, regional cuisines, Jain and Veg filters, and "what to cook tonight" picks. It is not a generic Western meal-prep blog.',
  },
  {
    question: 'Does Rasoi work for the Indian diaspora?',
    answer:
      'Yes. Whether you are in India, the United States, Canada, or Australia, Rasoi helps you cook regional Indian food from your pantry.',
  },
  {
    question: `Where do I learn more about Rasoi in ${country}?`,
    answer: `Explore Rasoi guides on rasoiapplication.in and your regional home page for ${country} — recipes, FAQs, and partner updates as they roll out.`,
  },
];

const MARKETS: Record<MarketId, MarketConfig> = {
  IN: {
    id: 'IN',
    label: 'India',
    flag: '🇮🇳',
    path: '/',
    hreflang: 'en-IN',
    countryName: 'India',
    geoCountryCodes: ['IN'],
    title: `${APP_NAME} | Indian Home Cooking, Pantry Match & Regional Recipes`,
    description:
      'Rasoi helps Indian home cooks answer "Aaj kya banaye?" — match recipes to your pantry, browse 1,200+ regional dishes, Veg & Jain filters, and practical guides on rasoiapplication.in.',
    keywords: [
      'Rasoi app',
      'rasoiapplication.in',
      'aaj kya banaye app',
      'Indian recipe app',
      'home cooking app India',
      'pantry recipe app',
      'dinner recipe app India',
      'regional Indian recipes',
      'Veg recipe app India',
      'Jain recipes app',
      'Gujarati recipe app',
      'South Indian recipe app',
      'what to cook tonight app India',
    ],
    heroBadge: 'Google Play · Aaj kya banaye? · Indian home cooking',
    heroTitle: APP_NAME,
    heroSubtitle: 'Decide dinner from your pantry and your region.',
    heroBody:
      'Discover regional dishes, match recipes to what you already have, save favourites, and shop missing ingredients via Blinkit, Zepto, Instamart, Zomato, or Swiggy — built for real Indian kitchens.',
    phonePartners: ['Blinkit', 'Zepto', 'Instamart', 'Swiggy'],
    partners: [
      { name: 'Blinkit', note: '10-min grocery', color: '#f8cb46' },
      { name: 'Zepto', note: '~15 min delivery', color: '#7c3aed' },
      { name: 'Instamart', note: 'Swiggy quick commerce', color: '#ff5200' },
      { name: 'Zomato', note: 'Restaurant delivery', color: '#e23744' },
      { name: 'Swiggy', note: 'Food delivery', color: '#fc8019' },
    ],
    partnersIntro:
      'Rasoi Plus unlocks grocery and food delivery checkout. Missing paneer? Open Blinkit. Want delivery instead? Jump to Zomato or Swiggy with affiliate tracking built in.',
    partnersStatus: 'live',
    plusIntro:
      'Start with a 3-day trial of partner checkout, then subscribe to keep Blinkit, Zepto, Instamart, Zomato, and Swiggy links — and remove ads across the app.',
    plusFeatures: [
      'No ads on Free, Trial, or Plus journeys',
      'Blinkit, Zepto & Instamart grocery cart deep links',
      'Zomato & Swiggy food delivery links',
      'Pantry-aware recipe matching',
    ],
    plusPricing: '₹49/month or ₹499/year (save ~15% vs monthly)',
    faqs: [
      {
        question: `What is ${APP_NAME}?`,
        answer:
          'Rasoi answers the daily question "Aaj kya banaye?" for Indian home cooks — dinner ideas from your pantry, 1,200+ regional recipes, and filters for Veg, Jain, Egg, and Non-Veg.',
      },
      {
        question: 'How does pantry matching work?',
        answer:
          'Add what you have at home — dal, rice, paneer, vegetables, masalas — and Rasoi shows recipes with a match percentage so you cook from your kitchen instead of guessing.',
      },
      {
        question: 'Which Indian cuisines does Rasoi cover?',
        answer:
          'Rasoi covers North, South, East, West, and Central Indian home cooking — Gujarati, Punjabi, South Indian, Bengali, Maharashtrian, and more.',
      },
      {
        question: 'Can I order missing ingredients through Rasoi?',
        answer:
          'Rasoi Plus connects to Blinkit, Zepto, Instamart, Zomato, and Swiggy so you can shop missing items from a recipe in one tap.',
      },
      {
        question: 'Does Rasoi work outside India?',
        answer: `Yes. Recipes and pantry matching work worldwide. See Rasoi for the United States (${MARKET_PATHS.US}), Canada (${MARKET_PATHS.CA}), and Australia (${MARKET_PATHS.AU}).`,
      },
      {
        question: 'Where can I read more on rasoiapplication.in?',
        answer:
          'Browse our Indian recipe guides at /indian-recipe-app — dinner ideas, Jain recipes, regional cuisines, and dish pages updated for home cooks.',
      },
    ],
    showSponsor: true,
    sponsorPhonePlaceholder: '+91 98765 43210',
    sponsorBrandExample: 'e.g. Amul, Tata Sampann, MDH',
    priceCurrency: 'INR',
    schemaMonthlyPrice: '49',
  },
  US: {
    id: 'US',
    label: 'United States',
    flag: '🇺🇸',
    path: '/indian-recipe-app-usa',
    shortPath: '/us',
    hreflang: 'en-US',
    countryName: 'United States',
    geoCountryCodes: ['US'],
    title: 'Indian Home Cooking USA | Rasoi — Pantry Match & Regional Recipes',
    description:
      'Rasoi helps Indian home cooks in the USA decide dinner from your pantry. 1,200+ regional recipes, pantry match %, Veg & Jain filters, and US grocery partners rolling out. Indian home cooking for the diaspora.',
    keywords: [
      'Indian home cooking USA',
      'Indian recipe guide USA',
      'Indian cooking United States',
      'what to cook tonight Indian',
      'South Indian recipes USA',
      'Punjabi recipes USA',
      'NRI cooking guide',
      'Indian diaspora recipes',
      'pantry Indian recipes',
      'Veg Indian recipes USA',
      'Jain recipes USA',
      'Instacart Indian recipes',
      'Rasoi USA',
    ],
    heroBadge: 'Indian home cooking · USA',
    heroTitle: 'Indian home cooking for the United States',
    heroSubtitle: 'Cook from your pantry. Regional recipes for the diaspora.',
    heroBody:
      'Rasoi helps Indian home cooks and the diaspora answer "what\'s for dinner?" Match recipes to ingredients you already have and explore 1,200+ regional dishes — with US grocery partner links rolling out.',
    phonePartners: ['Instacart', 'Amazon', 'DoorDash', 'Uber Eats'],
    partners: [
      { name: 'Instacart', note: 'Grocery delivery', color: '#43b02a' },
      { name: 'Amazon', note: 'Fresh & pantry search', color: '#ff9900' },
      { name: 'DoorDash', note: 'Food delivery', color: '#ff3008' },
      { name: 'Uber Eats', note: 'Restaurant delivery', color: '#06c167' },
    ],
    partnersIntro:
      'Rasoi Plus will open Instacart, Amazon, DoorDash, and Uber Eats with your missing ingredients pre-filled — the same one-tap flow Indian users love with Blinkit and Zepto.',
    partnersStatus: 'rolling_out',
    plusIntro:
      'Rasoi Plus adds ad-free browsing and US grocery & delivery partner links as they roll out in your region.',
    plusFeatures: [
      'Ad-free recipe browsing',
      'Instacart & Amazon grocery links (rolling out)',
      'DoorDash & Uber Eats delivery links (rolling out)',
      'Pantry-aware recipe matching',
    ],
    plusPricing: 'Plus plans vary by region — see Rasoi Plus on your regional page for details.',
    faqs: WEB_INTERNATIONAL_FAQ_BASE(
      'the United States',
      'Instacart, Amazon, DoorDash, and Uber Eats',
    ),
    showSponsor: true,
    sponsorPhonePlaceholder: '+1 (415) 555-0100',
    sponsorBrandExample: "e.g. Rao's, MDH, Goya, Trader Joe's",
    priceCurrency: 'USD',
    schemaMonthlyPrice: '2.99',
  },
  CA: {
    id: 'CA',
    label: 'Canada',
    flag: '🇨🇦',
    path: '/indian-recipe-app-canada',
    shortPath: '/ca',
    hreflang: 'en-CA',
    countryName: 'Canada',
    geoCountryCodes: ['CA'],
    title: 'Indian Home Cooking Canada | Rasoi — Regional Recipes & Pantry Match',
    description:
      'Rasoi helps Indian home cooks in Canada decide dinner from your pantry. Regional recipes, pantry match, Veg & Jain filters, and Canadian grocery partners rolling out.',
    keywords: [
      'Indian home cooking Canada',
      'Indian recipes Canada',
      'Punjabi recipes Canada',
      'South Asian cooking Canada',
      'Toronto Indian recipes',
      'Vancouver Indian cooking',
      'pantry Indian recipes Canada',
      'Veg Indian recipes Canada',
      'Rasoi Canada',
    ],
    heroBadge: 'Indian home cooking · Canada',
    heroTitle: 'Indian home cooking for Canada',
    heroSubtitle: 'Regional dishes. Pantry match. Diaspora-friendly.',
    heroBody:
      'Built for Canadian home cooks and the South Asian diaspora. Match recipes to what is in your kitchen and browse Gujarati, Punjabi, South Indian, and 12 more cuisines.',
    phonePartners: ['Instacart', 'Amazon', 'Skip', 'Uber Eats'],
    partners: [
      { name: 'Instacart', note: 'Grocery delivery', color: '#43b02a' },
      { name: 'Amazon.ca', note: 'Pantry search', color: '#ff9900' },
      { name: 'SkipTheDishes', note: 'Food delivery', color: '#e8002b' },
      { name: 'Uber Eats', note: 'Restaurant delivery', color: '#06c167' },
    ],
    partnersIntro:
      'Rasoi Plus will connect your missing ingredients to Instacart, Amazon.ca, SkipTheDishes, and Uber Eats — one tap from any recipe.',
    partnersStatus: 'rolling_out',
    plusIntro:
      'Rasoi Plus removes ads and unlocks Canadian grocery & delivery partner links as they roll out.',
    plusFeatures: [
      'Ad-free recipe browsing',
      'Instacart & Amazon.ca grocery links',
      'SkipTheDishes & Uber Eats delivery',
      'Pantry match for weeknight dinners',
    ],
    plusPricing: 'Plus plans vary by region — details on your Canadian Rasoi page.',
    faqs: WEB_INTERNATIONAL_FAQ_BASE(
      'Canada',
      'Instacart, Amazon.ca, SkipTheDishes, and Uber Eats',
    ),
    showSponsor: true,
    sponsorPhonePlaceholder: '+1 (416) 555-0100',
    sponsorBrandExample: "e.g. President's Choice, Patak's, Natrel",
    priceCurrency: 'CAD',
    schemaMonthlyPrice: '3.99',
  },
  AU: {
    id: 'AU',
    label: 'Australia',
    flag: '🇦🇺',
    path: '/indian-recipe-app-australia',
    shortPath: '/au',
    hreflang: 'en-AU',
    countryName: 'Australia',
    geoCountryCodes: ['AU'],
    title: 'Indian Home Cooking Australia | Rasoi — Veg, Jain & Regional Dishes',
    description:
      'Rasoi helps Indian home cooks in Australia decide dinner from your pantry. Regional recipes, pantry match %, Veg & Jain filters, and Australian grocery partners rolling out.',
    keywords: [
      'Indian home cooking Australia',
      'Indian recipes Australia',
      'veg Indian recipes Australia',
      'South Indian recipes Australia',
      'Sydney Indian recipes',
      'Melbourne Indian cooking',
      'pantry Indian recipes Australia',
      'Jain recipes Australia',
      'Woolworths Indian recipes',
      'Rasoi Australia',
    ],
    heroBadge: 'Indian home cooking · Australia',
    heroTitle: 'Indian home cooking for Australia',
    heroSubtitle: 'Cook from your pantry. Regional recipes for home.',
    heroBody:
      'For Australian home cooks and the Indian community. Discover regional recipes and see what you can make tonight from ingredients you already have.',
    phonePartners: ['Woolworths', 'Coles', 'DoorDash', 'Menulog'],
    partners: [
      { name: 'Woolworths', note: 'Supermarket search', color: '#178c35' },
      { name: 'Coles', note: 'Grocery search', color: '#e01a22' },
      { name: 'DoorDash', note: 'Food delivery', color: '#ff3008' },
      { name: 'Menulog', note: 'Restaurant delivery', color: '#ff8000' },
    ],
    partnersIntro:
      'Rasoi Plus will open Woolworths, Coles, DoorDash, and Menulog with your missing ingredients — Australia\'s answer to quick grocery checkout from a recipe.',
    partnersStatus: 'rolling_out',
    plusIntro:
      'Subscribe to Rasoi Plus for ad-free browsing and Australian grocery & delivery partner links when live.',
    plusFeatures: [
      'Ad-free recipe browsing',
      'Woolworths & Coles grocery search links',
      'DoorDash & Menulog delivery links',
      'Pantry match across 15 cuisines',
    ],
    plusPricing: 'Plus plans vary by region — details on your Australian Rasoi page.',
    faqs: WEB_INTERNATIONAL_FAQ_BASE(
      'Australia',
      'Woolworths, Coles, DoorDash, and Menulog',
    ),
    showSponsor: true,
    sponsorPhonePlaceholder: '+61 412 345 678',
    sponsorBrandExample: "e.g. Patak's, Sharwood's, Woolworths Indian",
    priceCurrency: 'AUD',
    schemaMonthlyPrice: '4.99',
  },
};

export function getMarketConfig(id: MarketId): MarketConfig {
  return MARKETS[id];
}

export function getAllMarkets(): MarketConfig[] {
  return MARKET_IDS.map((id) => MARKETS[id]);
}

export function getMarketByPath(pathname: string): MarketConfig | undefined {
  const normalized = pathname.replace(/\/$/, '') || '/';
  return getAllMarkets().find(
    (market) => market.path === normalized || market.shortPath === normalized,
  );
}

export function isMarketId(value: string): value is MarketId {
  return (MARKET_IDS as readonly string[]).includes(value);
}

export function marketIdFromCookie(value: string | undefined): MarketId | null {
  const upper = value?.toUpperCase();
  if (upper && isMarketId(upper)) return upper;
  return null;
}

export function geoCountryToMarketId(countryCode: string | undefined): MarketId | null {
  if (!countryCode) return null;
  const upper = countryCode.toUpperCase();
  for (const market of getAllMarkets()) {
    if (market.geoCountryCodes.includes(upper)) return market.id;
  }
  return null;
}
