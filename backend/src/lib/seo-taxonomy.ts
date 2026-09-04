import type { SeoContentFaq, SeoRecipePage } from '@/lib/seo-content-pages';
import { SEO_RECIPE_PAGES } from '@/lib/seo-content-pages';

export type TaxonomyKind = 'cuisine' | 'ingredient' | 'meal' | 'festival';

export type TaxonomyHub = {
  kind: TaxonomyKind;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: SeoContentFaq[];
  /** Match recipes whose cuisine, slug, h1, or ingredients contain these terms. */
  matchTerms: string[];
  /** Optional explicit recipe slugs to always include. */
  featuredSlugs?: string[];
  relatedHubs: { href: string; label: string }[];
};

function pathFor(kind: TaxonomyKind, slug: string): string {
  return `/${kind}/${slug}`;
}

export const CUISINE_HUBS: TaxonomyHub[] = [
  {
    kind: 'cuisine',
    slug: 'punjabi',
    title: 'Punjabi Recipes — Home Cooking Guide | Rasoi',
    description:
      'Punjabi home cooking — dal tadka, chole bhature, rajma, paratha & more. Authentic weeknight recipes for India and the diaspora on rasoiapplication.in.',
    keywords: ['punjabi recipes', 'punjabi food', 'punjabi dinner', 'north indian punjabi'],
    h1: 'Punjabi recipes for home cooking',
    intro:
      'Punjabi kitchens lean on dal, wheat rotis, paneer, and bold masalas. These are the dishes diaspora families search for most — practical guides with ingredients and method, not restaurant shortcuts.',
    sections: [
      {
        heading: 'What makes Punjabi home cooking distinct',
        body: 'Generous use of onion-tomato bases, tadka dals, stuffed parathas, and chole on weekends. Weeknights favour dal-roti-sabzi; celebrations bring chole bhature and rich paneer gravies.',
      },
      {
        heading: 'Pantry staples for Punjabi cooking',
        body: 'Stock chana dal, toor dal, atta, basmati rice, paneer, chole, jeera, haldi, garam masala, and kasuri methi. Most Punjabi dinners start from these staples.',
      },
    ],
    faqs: [
      {
        question: 'What are easy Punjabi dinners for weeknights?',
        answer: 'Dal tadka with roti, rajma chawal, aloo gobi, and paneer butter masala are reliable Punjabi weeknight picks.',
      },
      {
        question: 'Does Rasoi have Punjabi recipe filters?',
        answer: 'Yes — Rasoi filters by regional cuisine and matches recipes to your pantry so Punjabi dinners use what you already have.',
      },
    ],
    matchTerms: ['punjabi', 'amritsari', 'north indian'],
    featuredSlugs: ['dal-tadka', 'chole-bhature', 'rajma', 'paneer-butter-masala', 'paratha'],
    relatedHubs: [
      { href: '/cuisine/north-indian', label: 'North Indian recipes' },
      { href: '/meal/dinner', label: 'Dinner ideas' },
      { href: '/indian-recipe-app', label: 'All guides' },
    ],
  },
  {
    kind: 'cuisine',
    slug: 'gujarati',
    title: 'Gujarati Recipes — Veg Home Cooking | Rasoi',
    description:
      'Gujarati home cooking — dhokla, thepla, dal dhokli, Jain-friendly picks & weeknight thali ideas for India and abroad.',
    keywords: ['gujarati recipes', 'gujarati food', 'gujarati dinner', 'jain gujarati'],
    h1: 'Gujarati recipes for home cooking',
    intro:
      'Gujarati cooking balances sweet, sour, and spice — with strong Jain and vegetarian traditions. These guides cover the dishes families actually cook, not just festival menus.',
    sections: [
      {
        heading: 'Everyday Gujarati meals',
        body: 'Dal-rice-roti-sabzi with aachar is the weekday rhythm. Dhokla, handvo, and thepla appear for breakfast and tiffin; undhiyu and puran poli mark festivals.',
      },
    ],
    faqs: [
      {
        question: 'Are Gujarati recipes mostly vegetarian?',
        answer: 'Yes — most Gujarati home cooking is vegetarian, with dedicated Jain options that skip onion and garlic.',
      },
    ],
    matchTerms: ['gujarati', 'kathiyawadi', 'surati'],
    featuredSlugs: ['dhokla', 'poha', 'kadhi-pakora'],
    relatedHubs: [
      { href: '/gujarati-dinner-ideas', label: 'Gujarati dinner ideas' },
      { href: '/jain-recipes-indian-home-cooking', label: 'Jain recipes' },
      { href: '/cuisine/north-indian', label: 'North Indian' },
    ],
  },
  {
    kind: 'cuisine',
    slug: 'south-indian',
    title: 'South Indian Recipes — Dosa, Sambar & More | Rasoi',
    description:
      'South Indian home cooking — dosa, idli, sambar, rasam, lemon rice & weeknight tiffin ideas for India and the diaspora.',
    keywords: ['south indian recipes', 'tamil recipes', 'andhra recipes', 'kerala recipes'],
    h1: 'South Indian recipes for home cooking',
    intro:
      'South Indian kitchens run on rice, lentils, coconut, and fermented batters. From Tamil rasam to Andhra spice, these are the most-searched dishes for real weeknights.',
    sections: [
      {
        heading: 'Regional lanes within South Indian cooking',
        body: 'Tamil Nadu favours dosa-idli-sambar; Andhra leans spicier; Kerala uses coconut and seafood; Karnataka bridges Udupi tiffin with Bisi Bele Bath.',
      },
    ],
    faqs: [
      {
        question: 'What South Indian dishes are fastest on weeknights?',
        answer: 'Lemon rice, rasam-rice, vegetable upma, and dosa from ready batter are quick South Indian dinners.',
      },
    ],
    matchTerms: ['south indian', 'tamil', 'andhra', 'kerala', 'karnataka', 'udupi', 'chettinad'],
    featuredSlugs: ['masala-dosa', 'idli', 'sambar', 'rasam', 'lemon-rice', 'medu-vada'],
    relatedHubs: [
      { href: '/south-indian-weeknight-recipes', label: 'South Indian weeknights' },
      { href: '/meal/breakfast', label: 'Breakfast recipes' },
      { href: '/cuisine/tamil', label: 'Tamil recipes' },
    ],
  },
  {
    kind: 'cuisine',
    slug: 'north-indian',
    title: 'North Indian Recipes — Curries, Dal & Roti | Rasoi',
    description:
      'North Indian home cooking — butter chicken, dal makhani, paneer gravies, biryani & roti for India, USA, Canada, Australia & NZ.',
    keywords: ['north indian recipes', 'north indian food', 'north indian curry'],
    h1: 'North Indian recipes for home cooking',
    intro:
      'North Indian home cooking spans Punjab, Delhi, UP, and Rajasthan — rich gravies, tandoori flavours, and everyday dal-roti meals adapted for diaspora kitchens.',
    sections: [
      {
        heading: 'Home vs restaurant North Indian',
        body: 'Home kitchens use less cream and butter than restaurants. These guides focus on achievable weeknight versions with pantry staples.',
      },
    ],
    faqs: [
      {
        question: 'What are the most popular North Indian recipes?',
        answer: 'Butter chicken, dal tadka, paneer butter masala, chole, and chicken biryani top search volume for North Indian home cooking.',
      },
    ],
    matchTerms: ['north indian', 'punjabi', 'delhi', 'lucknowi', 'kashmiri', 'rajasthani'],
    featuredSlugs: ['butter-chicken', 'dal-tadka', 'paneer-butter-masala', 'chicken-biryani'],
    relatedHubs: [
      { href: '/cuisine/punjabi', label: 'Punjabi recipes' },
      { href: '/punjabi-dinner-ideas', label: 'Punjabi dinner ideas' },
      { href: '/meal/dinner', label: 'Dinner ideas' },
    ],
  },
  {
    kind: 'cuisine',
    slug: 'bengali',
    title: 'Bengali Recipes — Fish Curry, Khichuri & Sweets | Rasoi',
    description:
      'Bengali home cooking — macher jhol, khichuri, rasgulla & everyday ranna for India and Bengali diaspora families.',
    keywords: ['bengali recipes', 'bengali food', 'bangla ranna'],
    h1: 'Bengali recipes for home cooking',
    intro:
      'Bengali cooking balances fish, rice, mustard oil, and subtle sweets. These guides cover the dishes Bengali families search for abroad and at home.',
    sections: [
      {
        heading: 'Bengali pantry essentials',
        body: 'Mustard oil, panch phoron, gobindobhog or basmati rice, hilsa or rohu substitutes abroad, and chhana for sweets.',
      },
    ],
    faqs: [
      {
        question: 'What Bengali sweets are easiest at home?',
        answer: 'Rasgulla and payesh (kheer) are the most searched Bengali sweets for home cooks.',
      },
    ],
    matchTerms: ['bengali', 'bangla', 'kolkata'],
    featuredSlugs: ['rasgulla', 'fish-curry', 'khichdi'],
    relatedHubs: [
      { href: '/festival/durga-puja', label: 'Durga Puja recipes' },
      { href: '/meal/lunch', label: 'Lunch ideas' },
      { href: '/indian-recipe-app', label: 'All guides' },
    ],
  },
  {
    kind: 'cuisine',
    slug: 'maharashtrian',
    title: 'Maharashtrian Recipes — Vada Pav, Poha & More | Rasoi',
    description:
      'Maharashtrian home cooking — vada pav, poha, misal, puran poli & Mumbai street-food classics made at home.',
    keywords: ['maharashtrian recipes', 'marathi recipes', 'mumbai food'],
    h1: 'Maharashtrian recipes for home cooking',
    intro:
      'Maharashtrian food ranges from Mumbai street snacks to Konkan seafood and Deshastha brahmins\' everyday varan-bhat. These are the highest-search home versions.',
    sections: [
      {
        heading: 'Mumbai street food at home',
        body: 'Vada pav, pav bhaji, and bhel are weekend favourites — faster than takeaway when your pantry has the basics.',
      },
    ],
    faqs: [
      {
        question: 'What is a classic Maharashtrian breakfast?',
        answer: 'Poha, upma, and misal pav are the most searched Maharashtrian breakfast dishes.',
      },
    ],
    matchTerms: ['maharashtrian', 'marathi', 'mumbai', 'konkan', 'gavran'],
    featuredSlugs: ['vada-pav', 'pav-bhaji', 'poha'],
    relatedHubs: [
      { href: '/meal/breakfast', label: 'Breakfast recipes' },
      { href: '/meal/snacks', label: 'Snack recipes' },
      { href: '/indian-recipe-app', label: 'All guides' },
    ],
  },
  {
    kind: 'cuisine',
    slug: 'hyderabadi',
    title: 'Hyderabadi Recipes — Biryani & Dum Cooking | Rasoi',
    description:
      'Hyderabadi home cooking — dum biryani, haleem, mirchi ka salan & Deccani flavours for India and abroad.',
    keywords: ['hyderabadi recipes', 'hyderabadi biryani', 'telangana food'],
    h1: 'Hyderabadi recipes for home cooking',
    intro:
      'Hyderabadi cuisine blends Mughal technique with Telugu spice — biryani is the flagship dish diaspora cooks search for most.',
    sections: [
      {
        heading: 'Biryani at home vs takeaway',
        body: 'Home biryani uses less oil and simpler dum technique. Start with chicken or veg biryani before attempting festival-scale spreads.',
      },
    ],
    faqs: [
      {
        question: 'What is the difference between Hyderabadi and Lucknowi biryani?',
        answer: 'Hyderabadi biryani is spicier with fried onions and raw marinated meat; Lucknowi (Awadhi) biryani is milder with yakhni.',
      },
    ],
    matchTerms: ['hyderabadi', 'telangana', 'andhra', 'deccan'],
    featuredSlugs: ['hyderabadi-biryani', 'chicken-biryani', 'veg-biryani'],
    relatedHubs: [
      { href: '/cuisine/south-indian', label: 'South Indian' },
      { href: '/ingredient/chicken', label: 'Chicken recipes' },
      { href: '/meal/dinner', label: 'Dinner ideas' },
    ],
  },
  {
    kind: 'cuisine',
    slug: 'tamil',
    title: 'Tamil Recipes — Sambar, Rasam & Tiffin | Rasoi',
    description:
      'Tamil home cooking — sambar, rasam, dosa, idli & Chettinad flavours for Tamil families in India and abroad.',
    keywords: ['tamil recipes', 'tamil samayal', 'tamil food'],
    h1: 'Tamil recipes for home cooking',
    intro:
      'Tamil cooking centres on rice, lentils, and tiffin culture — from everyday sambar-rice to festival payasam.',
    sections: [
      {
        heading: 'Tamil tiffin culture',
        body: 'Idli, dosa, pongal, and upma rotate through the week. Fermented batter prep on weekends powers quick weekday breakfasts.',
      },
    ],
    faqs: [
      {
        question: 'What Tamil dishes work best for diaspora weeknights?',
        answer: 'Sambar-rice, rasam-rice, lemon rice, and dosa from store-bought batter are practical abroad.',
      },
    ],
    matchTerms: ['tamil', 'chettinad', 'madurai'],
    featuredSlugs: ['masala-dosa', 'idli', 'sambar', 'rasam'],
    relatedHubs: [
      { href: '/cuisine/south-indian', label: 'South Indian' },
      { href: '/meal/breakfast', label: 'Breakfast' },
      { href: '/indian-recipe-app', label: 'All guides' },
    ],
  },
  {
    kind: 'cuisine',
    slug: 'goan',
    title: 'Goan Recipes — Fish Curry & Coconut | Rasoi',
    description:
      'Goan home cooking — fish curry, xacuti, vindaloo & Konkani-Catholic flavours for India and abroad.',
    keywords: ['goan recipes', 'goan fish curry', 'konkani food'],
    h1: 'Goan recipes for home cooking',
    intro:
      'Goan food blends Portuguese influence with Konkani spice — coconut, kokum, and seafood define the pantry.',
    sections: [
      {
        heading: 'Goan fish curry basics',
        body: 'Tamarind or kokum sourness, coconut base, and fresh curry leaves — substitute firm white fish abroad when pomfret is unavailable.',
      },
    ],
    faqs: [
      {
        question: 'What fish works for Goan curry abroad?',
        answer: 'Cod, tilapia, or salmon steaks work when Indian pomfret is unavailable — keep coconut and spice ratios authentic.',
      },
    ],
    matchTerms: ['goan', 'konkan', 'konkani'],
    featuredSlugs: ['fish-curry'],
    relatedHubs: [
      { href: '/ingredient/fish', label: 'Fish recipes' },
      { href: '/cuisine/maharashtrian', label: 'Maharashtrian' },
      { href: '/meal/dinner', label: 'Dinner' },
    ],
  },
  {
    kind: 'cuisine',
    slug: 'rajasthani',
    title: 'Rajasthani Recipes — Dal Baati & Desert Cooking | Rasoi',
    description:
      'Rajasthani home cooking — dal baati churma, gatte ki sabzi, ker sangri & Marwari flavours.',
    keywords: ['rajasthani recipes', 'marwari food', 'dal baati'],
    h1: 'Rajasthani recipes for home cooking',
    intro:
      'Rajasthani cooking adapts to arid climate — lentils, millets, dried vegetables, and generous ghee define the table.',
    sections: [
      {
        heading: 'Marwari vegetarian traditions',
        body: 'Many Rajasthani homes are strictly vegetarian with inventive use of dried ker, sangri, and gram flour gatte.',
      },
    ],
    faqs: [
      {
        question: 'What is a famous Rajasthani festival meal?',
        answer: 'Dal baati churma is the signature Rajasthani dish for celebrations and weekend feasts.',
      },
    ],
    matchTerms: ['rajasthani', 'marwari', 'jaipur'],
    featuredSlugs: ['rogan-josh', 'dal-tadka'],
    relatedHubs: [
      { href: '/cuisine/north-indian', label: 'North Indian' },
      { href: '/jain-recipes-indian-home-cooking', label: 'Jain recipes' },
      { href: '/indian-recipe-app', label: 'All guides' },
    ],
  },
  {
    kind: 'cuisine',
    slug: 'kashmiri',
    title: 'Kashmiri Recipes — Rogan Josh & Wazwan Flavours | Rasoi',
    description:
      'Kashmiri home cooking — rogan josh, yakhni, dum aloo & Pandit/Wazwan traditions.',
    keywords: ['kashmiri recipes', 'kashmiri food', 'rogan josh recipe'],
    h1: 'Kashmiri recipes for home cooking',
    intro:
      'Kashmiri cuisine is known for aromatic spices, slow-cooked meat, and saffron — rogan josh leads search volume for home cooks.',
    sections: [
      {
        heading: 'Kashmiri spice profile',
        body: 'Fennel, dry ginger, cardamom, and Kashmiri chilli give the cuisine its colour and warmth without extreme heat.',
      },
    ],
    faqs: [
      {
        question: 'Is rogan josh difficult at home?',
        answer: 'Home rogan josh is achievable in one pot — brown meat well, slow-cook with yogurt and Kashmiri chilli for colour.',
      },
    ],
    matchTerms: ['kashmiri', 'wazwan'],
    featuredSlugs: ['rogan-josh'],
    relatedHubs: [
      { href: '/cuisine/north-indian', label: 'North Indian' },
      { href: '/ingredient/mutton', label: 'Mutton recipes' },
      { href: '/meal/dinner', label: 'Dinner' },
    ],
  },
  {
    kind: 'cuisine',
    slug: 'andhra',
    title: 'Andhra Recipes — Spicy Curries & Pulusu | Rasoi',
    description:
      'Andhra home cooking — spicy chicken curry, gongura, pesarattu & Telugu flavours for India and diaspora.',
    keywords: ['andhra recipes', 'telugu food', 'andhra chicken curry'],
    h1: 'Andhra recipes for home cooking',
    intro:
      'Andhra Pradesh is known for bold chilli heat, tangy pulusu, and tiffin items like pesarattu — these guides cover home-kitchen versions.',
    sections: [
      {
        heading: 'Managing Andhra spice at home',
        body: 'Reduce chilli count for children while keeping tamarind and curry-leaf base authentic.',
      },
    ],
    faqs: [
      {
        question: 'What Andhra dish is best for beginners?',
        answer: 'Tomato pulusu with rice or simple Andhra chicken curry are approachable starting points.',
      },
    ],
    matchTerms: ['andhra', 'telugu', 'guntur'],
    featuredSlugs: ['chicken-curry', 'masala-dosa'],
    relatedHubs: [
      { href: '/cuisine/south-indian', label: 'South Indian' },
      { href: '/cuisine/hyderabadi', label: 'Hyderabadi' },
      { href: '/meal/dinner', label: 'Dinner' },
    ],
  },
];

