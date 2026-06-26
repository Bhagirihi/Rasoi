import type { MarketId } from '@/lib/markets';
import { MARKET_PATHS } from '@/lib/markets';

export type SeoContentFaq = {
  question: string;
  answer: string;
};

export type SeoGuidePage = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: SeoContentFaq[];
  marketId: MarketId;
  relatedLinks: { href: string; label: string }[];
};

export type SeoRecipePage = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  intro: string;
  cuisine: string;
  diet: string;
  time: string;
  sections: { heading: string; body: string }[];
  faqs: SeoContentFaq[];
  relatedLinks: { href: string; label: string }[];
};

export const SEO_GUIDE_PAGES: SeoGuidePage[] = [
  {
    slug: 'what-to-cook-tonight-indian',
    title: 'What to Cook Tonight — Indian Home Cooking Ideas | Rasoi',
    description:
      'Stuck on dinner? Indian home cooking ideas from your pantry — regional picks, Veg & Jain options, and how Rasoi answers "Aaj kya banaye?" on rasoiapplication.in.',
    keywords: ['what to cook tonight indian', 'dinner ideas indian home', 'aaj kya banaye', 'indian weeknight dinner'],
    h1: 'What to cook tonight — Indian home cooking',
    intro:
      'Every evening the same question comes back: what should we make for dinner? For Indian home cooks, the answer depends on what is in your pantry, your regional taste, and how much time you have. Rasoi is built around that daily decision — not endless scrolling through generic recipe blogs.',
    sections: [
      {
        heading: 'Start with your pantry, not a shopping list',
        body: 'The fastest dinners come from ingredients you already have — rice, dal, paneer, seasonal vegetables, and the masalas on your shelf. Match recipes to what is at home instead of planning around what you wish you had. That is how most Indian kitchens actually work on weeknights.',
      },
      {
        heading: 'Use regional cues',
        body: 'A Gujarati household might want dhokla or sev tameta on a light night; a Punjabi kitchen might lean toward dal tadka and roti; South Indian homes often reach for rasam, dosa batter, or a quick vegetable kootu. Pick a cuisine lane for the night and narrow from there.',
      },
      {
        heading: 'Filter by diet and time',
        body: 'Jain, strict veg, egg, or non-veg — filter early so you do not waste time on recipes that will not work for your family. Under-20-minute tags help when everyone is hungry and the clock is tight.',
      },
    ],
    faqs: [
      {
        question: 'How does Rasoi help with "what to cook tonight"?',
        answer:
          'Rasoi suggests dinners from your pantry with match percentages, regional filters, and diet preferences — the same "Aaj kya banaye?" idea Indian home cooks use every day.',
      },
      {
        question: 'Do I need exotic ingredients every night?',
        answer: 'No. The best weeknight Indian meals use staples — dal, rice, atta, common vegetables, and masalas you already buy.',
      },
    ],
    marketId: 'IN',
    relatedLinks: [
      { href: '/', label: 'Rasoi India home' },
      { href: '/indian-recipe-app', label: 'Indian recipe guides' },
      { href: '/gujarati-dinner-ideas', label: 'Gujarati dinner ideas' },
    ],
  },
  {
    slug: 'jain-recipes-indian-home-cooking',
    title: 'Jain Recipes for Indian Home Cooking | Rasoi',
    description:
      'Jain-friendly Indian home cooking — no onion, no garlic, root-vegetable aware recipes and pantry tips on rasoiapplication.in.',
    keywords: ['jain recipes', 'jain home cooking', 'jain dinner ideas', 'no onion garlic recipes'],
    h1: 'Jain recipes for Indian home cooking',
    intro:
      'Jain home cooking has clear rules — no onion, no garlic, careful choices around root vegetables, and strong regional traditions especially in Gujarat and Rajasthan. Rasoi supports Jain filters so dinner planning stays practical, not stressful.',
    sections: [
      {
        heading: 'Why Jain cooking needs its own lane',
        body: 'Generic recipe sites often hide onion and garlic in masala bases or suggest potato-heavy shortcuts that do not fit every Jain household. A dedicated Jain filter saves time and avoids last-minute substitutions.',
      },
      {
        heading: 'Pantry staples for Jain weeknights',
        body: 'Tomatoes, capsicum, gourds, paneer, pulses, rice, atta, peanuts, and sesame-based tempering are reliable building blocks. Keep a short list of Jain-safe dinners your family already loves, then rotate them with Rasoi picks.',
      },
    ],
    faqs: [
      {
        question: 'Does Rasoi support Jain recipes?',
        answer: 'Yes. Rasoi includes Jain diet filters across regional Indian cuisines so you can browse dinners that fit your kitchen rules.',
      },
    ],
    marketId: 'IN',
    relatedLinks: [
      { href: '/', label: 'Rasoi India' },
      { href: '/what-to-cook-tonight-indian', label: 'What to cook tonight' },
    ],
  },
  {
    slug: 'gujarati-dinner-ideas',
    title: 'Gujarati Dinner Ideas for Home Cooks | Rasoi',
    description:
      'Gujarati dinner ideas from your pantry — roti, dal, shaak, and weeknight favourites for Indian home cooking on rasoiapplication.in.',
    keywords: ['gujarati dinner ideas', 'gujarati recipes home', 'gujarati weeknight dinner'],
    h1: 'Gujarati dinner ideas for home cooks',
    intro:
      'Gujarati dinners balance roti or rice, a dal or kadhi, shaak, and often something tangy or sweet on the side. The best plans use what is already in the kitchen — not a long shopping run after work.',
    sections: [
      {
        heading: 'Quick Gujarati weeknight patterns',
        body: 'Sev tameta, ringan bateta, dal dhokli, khichdi, and handvo leftovers are realistic on busy nights. Match a vegetable shaak to whatever sabzi is freshest in your fridge.',
      },
    ],
    faqs: [
      {
        question: 'Can Rasoi filter Gujarati recipes?',
        answer: 'Yes. Rasoi includes Gujarati and wider regional filters so you can browse dinners that match your pantry and diet.',
      },
    ],
    marketId: 'IN',
    relatedLinks: [{ href: '/', label: 'Rasoi India' }, { href: '/jain-recipes-indian-home-cooking', label: 'Jain recipes' }],
  },
  {
    slug: 'south-indian-weeknight-recipes',
    title: 'South Indian Weeknight Recipes | Rasoi',
    description:
      'South Indian weeknight recipes — rasam, sambar, dosa, rice dishes, and pantry-friendly dinners on rasoiapplication.in.',
    keywords: ['south indian weeknight recipes', 'south indian dinner ideas', 'quick south indian home cooking'],
    h1: 'South Indian weeknight recipes',
    intro:
      'South Indian weeknights often mean rice-centric meals — rasam, sambar, poriyal, kootu, or a quick tiffin-style dinner. Fermented batter, frozen coconut, and pantry dal keep planning simple.',
    sections: [
      {
        heading: 'Build around rice and dal',
        body: 'If you have rice and toor dal, you are halfway to sambar or dal with a vegetable poriyal. Leftover rice becomes lemon rice or tamarind rice the next day.',
      },
    ],
    faqs: [
      {
        question: 'Does Rasoi include South Indian cuisines?',
        answer: 'Yes. Rasoi covers South Indian regional picks alongside North, West, East, and Central Indian home cooking.',
      },
    ],
    marketId: 'IN',
    relatedLinks: [{ href: '/', label: 'Rasoi India' }, { href: '/recipes/masala-dosa', label: 'Masala dosa guide' }],
  },
  {
    slug: 'indian-cooking-in-usa',
    title: 'Indian Cooking in the USA — Home Kitchen Guide | Rasoi',
    description:
      'Indian cooking in the USA for the diaspora — pantry staples, regional recipes, and Rasoi guides for American home kitchens on rasoiapplication.in.',
    keywords: ['indian cooking in usa', 'indian diaspora cooking', 'indian recipes usa home'],
    h1: 'Indian cooking in the USA',
    intro:
      'Cooking Indian food in the United States means adapting to American grocery aisles, busy weeknights, and the flavors you grew up with. Rasoi helps diaspora home cooks plan dinners from what is already in the kitchen — with US grocery partner links rolling out over time.',
    sections: [
      {
        heading: 'Stock a diaspora pantry',
        body: 'Basmati rice, toor and moong dal, atta, common masalas, frozen peas, paneer or tofu, and long-life coconut milk cover a huge share of weeknight meals. Indian stores and mainstream supermarkets both work — plan around what is reachable in your city.',
      },
      {
        heading: 'Regional taste away from home',
        body: 'You do not need to give up Gujarati, Punjabi, or South Indian rhythms just because you are in New Jersey or Texas. Pick a regional lane for the week and rotate favourites your family already asks for.',
      },
    ],
    faqs: [
      {
        question: 'Is Rasoi available for cooks in the United States?',
        answer: `Yes. See our United States home page at ${MARKET_PATHS.US} for diaspora-focused guides, FAQs, and partner updates.`,
      },
    ],
    marketId: 'US',
    relatedLinks: [
      { href: MARKET_PATHS.US, label: 'Rasoi USA' },
      { href: '/indian-recipe-app', label: 'All guides' },
    ],
  },
  {
    slug: 'indian-cooking-in-canada',
    title: 'Indian Cooking in Canada — Home Kitchen Guide | Rasoi',
    description:
      'Indian cooking in Canada for home cooks and the South Asian diaspora — pantry tips and Rasoi regional guides on rasoiapplication.in.',
    keywords: ['indian cooking canada', 'indian recipes canada home', 'south asian cooking canada'],
    h1: 'Indian cooking in Canada',
    intro:
      'From Toronto to Vancouver, Indian home cooks balance regional traditions with Canadian grocery stores and long winters. Rasoi helps you plan dinners from your pantry with Canadian partner links rolling out over time.',
    sections: [
      {
        heading: 'Pantry planning in Canadian cities',
        body: 'Indian grocers plus mainstream supermarkets cover most staples. Batch-cook dal and freeze portions; keep atta, rice, and core masalas on hand for quick weeknights.',
      },
    ],
    faqs: [
      {
        question: 'Where is the Canadian Rasoi page?',
        answer: `Visit ${MARKET_PATHS.CA} for Canada-focused guides and FAQs.`,
      },
    ],
    marketId: 'CA',
    relatedLinks: [{ href: MARKET_PATHS.CA, label: 'Rasoi Canada' }],
  },
  {
    slug: 'indian-cooking-in-australia',
    title: 'Indian Cooking in Australia — Home Kitchen Guide | Rasoi',
    description:
      'Indian cooking in Australia — weeknight ideas, pantry match, and Rasoi guides for Sydney, Melbourne, and diaspora home cooks.',
    keywords: ['indian cooking australia', 'indian recipes australia home', 'indian diaspora australia'],
    h1: 'Indian cooking in Australia',
    intro:
      'Australian home cooks often shop Woolworths, Coles, and local Indian grocers. Rasoi helps you decide what to cook tonight from those ingredients — with Australian grocery partner links rolling out over time.',
    sections: [
      {
        heading: 'Weeknight reality in Australian kitchens',
        body: 'Short evenings favour one-pot rice dishes, quick dal, paneer stir-fries, and leftovers done well. Build a rotation your household already enjoys, then expand with regional picks.',
      },
    ],
    faqs: [
      {
        question: 'Where is the Australian Rasoi page?',
        answer: `Visit ${MARKET_PATHS.AU} for Australia-focused guides and FAQs.`,
      },
    ],
    marketId: 'AU',
    relatedLinks: [{ href: MARKET_PATHS.AU, label: 'Rasoi Australia' }],
  },
  {
    slug: 'punjabi-dinner-ideas',
    title: 'Punjabi Dinner Ideas for Home Cooks | Rasoi',
    description:
      'Punjabi dinner ideas — dal, sabzi, roti, and weeknight favourites for Indian home cooking on rasoiapplication.in.',
    keywords: ['punjabi dinner ideas', 'punjabi home cooking', 'punjabi weeknight recipes'],
    h1: 'Punjabi dinner ideas for home cooks',
    intro:
      'Punjabi home dinners often centre on dal, seasonal sabzi, roti, and occasional indulgent favourites like rajma or chole. Rasoi helps match those meals to what is already in your pantry.',
    sections: [
      {
        heading: 'Reliable weeknight rotation',
        body: 'Dal tadka with a dry sabzi, chole with rice on weekends, and paneer dishes when you want something festive-but-fast are practical patterns most families already use.',
      },
    ],
    faqs: [
      {
        question: 'Does Rasoi include Punjabi recipes?',
        answer: 'Yes. Punjabi regional picks are part of Rasoi\'s North Indian and regional filters.',
      },
    ],
    marketId: 'IN',
    relatedLinks: [{ href: '/', label: 'Rasoi India' }, { href: '/recipes/dal-tadka', label: 'Dal tadka' }],
  },
  {
    slug: 'veg-indian-weeknight-recipes',
    title: 'Veg Indian Weeknight Recipes | Rasoi',
    description:
      'Vegetarian Indian weeknight recipes — quick dinners from your pantry on rasoiapplication.in.',
    keywords: ['veg indian weeknight recipes', 'vegetarian indian dinner', 'quick veg indian home cooking'],
    h1: 'Veg Indian weeknight recipes',
    intro:
      'Most Indian home cooking is vegetarian by default. Rasoi makes it easy to filter veg dinners, match pantry items, and skip recipes that need a long ingredient run.',
    sections: [
      {
        heading: 'Fast veg patterns',
        body: 'Dal + rice + one sabzi, vegetable pulao, paneer dishes, and leftover-friendly stir-fries are weeknight winners. Filter under-20-minute tags when time is tight.',
      },
    ],
    faqs: [
      {
        question: 'Can I filter only vegetarian recipes?',
        answer: 'Yes. Rasoi supports Veg, Jain, Egg, and Non-Veg filters across regional cuisines.',
      },
    ],
    marketId: 'IN',
    relatedLinks: [{ href: '/', label: 'Rasoi India' }],
  },
  {
    slug: 'aaj-kya-banaye',
    title: 'आज क्या बनाएं? — Rasoi | Indian Home Cooking',
    description:
      'आज क्या बनाएं? — Rasoi helps Indian home cooks decide dinner from the pantry. Regional recipes, Veg & Jain filters, and home-kitchen guides on rasoiapplication.in.',
    keywords: ['aaj kya banaye', 'aaj kya banaye recipes', 'आज क्या बनाएं', 'indian dinner hindi'],
    h1: 'आज क्या बनाएं? — Rasoi',
    intro:
      'हर शाम एक सवाल: आज क्या बनाएं? Rasoi भारतीय घरों के लिए बना है — जो रसोई में पहले से है उसी से रेसिपी मिलान, क्षेत्रीय व्यंजन, और शाकाहारी / जैन फ़िल्टर के साथ।',
    sections: [
      {
        heading: 'पैंट्री से शुरू करें',
        body: 'दाल, चावल, सब्ज़ी, मसाले और दही से ही ज्यादातर रात के खाने तैयार हो सकते हैं। पहले देखें घर में क्या है, फिर रेसिपी चुनें — खरीदारी की लिस्ट बाद में।',
      },
      {
        heading: 'Rasoi guides in English too',
        body: 'Browse English guides on rasoiapplication.in — dinner ideas, Jain recipes, Gujarati and South Indian weeknights, and regional pages for USA, Canada, and Australia.',
      },
    ],
    faqs: [
      {
        question: 'Rasoi क्या है?',
        answer: 'Rasoi भारतीय घरेलू खाना पकाने में मदद करता है — आज क्या बनाएं, पैंट्री मैच, और क्षेत्रीय रेसिपी के साथ।',
      },
    ],
    marketId: 'IN',
    relatedLinks: [
      { href: '/', label: 'Rasoi India (English)' },
      { href: '/what-to-cook-tonight-indian', label: 'What to cook tonight' },
    ],
  },
];

