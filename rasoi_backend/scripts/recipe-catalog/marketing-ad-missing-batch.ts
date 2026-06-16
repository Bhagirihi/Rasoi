/**
 * Marketing ad missing dishes — 50 variants each for recipes cited in
 * docs/marketing/AD_IMAGE_PROMPTS.md that were absent or weak in the catalog.
 */
import type { RecipeCatalogEntry } from './types';

const VARIANT_PREFIXES = [
  'Home-style',
  'Dhaba',
  'Quick',
  'Festive',
  'Royal',
  'Smoky',
  'Mumbai',
  'Delhi',
  'Punjabi-style',
  'South Indian',
  'Gujarati',
  'Bengali',
  'Chennai',
  'Hyderabadi',
  'Lucknowi',
  'Amritsari',
  'Kolkata',
  'Bangalore',
  'Jaipur',
  'Udaipur',
  'Monsoon',
  'Winter',
  'Summer',
  'Temple',
  'Street-style',
  'Hotel-style',
  'Grand',
  'Mini',
  'Family',
  'Chef',
  'Classic',
  'Premium',
  'Lite',
  'Spicy',
  'Mild',
  'Crispy',
  'Soft',
  'Buttery',
  'Tawa',
  'Pressure-cooker',
  'One-pot',
  'Weeknight',
  'Sunday',
  'Party',
  'Comfort',
  'Healthy',
  'Traditional',
  'Modern',
  "Grandma's",
  'Rasoi',
] as const;

type MissingDishConfig = {
  baseTitle: string;
  slug: string;
  kitchenStyleId: string;
  kitchenStyleIds?: string[];
  region: string;
  descriptionPrefix: string;
  dietType: RecipeCatalogEntry['dietType'];
  ingredients: Array<{ name: string; isStaple: boolean }>;
};