export const INGREDIENT_HUBS: TaxonomyHub[] = [
  hub('ingredient', 'paneer', 'Paneer Recipes', 'paneer', ['paneer'], ['paneer-butter-masala', 'palak-paneer', 'shahi-paneer', 'paneer-tikka', 'malai-kofta']),
  hub('ingredient', 'chicken', 'Chicken Recipes', 'chicken', ['chicken'], ['butter-chicken', 'chicken-biryani', 'chicken-tikka-masala', 'tandoori-chicken', 'chicken-curry']),
  hub('ingredient', 'potato', 'Potato Recipes', 'potato', ['potato', 'aloo'], ['aloo-gobi', 'pav-bhaji', 'chole-bhature']),
  hub('ingredient', 'rice', 'Rice Recipes', 'rice', ['rice', 'chawal', 'biryani', 'pulao'], ['chicken-biryani', 'jeera-rice', 'lemon-rice', 'vegetable-pulao', 'khichdi']),
  hub('ingredient', 'dal', 'Dal Recipes', 'dal', ['dal', 'lentil'], ['dal-tadka', 'sambar', 'khichdi', 'chana-dal']),
  hub('ingredient', 'chana', 'Chana Recipes', 'chana', ['chana', 'chickpea', 'chole'], ['chole-bhature', 'chana-masala', 'chana-dal']),
  hub('ingredient', 'egg', 'Egg Recipes', 'egg', ['egg', 'anda'], ['egg-curry']),
  hub('ingredient', 'fish', 'Fish Recipes', 'fish', ['fish', 'macher'], ['fish-curry']),
  hub('ingredient', 'mutton', 'Mutton Recipes', 'mutton', ['mutton', 'lamb', 'gosht'], ['mutton-biryani', 'mutton-curry', 'rogan-josh']),
  hub('ingredient', 'spinach', 'Spinach Recipes', 'spinach', ['spinach', 'palak'], ['palak-paneer']),
  hub('ingredient', 'tomato', 'Tomato Recipes', 'tomato', ['tomato'], ['paneer-butter-masala', 'rasam']),
  hub('ingredient', 'cauliflower', 'Cauliflower Recipes', 'cauliflower', ['cauliflower', 'gobi'], ['aloo-gobi']),
];