export const SEO_RECIPE_PAGES: SeoRecipePage[] = [
  {
    slug: 'paneer-butter-masala',
    title: 'Paneer Butter Masala — Indian Home Recipe Guide | Rasoi',
    description:
      'Paneer butter masala for Indian home cooks — ingredients, pantry tips, and weeknight notes on rasoiapplication.in.',
    keywords: ['paneer butter masala recipe', 'paneer butter masala home', 'north indian paneer'],
    h1: 'Paneer butter masala — home kitchen guide',
    intro:
      'Paneer butter masala is a North Indian restaurant favourite that works beautifully at home when you have paneer, tomatoes, cream or milk, and basic masalas. It is a strong weeknight pick when you want something festive without hours of prep.',
    cuisine: 'North Indian',
    diet: 'Veg',
    time: '~35 min',
    sections: [
      {
        heading: 'Pantry check',
        body: 'You need paneer, tomatoes (or puree), onion if your diet allows, ginger-garlic, butter, cream or malai, and garam masala. Kasuri methi at the end makes a big difference.',
      },
      {
        heading: 'Home-cook tips',
        body: 'Do not rush the tomato masala — let it cook until the fat separates. Paneer only needs to simmer briefly so it stays soft. Pair with roti, naan, or jeera rice.',
      },
    ],
    faqs: [
      {
        question: 'Is paneer butter masala good for weeknights?',
        answer: 'Yes, if your pantry already has paneer and tomato base — it is faster than most restaurant-style curries.',
      },
    ],
    relatedLinks: [
      { href: '/what-to-cook-tonight-indian', label: 'What to cook tonight' },
      { href: '/', label: 'Rasoi India' },
    ],
  },
  {
    slug: 'dal-tadka',
    title: 'Dal Tadka — Indian Home Recipe Guide | Rasoi',
    description:
      'Dal tadka at home — toor dal, tempering, and weeknight pairing ideas on rasoiapplication.in.',
    keywords: ['dal tadka recipe', 'dal tadka home cooking', 'indian dal dinner'],
    h1: 'Dal tadka — home kitchen guide',
    intro:
      'Dal tadka is one of the most reliable Indian home dinners. Toor dal, a strong tempering of ghee, cumin, garlic, and red chilli, and rice or roti on the side — simple, comforting, pantry-friendly.',
    cuisine: 'North Indian',
    diet: 'Veg',
    time: '~40 min',
    sections: [
      {
        heading: 'Why it works on busy nights',
        body: 'Dal cooks while you prepare rice or roti. The tadka takes minutes and transforms plain dal into dinner everyone recognizes.',
      },
    ],
    faqs: [
      {
        question: 'Which dal is best for tadka?',
        answer: 'Toor dal is classic; moong or masoor work when that is what you have stocked.',
      },
    ],
    relatedLinks: [{ href: '/punjabi-dinner-ideas', label: 'Punjabi dinner ideas' }],
  },
  {
    slug: 'masala-dosa',
    title: 'Masala Dosa — South Indian Home Guide | Rasoi',
    description:
      'Masala dosa at home — batter, potato filling, and weeknight tips on rasoiapplication.in.',
    keywords: ['masala dosa home', 'south indian dosa guide', 'dosa potato filling'],
    h1: 'Masala dosa — home kitchen guide',
    intro:
      'Masala dosa is a South Indian classic. At home it depends on fermented batter and a simple potato-onion filling. Plan ahead when you can; use store batter when you cannot — dinner still counts.',
    cuisine: 'South Indian',
    diet: 'Veg',
    time: 'Batter + 20 min',
    sections: [
      {
        heading: 'Batter reality',
        body: 'Fermented rice-lentil batter is ideal. Good-quality store batter is a valid weeknight shortcut for diaspora and busy households.',
      },
    ],
    faqs: [
      {
        question: 'Can masala dosa be a weeknight meal?',
        answer: 'Yes if batter is ready — the potato filling and crisping take less time than most North Indian curries.',
      },
    ],
    relatedLinks: [{ href: '/south-indian-weeknight-recipes', label: 'South Indian weeknights' }],
  },
  {
    slug: 'chicken-biryani',
    title: 'Chicken Biryani — Indian Home Recipe Guide | Rasoi',
    description:
      'Chicken biryani at home — layering, rice, and pantry notes for Indian home cooks on rasoiapplication.in.',
    keywords: ['chicken biryani home', 'indian biryani guide', 'weekend biryani home cooking'],
    h1: 'Chicken biryani — home kitchen guide',
    intro:
      'Chicken biryani is often a weekend or special-night dish, but home cooks simplify it with good basmati, marinated chicken, and a reliable dum or one-pot method. Plan sides lightly — raita and salad are enough.',
    cuisine: 'Hyderabadi / Indian',
    diet: 'Non-Veg',
    time: '~90 min',
    sections: [
      {
        heading: 'Prep ahead',
        body: 'Marinate chicken earlier in the day. Soak rice. Measure whole spices once so assembly is calm. Biryani rewards prep more than last-minute rushing.',
      },
    ],
    faqs: [
      {
        question: 'Is biryani realistic for home cooks?',
        answer: 'Yes — especially when you treat it as a planned meal and use a method you have practiced once or twice.',
      },
    ],
    relatedLinks: [{ href: '/what-to-cook-tonight-indian', label: 'Dinner planning' }],
  },
  {
    slug: 'palak-paneer',
    title: 'Palak Paneer — Indian Home Recipe Guide | Rasoi',
    description:
      'Palak paneer at home — spinach, paneer, and weeknight tips on rasoiapplication.in.',
    keywords: ['palak paneer home', 'spinach paneer indian', 'veg north indian dinner'],
    h1: 'Palak paneer — home kitchen guide',
    intro:
      'Palak paneer packs protein and greens into one familiar North Indian dinner. Fresh or frozen spinach works; paneer and cream or yogurt round out the gravy.',
    cuisine: 'North Indian',
    diet: 'Veg',
    time: '~30 min',
    sections: [
      {
        heading: 'Spinach prep',
        body: 'Blanch fresh spinach for bright colour, or thaw frozen blocks — both work. Blend smoothly so kids do not object to texture.',
      },
    ],
    faqs: [
      {
        question: 'Can I use frozen spinach?',
        answer: 'Yes. Many home cooks prefer it for consistency and speed on weeknights.',
      },
    ],
    relatedLinks: [{ href: '/recipes/paneer-butter-masala', label: 'Paneer butter masala' }],
  },
];