const MISSING_DISHES: MissingDishConfig[] = [
  {
    baseTitle: 'Bread Poha',
    slug: 'bread-poha',
    kitchenStyleId: 'street',
    kitchenStyleIds: ['street', 'maharashtrian'],
    region: 'West',
    descriptionPrefix: 'a quick snack using leftover bread tossed with poha-style tempering and peanuts.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Bread', isStaple: false },
      { name: 'Pyaaz', isStaple: true },
      { name: 'Hari mirch', isStaple: true },
      { name: 'Rai', isStaple: true },
      { name: 'Kadi patta', isStaple: true },
      { name: 'Mungfali', isStaple: true },
    ],
  },
  {
    baseTitle: 'Bread Upma',
    slug: 'bread-upma',
    kitchenStyleId: 'south',
    region: 'South',
    descriptionPrefix: 'crumbled bread upma with mustard, curry leaves, and mild South Indian spice.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Bread', isStaple: false },
      { name: 'Pyaaz', isStaple: true },
      { name: 'Rai', isStaple: true },
      { name: 'Urad dal', isStaple: true },
      { name: 'Kadi patta', isStaple: true },
      { name: 'Hari mirch', isStaple: true },
    ],
  },
  {
    baseTitle: 'Jain Pav Bhaji',
    slug: 'jain-pav-bhaji',
    kitchenStyleId: 'gujarati',
    kitchenStyleIds: ['gujarati', 'street'],
    region: 'West',
    descriptionPrefix: 'a Jain-friendly pav bhaji without onion or garlic, rich in tomato and capsicum.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Aloo', isStaple: true },
      { name: 'Tamatar', isStaple: true },
      { name: 'Shimla mirch', isStaple: true },
      { name: 'Matar', isStaple: true },
      { name: 'Pav', isStaple: false },
      { name: 'Bhaji masala', isStaple: true },
    ],
  },
  {
    baseTitle: 'Cheese Dosa',
    slug: 'cheese-dosa',
    kitchenStyleId: 'south',
    region: 'South',
    descriptionPrefix: 'a crispy dosa folded with melted cheese and mild masala potato filling.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Dosa batter', isStaple: false },
      { name: 'Cheese', isStaple: false },
      { name: 'Aloo', isStaple: true },
      { name: 'Pyaaz', isStaple: true },
      { name: 'Masala', isStaple: true },
      { name: 'Nariyal chutney', isStaple: true },
    ],
  },
  {
    baseTitle: 'Gulab Jamun',
    slug: 'gulab-jamun',
    kitchenStyleId: 'north',
    kitchenStyleIds: ['north', 'punjabi'],
    region: 'North',
    descriptionPrefix: 'soft milk-solid dumplings soaked in cardamom rose syrup.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Mawa', isStaple: false },
      { name: 'Maida', isStaple: true },
      { name: 'Chini', isStaple: true },
      { name: 'Elaichi', isStaple: true },
      { name: 'Gulab jal', isStaple: false },
      { name: 'Ghee', isStaple: true },
    ],
  },
  {
    baseTitle: 'Rava Idli',
    slug: 'rava-idli',
    kitchenStyleId: 'south',
    region: 'South',
    descriptionPrefix: 'soft semolina idlis tempered with mustard and cashews, no overnight ferment.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Rava', isStaple: true },
      { name: 'Dahi', isStaple: true },
      { name: 'Rai', isStaple: true },
      { name: 'Kadi patta', isStaple: true },
      { name: 'Kaju', isStaple: true },
      { name: 'Hing', isStaple: true },
    ],
  },
  {
    baseTitle: 'Medu Vada',
    slug: 'medu-vada',
    kitchenStyleId: 'south',
    region: 'South',
    descriptionPrefix: 'crisp urad dal vadas with fluffy centre, classic South Indian breakfast.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Urad dal', isStaple: true },
      { name: 'Hari mirch', isStaple: true },
      { name: 'Kadi patta', isStaple: true },
      { name: 'Kali mirch', isStaple: true },
      { name: 'Hing', isStaple: true },
      { name: 'Oil', isStaple: true },
    ],
  },
  {
    baseTitle: 'Jeera Rice',
    slug: 'jeera-rice',
    kitchenStyleId: 'north',
    kitchenStyleIds: ['north', 'punjabi'],
    region: 'North',
    descriptionPrefix: 'fragrant basmati rice tempered with cumin and whole spices.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Basmati chawal', isStaple: true },
      { name: 'Jeera', isStaple: true },
      { name: 'Ghee', isStaple: true },
      { name: 'Tej patta', isStaple: true },
      { name: 'Elaichi', isStaple: true },
      { name: 'Namak', isStaple: true },
    ],
  },
  {
    baseTitle: 'Dal Fry',
    slug: 'dal-fry',
    kitchenStyleId: 'punjabi',
    kitchenStyleIds: ['punjabi', 'north'],
    region: 'North',
    descriptionPrefix: 'restaurant-style tempered dal finished with butter and kasuri methi.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Toor dal', isStaple: true },
      { name: 'Makhan', isStaple: true },
      { name: 'Lahsun', isStaple: true },
      { name: 'Kasuri methi', isStaple: true },
      { name: 'Haldi', isStaple: true },
      { name: 'Jeera', isStaple: true },
    ],
  },
  {
    baseTitle: 'Paneer Pulao',
    slug: 'paneer-pulao',
    kitchenStyleId: 'north',
    region: 'North',
    descriptionPrefix: 'aromatic rice cooked with paneer cubes and whole garam masala.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Basmati chawal', isStaple: true },
      { name: 'Paneer', isStaple: false },
      { name: 'Pyaaz', isStaple: true },
      { name: 'Ghee', isStaple: true },
      { name: 'Elaichi', isStaple: true },
      { name: 'Tej patta', isStaple: true },
    ],
  },
  {
    baseTitle: 'Paneer Biryani',
    slug: 'paneer-biryani',
    kitchenStyleId: 'hyderabadi',
    kitchenStyleIds: ['hyderabadi', 'north'],
    region: 'South',
    descriptionPrefix: 'layered dum biryani with marinated paneer and saffron rice.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Basmati chawal', isStaple: true },
      { name: 'Paneer', isStaple: false },
      { name: 'Dahi', isStaple: true },
      { name: 'Fried pyaaz', isStaple: true },
      { name: 'Kesar', isStaple: false },
      { name: 'Biryani masala', isStaple: true },
    ],
  },
  {
    baseTitle: 'High-Protein Khichdi',
    slug: 'high-protein-khichdi',
    kitchenStyleId: 'gujarati',
    kitchenStyleIds: ['gujarati', 'punjabi'],
    region: 'West',
    descriptionPrefix: 'a protein-forward khichdi with moong dal, quinoa, and paneer crumble.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Moong dal', isStaple: true },
      { name: 'Chawal', isStaple: true },
      { name: 'Paneer', isStaple: false },
      { name: 'Haldi', isStaple: true },
      { name: 'Jeera', isStaple: true },
      { name: 'Ghee', isStaple: true },
    ],
  },
  {
    baseTitle: 'Moong Dal Soup',
    slug: 'moong-dal-soup',
    kitchenStyleId: 'gujarati',
    kitchenStyleIds: ['gujarati', 'south'],
    region: 'West',
    descriptionPrefix: 'a light blended moong dal soup with ginger and black pepper.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Moong dal', isStaple: true },
      { name: 'Adrak', isStaple: true },
      { name: 'Kali mirch', isStaple: true },
      { name: 'Haldi', isStaple: true },
      { name: 'Hari mirch', isStaple: true },
      { name: 'Dhania patta', isStaple: true },
    ],
  },
  {
    baseTitle: 'Soya Chunk Curry',
    slug: 'soya-chunk-curry',
    kitchenStyleId: 'north',
    kitchenStyleIds: ['north', 'street'],
    region: 'North',
    descriptionPrefix: 'soya chunks simmered in onion-tomato masala gravy, hearty and protein-rich.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Soya chunks', isStaple: false },
      { name: 'Pyaaz', isStaple: true },
      { name: 'Tamatar', isStaple: true },
      { name: 'Adrak', isStaple: true },
      { name: 'Lahsun', isStaple: true },
      { name: 'Garam masala', isStaple: true },
    ],
  },
  {
    baseTitle: 'Dal Tadka',
    slug: 'dal-tadka',
    kitchenStyleId: 'punjabi',
    kitchenStyleIds: ['punjabi', 'north'],
    region: 'North',
    descriptionPrefix: 'yellow dal finished with a smoky garlic-cumin tadka.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Toor dal', isStaple: true },
      { name: 'Moong dal', isStaple: true },
      { name: 'Lahsun', isStaple: true },
      { name: 'Jeera', isStaple: true },
      { name: 'Hari mirch', isStaple: true },
      { name: 'Hing', isStaple: true },
    ],
  },
  {
    baseTitle: 'Vegetable Pulao',
    slug: 'vegetable-pulao',
    kitchenStyleId: 'north',
    kitchenStyleIds: ['north', 'chettinad'],
    region: 'North',
    descriptionPrefix: 'one-pot vegetable pulao with seasonal mix and whole spices.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Basmati chawal', isStaple: true },
      { name: 'Mixed vegetables', isStaple: true },
      { name: 'Pyaaz', isStaple: true },
      { name: 'Jeera', isStaple: true },
      { name: 'Elaichi', isStaple: true },
      { name: 'Ghee', isStaple: true },
    ],
  },
  {
    baseTitle: 'Gujarati Handvo',
    slug: 'gujarati-handvo',
    kitchenStyleId: 'gujarati',
    region: 'West',
    descriptionPrefix: 'a savoury baked lentil cake with bottle gourd and sesame crust.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Rice', isStaple: true },
      { name: 'Chana dal', isStaple: true },
      { name: 'Lauki', isStaple: true },
      { name: 'Dahi', isStaple: true },
      { name: 'Til', isStaple: true },
      { name: 'Hing', isStaple: true },
    ],
  },
  {
    baseTitle: 'Rajma Chawal',
    slug: 'rajma-chawal',
    kitchenStyleId: 'punjabi',
    region: 'North',
    descriptionPrefix: 'classic Punjabi kidney bean curry served with steamed basmati rice.',
    dietType: 'Veg',
    ingredients: [
      { name: 'Rajma', isStaple: true },
      { name: 'Basmati chawal', isStaple: true },
      { name: 'Pyaaz', isStaple: true },
      { name: 'Tamatar', isStaple: true },
      { name: 'Adrak', isStaple: true },
      { name: 'Rajma masala', isStaple: true },
    ],
  },
  {
    baseTitle: 'Chicken Kosha',
    slug: 'chicken-kosha',
    kitchenStyleId: 'bengali',
    region: 'East',
    descriptionPrefix: 'slow-cooked Bengali-style chicken kosha with mustard oil and warm spices.',
    dietType: 'Non-Veg',
    ingredients: [
      { name: 'Chicken', isStaple: false },
      { name: 'Pyaaz', isStaple: true },
      { name: 'Adrak', isStaple: true },
      { name: 'Lahsun', isStaple: true },
      { name: 'Sarson tel', isStaple: true },
      { name: 'Garam masala', isStaple: true },
    ],
  },
  {
    baseTitle: 'Prawn Malai',
    slug: 'prawn-malai',
    kitchenStyleId: 'bengali',
    kitchenStyleIds: ['bengali', 'goan'],
    region: 'East',
    descriptionPrefix: 'prawns in creamy coconut-milk gravy with mild Bengali spicing.',
    dietType: 'Non-Veg',
    ingredients: [
      { name: 'Prawns', isStaple: false },
      { name: 'Nariyal milk', isStaple: false },
      { name: 'Pyaaz', isStaple: true },
      { name: 'Adrak', isStaple: true },
      { name: 'Haldi', isStaple: true },
      { name: 'Hari mirch', isStaple: true },
    ],
  },
];