export const MEAL_HUBS: TaxonomyHub[] = [
  mealHub('breakfast', 'Breakfast Recipes', ['dosa', 'idli', 'poha', 'upma', 'paratha', 'dhokla', 'medu-vada'], ['masala-dosa', 'idli', 'poha', 'upma', 'paratha', 'dhokla']),
  mealHub('lunch', 'Lunch Recipes', ['dal', 'rice', 'roti', 'khichdi', 'sambar', 'rajma'], ['dal-tadka', 'rajma', 'khichdi', 'sambar', 'lemon-rice']),
  mealHub('dinner', 'Dinner Recipes', ['curry', 'biryani', 'paneer', 'chicken', 'sabzi'], ['butter-chicken', 'paneer-butter-masala', 'chicken-biryani', 'dal-tadka', 'chana-masala']),
  mealHub('snacks', 'Snack Recipes', ['samosa', 'vada', 'puri', 'chaat', 'bhaji'], ['samosa', 'vada-pav', 'pav-bhaji', 'pani-puri', 'bhel-puri', 'chole-bhature']),
];

export const FESTIVAL_HUBS: TaxonomyHub[] = [
  festivalHub('diwali', 'Diwali Recipes', 'Diwali sweets and snacks', ['gulab-jamun', 'jalebi', 'ladoo', 'kheer', 'samosa', 'dhokla']),
  festivalHub('navratri', 'Navratri Recipes', 'Navratri fasting foods', ['sabudana', 'kuttu', 'singhara', 'khichdi', 'dhokla', 'fruit']),
  festivalHub('holi', 'Holi Recipes', 'Holi snacks and thandai', ['gujiya', 'thandai', 'pakora', 'chaat', 'samosa', 'pani-puri']),
  festivalHub('eid', 'Eid Recipes', 'Eid biryani and feast dishes', ['biryani', 'korma', 'sheer', 'kebab', 'mutton', 'seviyan']),
  festivalHub('christmas', 'Christmas Recipes', 'Indian Christmas favourites', ['cake', 'roast', 'biryani', 'kheer', 'stew']),
  festivalHub('durga-puja', 'Durga Puja Recipes', 'Bengali festival dishes', ['khichuri', 'rasgulla', 'fish', 'luchi', 'payesh']),
  festivalHub('ganesh-chaturthi', 'Ganesh Chaturthi Recipes', 'Maharashtrian festival modak and treats', ['modak', 'puran', 'ladoo', 'poha']),
  festivalHub('onam', 'Onam Recipes', 'Kerala Onam sadya dishes', ['sambar', 'payasam', 'avial', 'pappadam', 'rice']),
];