const guideBySlug = new Map(SEO_GUIDE_PAGES.map((page) => [page.slug, page]));
const recipeBySlug = new Map(SEO_RECIPE_PAGES.map((page) => [page.slug, page]));

export function getSeoGuidePage(slug: string): SeoGuidePage | undefined {
  return guideBySlug.get(slug);
}

export function getSeoRecipePage(slug: string): SeoRecipePage | undefined {
  return recipeBySlug.get(slug);
}

export function getAllGuideSlugs(): string[] {
  return SEO_GUIDE_PAGES.map((page) => page.slug);
}

export function getAllRecipeSlugs(): string[] {
  return SEO_RECIPE_PAGES.map((page) => page.slug);
}

export function getAllSeoContentPaths(): string[] {
  return [
    '/indian-recipe-app',
    ...SEO_GUIDE_PAGES.map((p) => `/${p.slug}`),
    ...SEO_RECIPE_PAGES.map((p) => `/recipes/${p.slug}`),
  ];
}

export const INDIAN_RECIPE_APP_HUB = {
  path: '/indian-recipe-app',
  title: 'Indian Recipe Guides & Home Cooking | Rasoi',
  description:
    'Indian home cooking guides on rasoiapplication.in — dinner ideas, Jain & veg recipes, regional cuisines, diaspora pages for USA, Canada & Australia, and dish guides from Rasoi.',
  keywords: [
    'indian recipe guides',
    'indian home cooking',
    'indian recipe app',
    'rasoi guides',
    'aaj kya banaye',
  ],
  h1: 'Indian home cooking guides',
  intro:
    'Rasoi publishes practical guides for Indian home cooks — pantry-first dinners, regional cuisines, diaspora kitchens abroad, and favourite dishes explained for real weeknights.',
};
