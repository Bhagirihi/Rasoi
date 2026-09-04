import type { SeoGuidePage } from '@/lib/seo-content-pages';
import { MARKET_PATHS } from '@/lib/markets';

/** City-level diaspora SEO guides — indexed at /{slug}, auto-added to sitemap. */
export const SEO_CITY_GUIDE_PAGES: SeoGuidePage[] = [
  {
    slug: 'indian-weeknight-dinners-toronto',
    title: 'Indian Weeknight Dinners in Toronto | Rasoi Home Cooking Guide',
    description:
      'Indian weeknight dinner ideas for Toronto home cooks — pantry staples on Gerrard and Lawrence, quick dal and sabzi, and Rasoi pantry match for the GTA diaspora.',
    keywords: [
      'indian weeknight dinners toronto',
      'indian recipes toronto',
      'toronto indian home cooking',
      'gta indian dinner ideas',
      'south asian cooking toronto',
      'indian grocery toronto',
    ],
    h1: 'Indian weeknight dinners in Toronto',
    intro:
      'Toronto’s Indian and South Asian communities stretch from Scarborough to Mississauga and Brampton. Weeknights still need fast dal, rice, roti, and sabzi — without a second trip to the store. Rasoi helps GTA home cooks match recipes to what is already in the pantry.',
    sections: [
      {
        heading: 'Where Toronto cooks shop',
        body: 'Gerrard India Bazaar, Lawrence Avenue shops, and suburban Indian grocers in Brampton and Mississauga cover basmati, atta, dal, and masalas. Loblaws, No Frills, and Costco fill gaps for produce and frozen peas. Plan one weekly stock-up, then cook from the pantry mid-week.',
      },
      {
        heading: 'Realistic weeknight rotation',
        body: 'Dal tadka with jeera rice, chole, paneer bhurji, vegetable pulao, and leftover-friendly stir-fries work on school nights. Filter Veg or Jain in Rasoi when the household needs it, and use under-20-minute tags when commute time is tight.',
      },
      {
        heading: 'Winter and batch cooking',
        body: 'Long Ontario winters reward batch-cooked dal and frozen portions. Double a pot on Sunday; reheat with fresh tadka on Tuesday. Rasoi’s pantry match shows what you can cook before you open another delivery app.',
      },
    ],
    faqs: [
      {
        question: 'Does Rasoi work for cooks in the Greater Toronto Area?',
        answer:
          'Yes. Recipes, pantry match, and regional filters work nationwide in Canada. See our Canadian Rasoi page for diaspora FAQs and grocery partner updates.',
      },
      {
        question: 'Which Toronto-area ingredients are easy to find?',
        answer:
          'Basmati rice, toor and moong dal, atta, paneer, common masalas, and fresh coriander are widely available across the GTA. Rasoi matches recipes to what you list in your pantry.',
      },
    ],
    marketId: 'CA',
    relatedLinks: [
      { href: MARKET_PATHS.CA, label: 'Rasoi Canada' },
      { href: '/indian-cooking-in-canada', label: 'Indian cooking in Canada' },
      { href: '/indian-home-cooking-vancouver', label: 'Vancouver guide' },
      { href: '/meal/dinner', label: 'Dinner recipes' },
    ],
  },
  {
    slug: 'indian-home-cooking-vancouver',
    title: 'Indian Home Cooking in Vancouver | Rasoi Pantry Guide',
    description:
      'Indian home cooking in Vancouver and the Lower Mainland — Surrey pantry staples, weeknight dinners, and Rasoi recipe match for BC diaspora families.',
    keywords: [
      'indian home cooking vancouver',
      'indian recipes vancouver',
      'surrey indian cooking',
      'lower mainland indian dinner',
      'indian grocery vancouver',
      'punjabi recipes vancouver',
    ],
    h1: 'Indian home cooking in Vancouver',
    intro:
      'From Vancouver to Surrey and the Fraser Valley, Punjabi, South Indian, and Gujarati families cook on busy Pacific time. Rasoi helps Lower Mainland home cooks answer “what’s for dinner?” from ingredients already at home.',
    sections: [
      {
        heading: 'Shopping across the Lower Mainland',
        body: 'Indian grocers in Surrey and Richmond stock atta, dal, and specialty produce. Save-On-Foods, Walmart, and Costco cover mainstream staples. Many households split shopping — spices from an Indian store, vegetables from a weekly supermarket run.',
      },
      {
        heading: 'Quick dinners after work',
        body: 'Rajma chawal, dal fry, bhindi sabzi, and paneer dishes fit BC weeknights. Rasoi surfaces recipes your pantry can support today, not a long shopping list for tomorrow.',
      },
    ],
    faqs: [
      {
        question: 'Is Rasoi useful for Vancouver and Surrey cooks?',
        answer:
          'Yes. Rasoi is built for Indian home cooking anywhere in Canada — pantry match, Veg and Jain filters, and 1,200+ regional recipes.',
      },
    ],
    marketId: 'CA',
    relatedLinks: [
      { href: MARKET_PATHS.CA, label: 'Rasoi Canada' },
      { href: '/indian-weeknight-dinners-toronto', label: 'Toronto weeknights' },
      { href: '/cuisine/punjabi', label: 'Punjabi recipes' },
    ],
  },
  {
    slug: 'indian-recipes-new-york-city',
    title: 'Indian Recipes for New York City Home Cooks | Rasoi',
    description:
      'Indian recipes and weeknight dinners for NYC home cooks — Jackson Heights pantry tips, quick dal and rice, and Rasoi pantry match for the tri-state diaspora.',
    keywords: [
      'indian recipes new york city',
      'indian cooking nyc',
      'jackson heights indian recipes',
      'indian weeknight dinner nyc',
      'nri cooking new york',
      'indian diaspora nyc',
    ],
    h1: 'Indian recipes for New York City home cooks',
    intro:
      'New York’s Indian diaspora cooks in small kitchens with big flavour expectations. Whether you shop in Jackson Heights, Patel Brothers in Queens, or a local supermarket, Rasoi helps you plan dinner from what is already in the fridge and pantry.',
    sections: [
      {
        heading: 'NYC pantry reality',
        body: 'Basmati, lentils, canned tomatoes, frozen peas, paneer, and a core masala set cover most weeknights. Indian groceries in Queens and New Jersey stock specialty items; Trader Joe’s and Whole Foods fill everyday produce. Cook from the overlap first.',
      },
      {
        heading: 'Fast meals after a long commute',
        body: 'One-pot khichdi, dal with rice, egg curry, and vegetable stir-fries respect NYC schedules. Use Rasoi’s quick filters when you have under thirty minutes between subway and dinner.',
      },
    ],
    faqs: [
      {
        question: 'Does Rasoi help cooks in the New York area?',
        answer:
          'Yes. See our United States Rasoi page for diaspora guides, FAQs, and US grocery partner updates rolling out on Rasoi Plus.',
      },
    ],
    marketId: 'US',
    relatedLinks: [
      { href: MARKET_PATHS.US, label: 'Rasoi USA' },
      { href: '/indian-cooking-in-usa', label: 'Indian cooking in the USA' },
      { href: '/indian-cooking-houston-texas', label: 'Houston guide' },
    ],
  },
  {
    slug: 'indian-cooking-houston-texas',
    title: 'Indian Cooking in Houston, Texas | Rasoi Home Kitchen Guide',
    description:
      'Indian cooking in Houston for home cooks — Hillcroft pantry staples, weeknight dal and sabzi, and Rasoi recipe match for Texas diaspora families.',
    keywords: [
      'indian cooking houston',
      'indian recipes houston texas',
      'hillcroft indian grocery',
      'houston indian weeknight dinner',
      'texas indian home cooking',
      'south asian recipes houston',
    ],
    h1: 'Indian cooking in Houston, Texas',
    intro:
      'Houston has one of the largest Indian communities in the United States. From Hillcroft Avenue shops to suburban H-E-B runs, home cooks need weeknight answers that respect Texas heat, long drives, and family taste. Rasoi matches regional recipes to your pantry.',
    sections: [
      {
        heading: 'Houston shopping patterns',
        body: 'Indian grocers on Hillcroft and in Sugar Land stock fresh curry leaves, millet, and regional flours. H-E-B, Kroger, and Costco cover rice, dal, and weekly produce. Keep a core masala tin and rotate fresh vegetables twice a week.',
      },
      {
        heading: 'Weeknight favourites',
        body: 'Sambar with rice, chicken or paneer curry, dal tadka, and tiffin-style dry sabzi travel well for lunch. Rasoi’s regional filters help you stay in a South Indian or North Indian lane for the week.',
      },
    ],
    faqs: [
      {
        question: 'Is Rasoi available for Houston home cooks?',
        answer:
          'Yes. Rasoi works for Indian home cooking across the United States — recipes, pantry match, and partner links are rolling out by region on Rasoi Plus.',
      },
    ],
    marketId: 'US',
    relatedLinks: [
      { href: MARKET_PATHS.US, label: 'Rasoi USA' },
      { href: '/indian-recipes-new-york-city', label: 'New York City guide' },
      { href: '/cuisine/south-indian', label: 'South Indian recipes' },
    ],
  },
  {
    slug: 'indian-recipes-sydney',
    title: 'Indian Recipes in Sydney | Rasoi Weeknight Cooking Guide',
    description:
      'Indian recipes for Sydney home cooks — Harris Park and Parramatta pantry tips, Woolworths staples, and Rasoi pantry match for NSW diaspora dinners.',
    keywords: [
      'indian recipes sydney',
      'indian cooking sydney',
      'harris park indian food home',
      'sydney indian weeknight dinner',
      'indian grocery sydney',
      'south asian cooking sydney',
    ],
    h1: 'Indian recipes in Sydney',
    intro:
      'Sydney’s Indian community spans Harris Park, Parramatta, and the North Shore. Between Woolworths, Coles, and suburban Indian grocers, home cooks can stock a solid pantry — then Rasoi shows what to cook tonight without another supermarket detour.',
    sections: [
      {
        heading: 'Sydney shopping mix',
        body: 'Indian stores in Harris Park and Wentworthville stock dal, atta, and specialty items. Woolworths and Coles cover produce and dairy. Many families do a monthly spice run and weekly vegetable top-ups.',
      },
      {
        heading: 'Australian weeknight pace',
        body: 'Short evenings favour dal and rice, fried rice with leftover sabzi, paneer stir-fry, and one-pot khichdi. Filter Veg or Jain in Rasoi when cooking for mixed households.',
      },
    ],
    faqs: [
      {
        question: 'Does Rasoi work for Sydney home cooks?',
        answer:
          'Yes. Browse our Australia Rasoi page for diaspora FAQs and Australian grocery partner updates on Rasoi Plus.',
      },
    ],
    marketId: 'AU',
    relatedLinks: [
      { href: MARKET_PATHS.AU, label: 'Rasoi Australia' },
      { href: '/indian-cooking-in-australia', label: 'Indian cooking in Australia' },
      { href: '/indian-cooking-melbourne', label: 'Melbourne guide' },
    ],
  },
  {
    slug: 'indian-cooking-melbourne',
    title: 'Indian Cooking in Melbourne | Rasoi Home Kitchen Guide',
    description:
      'Indian cooking in Melbourne — Dandenong and Footscray pantry staples, quick weeknight dinners, and Rasoi recipe match for Victorian diaspora families.',
    keywords: [
      'indian cooking melbourne',
      'indian recipes melbourne',
      'dandenong indian grocery',
      'melbourne indian weeknight dinner',
      'footscray indian home cooking',
      'south asian recipes melbourne',
    ],
    h1: 'Indian cooking in Melbourne',
    intro:
      'Melbourne’s Indian diaspora shops in Dandenong, Footscray, and suburban Coles and Woolworths stores. Rasoi helps Victorian home cooks plan regional dinners from ingredients already in the kitchen — with Australian partner links rolling out on Rasoi Plus.',
    sections: [
      {
        heading: 'Melbourne pantry staples',
        body: 'Basmati, toor dal, atta, paneer, and core masalas are easy to find in the eastern and western suburbs. Fresh curry leaves and regional vegetables are best from Indian grocers; mainstream supermarkets cover weekly produce.',
      },
      {
        heading: 'Cooking for Melbourne winters',
        body: 'Cooler months call for rasam, sambar, hearty dal, and oven-friendly bakes. Batch-cook on Sunday; use Rasoi pantry match mid-week to avoid duplicate ingredient shopping.',
      },
    ],
    faqs: [
      {
        question: 'Where is the main Australian Rasoi page?',
        answer: 'Visit our Australia home page for national guides, FAQs, and partner rollout updates.',
      },
    ],
    marketId: 'AU',
    relatedLinks: [
      { href: MARKET_PATHS.AU, label: 'Rasoi Australia' },
      { href: '/indian-recipes-sydney', label: 'Sydney guide' },
      { href: '/meal/dinner', label: 'Dinner ideas' },
    ],
  },
];

const cityGuideByMarket = new Map<string, SeoGuidePage[]>();

for (const page of SEO_CITY_GUIDE_PAGES) {
  const list = cityGuideByMarket.get(page.marketId) ?? [];
  list.push(page);
  cityGuideByMarket.set(page.marketId, list);
}

export function getCityGuidesForMarket(marketId: string): SeoGuidePage[] {
  return cityGuideByMarket.get(marketId) ?? [];
}

export const SEO_CITY_GUIDE_SLUGS = new Set(SEO_CITY_GUIDE_PAGES.map((page) => page.slug));