function hub(
  kind: TaxonomyKind,
  slug: string,
  label: string,
  term: string,
  matchTerms: string[],
  featuredSlugs: string[],
): TaxonomyHub {
  return {
    kind,
    slug,
    title: `${label} — Indian Home Cooking | Rasoi`,
    description: `Indian ${label.toLowerCase()} with ingredients, method & pantry tips — home cooking guides for India, USA, Canada, Australia & NZ on rasoiapplication.in.`,
    keywords: [`${term} recipes`, `indian ${term} recipes`, `${term} recipe indian`, `recipes with ${term}`],
    h1: `${label} for Indian home cooking`,
    intro: `Cooking with ${term} is central to Indian home kitchens. These are the highest-search ${term} recipes — with practical ingredients lists and diaspora tips.`,
    sections: [
      {
        heading: `How Indian home cooks use ${term}`,
        body: `${label} appear across regional cuisines — from everyday dal-rice meals to festival spreads. Rasoi matches ${term}-based recipes to your pantry.`,
      },
    ],
    faqs: [
      {
        question: `What are popular Indian recipes with ${term}?`,
        answer: `Browse our top ${term} recipe guides below — each includes ingredients, method, and tips for cooking in India and abroad.`,
      },
      {
        question: 'Does Rasoi filter recipes by ingredient?',
        answer: 'Yes — add your pantry in the Rasoi app and see match percentages for recipes that use ingredients you already have.',
      },
    ],
    matchTerms,
    featuredSlugs,
    relatedHubs: [
      { href: '/recipes', label: 'All recipe guides' },
      { href: '/meal/dinner', label: 'Dinner ideas' },
      { href: '/indian-recipe-app', label: 'Cooking guides' },
    ],
  };
}