function toImageKeyword(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function inferDifficulty(idx: number): RecipeCatalogEntry['difficulty'] {
  if (idx % 11 === 0) return 'Hard';
  if (idx % 2 === 0) return 'Medium';
  return 'Easy';
}

function inferTags(prepTime: number, idx: number): string[] {
  const tags = new Set<string>();
  if (prepTime <= 20) tags.add('under20');
  tags.add('quick');
  if (idx % 4 === 0) tags.add('kids');
  if (idx % 5 === 0) tags.add('leftover');
  if (idx % 7 === 0) tags.add('festive');
  return [...tags];
}

function stepsFor(title: string): string[] {
  return [
    `Prepare and portion ingredients for ${title.toLowerCase()}.`,
    'Cook the base tempering until aromatic and balanced.',
    'Add hero ingredients and cook on medium heat until the dish comes together.',
    'Finish with garnish and serve hot.',
  ];
}

function buildVariantsForDish(config: MissingDishConfig): RecipeCatalogEntry[] {
  return VARIANT_PREFIXES.map((prefix, idx) => {
    const title = idx === 0 ? config.baseTitle : `${prefix} ${config.baseTitle}`;
    const prepTime = 12 + (idx % 14) * 2;

    return {
      id: `ad-mkt-${config.slug}-${String(idx + 1).padStart(2, '0')}`,
      kitchenStyleId: config.kitchenStyleId,
      ...(config.kitchenStyleIds ? { kitchenStyleIds: config.kitchenStyleIds } : {}),
      title,
      prepTime,
      calories: 220 + (idx % 12) * 25,
      region: config.region,
      dietType: config.dietType,
      difficulty: inferDifficulty(idx),
      description: `${title} — ${config.descriptionPrefix}`,
      imageKeyword: toImageKeyword(title),
      tags: inferTags(prepTime, idx),
      ingredients: config.ingredients,
      steps: stepsFor(title),
    };
  });
}

export const MARKETING_AD_MISSING_RECIPES: RecipeCatalogEntry[] = MISSING_DISHES.flatMap(
  buildVariantsForDish,
);

export const MARKETING_AD_MISSING_DISH_COUNT = MISSING_DISHES.length;
export const MARKETING_AD_MISSING_VARIANTS_PER_DISH = VARIANT_PREFIXES.length;
export const MARKETING_AD_MISSING_TOTAL = MARKETING_AD_MISSING_RECIPES.length;