function mealHub(
  slug: string,
  label: string,
  matchTerms: string[],
  featuredSlugs: string[],
): TaxonomyHub {
  const meal = slug as 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  const intros: Record<string, string> = {
    breakfast: 'Indian breakfasts range from South Indian tiffin to North Indian paratha — quick, filling, and pantry-friendly.',
    lunch: 'Indian lunch is often dal-rice, roti-sabzi, or regional one-pot meals — practical for work-from-home and tiffin boxes.',
    dinner: 'Dinner is when "aaj kya banaye?" matters most — these are the highest-search Indian dinner recipes for home cooks.',
    snacks: 'Indian snacks — samosa, chaat, vada pav — bridge tea time and unexpected guests.',
  };
  return {
    kind: 'meal',
    slug,
    title: `Indian ${label} — Home Cooking Ideas | Rasoi`,
    description: `Indian ${meal} ideas — regional recipes, pantry tips & diaspora guides for India, USA, Canada, Australia & NZ.`,
    keywords: [`indian ${meal} recipes`, `indian ${meal} ideas`, `${meal} recipes india`],
    h1: `Indian ${label.toLowerCase()}`,
    intro: intros[meal] ?? '',
    sections: [
      {
        heading: `Planning Indian ${meal} from your pantry`,
        body: 'Start with staples — rice, dal, atta, eggs, paneer, potatoes — and pick a regional lane for the day. Rasoi shows match percentages so you cook from what you have.',
      },
    ],
    faqs: [
      {
        question: `What are quick Indian ${meal} options?`,
        answer: `See our top ${meal} recipe guides below — filtered for home kitchens, not restaurant prep.`,
      },
    ],
    matchTerms,
    featuredSlugs,
    relatedHubs: [
      { href: '/what-to-cook-tonight-indian', label: 'What to cook tonight' },
      { href: '/recipes', label: 'Recipe guides' },
      { href: '/download', label: 'Download Rasoi' },
    ],
  };
}

function festivalHub(
  slug: string,
  label: string,
  intro: string,
  featuredSlugs: string[],
): TaxonomyHub {
  return {
    kind: 'festival',
    slug,
    title: `${label} — Indian Festival Cooking | Rasoi`,
    description: `${label} — sweets, snacks & feast dishes for Indian home cooks in India and the diaspora.`,
    keywords: [`${slug} recipes`, `indian ${slug} food`, `${slug} sweets`],
    h1: label,
    intro,
    sections: [
      {
        heading: 'Festival cooking from your pantry',
        body: 'Festival menus do not need restaurant prep — plan sweets and savouries from staples you already stock, and prep a day ahead where possible.',
      },
    ],
    faqs: [
      {
        question: `What dishes are essential for ${label}?`,
        answer: 'Browse our curated recipe guides below — each includes ingredients and method for home kitchens.',
      },
    ],
    matchTerms: [slug, label.toLowerCase()],
    featuredSlugs,
    relatedHubs: [
      { href: '/recipes', label: 'All recipes' },
      { href: '/indian-recipe-app', label: 'Guides hub' },
      { href: '/download', label: 'Get Rasoi app' },
    ],
  };
}

export const ALL_TAXONOMY_HUBS: TaxonomyHub[] = [
  ...CUISINE_HUBS,
  ...INGREDIENT_HUBS,
  ...MEAL_HUBS,
  ...FESTIVAL_HUBS,
];

const hubByKey = new Map(ALL_TAXONOMY_HUBS.map((h) => [`${h.kind}/${h.slug}`, h]));

export function getTaxonomyHub(kind: TaxonomyKind, slug: string): TaxonomyHub | undefined {
  return hubByKey.get(`${kind}/${slug}`);
}

export function getAllTaxonomyParams(): { kind: TaxonomyKind; slug: string }[] {
  return ALL_TAXONOMY_HUBS.map((h) => ({ kind: h.kind, slug: h.slug }));
}

export function getTaxonomyPath(hub: TaxonomyHub): string {
  return pathFor(hub.kind, hub.slug);
}

function recipeMatchesHub(recipe: SeoRecipePage, hub: TaxonomyHub): boolean {
  if (hub.featuredSlugs?.includes(recipe.slug)) return true;
  const haystack = [
    recipe.slug,
    recipe.h1,
    recipe.cuisine,
    recipe.diet,
    ...(recipe.ingredients ?? []),
    ...(recipe.keywords ?? []),
  ]
    .join(' ')
    .toLowerCase();
  return hub.matchTerms.some((term) => haystack.includes(term.toLowerCase()));
}

export function getRecipesForHub(hub: TaxonomyHub, limit = 12): SeoRecipePage[] {
  const featured = (hub.featuredSlugs ?? [])
    .map((slug) => SEO_RECIPE_PAGES.find((r) => r.slug === slug))
    .filter((r): r is SeoRecipePage => Boolean(r));

  const featuredSet = new Set(featured.map((r) => r.slug));
  const matched = SEO_RECIPE_PAGES.filter(
    (r) => !featuredSet.has(r.slug) && recipeMatchesHub(r, hub),
  ).sort((a, b) => (a.searchVolumeRank ?? 999) - (b.searchVolumeRank ?? 999));

  return [...featured, ...matched].slice(0, limit);
}

export function getAllTaxonomyPaths(): string[] {
  return ALL_TAXONOMY_HUBS.map((h) => getTaxonomyPath(h));
}

/** Enrich recipe related links with taxonomy hubs for internal linking. */
export function enrichRecipeRelatedLinks(
  recipe: SeoRecipePage,
  existing: { href: string; label: string }[],
): { href: string; label: string }[] {
  const seen = new Set(existing.map((l) => l.href));
  const extra: { href: string; label: string }[] = [];

  const cuisineSlug = recipe.cuisine.toLowerCase().replace(/\s+indian$/i, '').replace(/\s+/g, '-');
  const cuisineHub = CUISINE_HUBS.find((h) => h.slug === cuisineSlug || recipe.cuisine.toLowerCase().includes(h.slug));
  if (cuisineHub) {
    const href = getTaxonomyPath(cuisineHub);
    if (!seen.has(href)) {
      extra.push({ href, label: `${cuisineHub.h1.replace(/ for.*/, '')}` });
      seen.add(href);
    }
  }

  for (const ing of INGREDIENT_HUBS.slice(0, 20)) {
    if (recipeMatchesHub(recipe, ing)) {
      const href = getTaxonomyPath(ing);
      if (!seen.has(href)) {
        extra.push({ href, label: ing.h1.replace(/ for.*/, '') });
        seen.add(href);
        if (extra.length >= 3) break;
      }
    }
  }

  if (!seen.has('/meal/dinner')) {
    extra.push({ href: '/meal/dinner', label: 'Dinner ideas' });
  }

  return [...existing, ...extra].slice(0, 10);
}
