/**
 * Canonical ingredient names and duplicate variants to merge.
 * Keys are the preferred display/storage name; values are alternate spellings.
 */
export const INGREDIENT_CANONICAL_ALIASES = {
  Adrak: ['Ginger'],
  Lahsun: ['Lasan', 'Lasun', 'Lassan', 'Garlic'],
  'Adrak Lahsun Paste': [
    'Adrak Lasan Paste',
    'Ginger Garlic Paste',
    'Ginger Garlic',
    'Adrak Lehsun Paste',
  ],
  'Hari Mirch': [
    'Green Chilli',
    'Green Chili',
    'Green Chillies',
    'Green Chilies',
    'Mirchi',
    'Hari Mirchi',
    'Mirch',
  ],
  Haldi: ['Turmeric'],
  'Dhania Patta': ['Hara Dhania', 'Coriander Leaves', 'Coriander', 'Fresh Coriander'],
  'Dhania Powder': ['Coriander Powder'],
  Jeera: ['Cumin', 'Cumin Seeds'],
  'Kali Mirch': ['Black Pepper'],
  Rai: ['Mustard Seeds'],
  'Kadi Patta': ['Curry Leaves', 'Curry Patta', 'Kari Patta', 'Kadi Patta'],
  'Nimbu Ras': ['Lemon Juice'],
  Imli: ['Tamarind'],
  Dahi: ['Curd', 'Yogurt'],
  Doodh: ['Milk'],
  Ghee: ['Desi Ghee'],
  Chini: ['Sugar', 'Cheeni'],
  Gud: ['Jaggery', 'Gur'],
  Namak: ['Salt'],
  Tel: ['Oil', 'Cooking Oil', 'Vegetable Oil', 'Refined Oil'],
  'Basmati Chawal': ['Basmati Rice'],
  Chawal: ['Rice'],
  'Chawal Atta': ['Rice Flour'],
  'Gehu Atta': ['Atta', 'Wheat Flour', 'Gahu Atta', 'Gehun Atta'],
  Bajra: ['Pearl Millet', 'Bajri', 'Bajra Grain'],
  'Bajra Atta': ['Bajri Atta', 'Bajra Flour'],
  Ragi: ['Finger Millet', 'Nachni', 'Ragi Flour'],
  Jowar: ['Sorghum', 'Jowar Grain'],
  'Jowar Atta': ['Jowar Flour', 'Sorghum Flour'],
  Millet: ['Mixed Millet', 'Foxtail Millet', 'Proso Millet'],
  Quinoa: ['Quinoa Grain'],
  Oats: ['Oatmeal', 'Rolled Oats'],
  'Brown Rice': ['Brown Chawal', 'Unpolished Rice'],
  Maida: ['All-Purpose Flour', 'All Purpose Flour', 'Refined Flour'],
  Besan: ['Gram Flour'],
  Aloo: ['Bateta', 'Potato'],
  Baingan: ['Brinjal', 'Ringan', 'Vangi', 'Eggplant'],
  Gobhi: ['Gobi', 'Cauliflower'],
  'Patta Gobhi': ['Cabbage', 'Kobi'],
  'Shimla Mirch': ['Capsicum', 'Bell Pepper'],
  Tamatar: ['Tomato'],
  Pyaaz: ['Onion', 'Pyaz'],
  'Moong Dal': ['Split Moong Dal', 'Mung Dal', 'Yellow Moong Dal'],
  'Tuver Dal': ['Toor Dal', 'Arhar Dal', 'Tuvar Dal'],
  'Urad Dal': ['Whole Urad Dal', 'Black Urad Dal'],
  'Masoor Dal': ['Red Lentils', 'Masoor'],
  Chana: ['Chickpeas', 'Kabuli Chana'],
  Mungfali: ['Peanuts', 'Groundnut', 'Peanut', 'Singdana'],
  Nariyal: ['Coconut', 'Fresh Coconut'],
  'Sukha Nariyal': ['Dry Coconut', 'Desiccated Coconut'],
  Saunf: ['Fennel Seeds'],
  Elaichi: ['Cardamom', 'Green Cardamom'],
  'Tej Patta': ['Bay Leaf', 'Bay Leaves'],
  Laung: ['Clove', 'Cloves'],
  'Kasuri Methi': ['Dried Fenugreek Leaves', 'Kasoori Methi'],
  'Lal Mirch Powder': ['Red Chilli Powder', 'Laal Mirch', 'Red Chili Powder', 'Kashmiri Chilli Powder'],
  Hing: ['Asafoetida', 'Heeng'],
  'Garam Masala': ['Garam masala'],
  Palak: ['Spinach', 'Saag'],
  Bhindi: ['Okra', 'Lady Finger', 'Bhendi'],
  Matar: ['Peas', 'Green Peas'],
  Mirch: ['Chilli', 'Chili', 'Chillies', 'Chilies'],
  Methi: ['Fenugreek Leaves', 'Fresh Methi'],
  Paneer: ['Cottage Cheese', 'Indian Cottage Cheese'],
  Butter: ['Makkhan'],
  Cream: ['Malai', 'Fresh Cream'],
  Eggs: ['Egg', 'Anda'],
  Soy: ['Soya', 'Soybean', 'Soy Sauce'],
  Dal: ['Lentils', 'Mixed Dal'],
  Atta: ['Gehu Atta', 'Wheat Flour'],
  'Chana Dal': ['Split Bengal Gram'],
  'Kala Chana': ['Black Chickpeas'],
  'Hara Chana': ['Green Chickpeas'],
  Rajma: ['Kidney Beans', 'Red Kidney Beans'],
  'Sabut Moong': ['Whole Green Moong', 'Green Gram'],
  'Soya Chunks': ['Soya Granules', 'Meal Maker'],
  Karela: ['Bitter Gourd', 'Karela Sabzi'],
  Lauki: ['Bottle Gourd', 'Doodhi', 'Ghiya'],
  Poha: ['Flattened Rice', 'Chivda Rice'],
  Sabudana: ['Sago', 'Tapioca Pearls'],
  Beetroot: ['Beet', 'Chukandar'],
  'Dosa Batter': ['Idli Batter', 'Fermented Batter', 'Rice Batter'],
  'Sweet Corn': ['Corn', 'Makai'],
  Til: ['Sesame Seeds', 'Sesame'],
  Pav: ['Bread', 'Bun'],
} as const satisfies Record<string, readonly string[]>;

/** Common household staples — pre-checked in admin default pantry. */
export const DEFAULT_HOUSEHOLD_PANTRY_STAPLES = [
  'Haldi',
  'Namak',
  'Lal Mirch Powder',
  'Dhania Powder',
  'Jeera',
  'Rai',
  'Hing',
  'Garam Masala',
  'Aloo',
  'Pyaaz',
  'Tamatar',
  'Adrak',
  'Lahsun',
  'Hari Mirch',
] as const;

export type CanonicalIngredientName = keyof typeof INGREDIENT_CANONICAL_ALIASES;

function ingredientLookupKey(name: string): string {
  let key = name.trim().toLowerCase().replace(/\s+/g, ' ');
  key = key
    .replace(/\bchillies\b/g, 'chilli')
    .replace(/\bchilies\b/g, 'chilli')
    .replace(/\bchilis\b/g, 'chili')
    .replace(/\btomatoes\b/g, 'tomato')
    .replace(/\bonions\b/g, 'onion')
    .replace(/\bpotatoes\b/g, 'potato')
    .replace(/\bleaves\b/g, 'leaf')
    .replace(/\beggs\b/g, 'egg');
  return key;
}

const ALIAS_TO_CANONICAL = new Map<string, string>();

for (const [canonical, aliases] of Object.entries(INGREDIENT_CANONICAL_ALIASES)) {
  ALIAS_TO_CANONICAL.set(ingredientLookupKey(canonical), canonical);
  for (const alias of aliases) {
    ALIAS_TO_CANONICAL.set(ingredientLookupKey(alias), canonical);
  }
}

const CANONICAL_ALIAS_KEYS = new Map<string, Set<string>>();

for (const [canonical, aliases] of Object.entries(INGREDIENT_CANONICAL_ALIASES)) {
  const keys = new Set<string>([ingredientLookupKey(canonical)]);
  for (const alias of aliases) {
    keys.add(ingredientLookupKey(alias));
  }
  CANONICAL_ALIAS_KEYS.set(canonical, keys);
}

export function canonicalizeIngredientName(name: string | null | undefined): string {
  if (typeof name !== 'string') return '';
  const trimmed = name.trim();
  if (!trimmed) return trimmed;
  return ALIAS_TO_CANONICAL.get(ingredientLookupKey(trimmed)) ?? trimmed;
}

export function isKnownCanonicalIngredient(name: string): boolean {
  const canonical = canonicalizeIngredientName(name);
  return canonical in INGREDIENT_CANONICAL_ALIASES;
}

export function expandIngredientAliasKeys(name: string): Set<string> {
  const canonical = canonicalizeIngredientName(name);
  const keys = CANONICAL_ALIAS_KEYS.get(canonical);
  if (keys) return new Set(keys);
  return new Set([ingredientLookupKey(name)]);
}

export function listIngredientCanonicalPairs(): { variant: string; canonical: string }[] {
  const pairs: { variant: string; canonical: string }[] = [];
  for (const [canonical, aliases] of Object.entries(INGREDIENT_CANONICAL_ALIASES)) {
    for (const variant of aliases) {
      pairs.push({ variant, canonical });
    }
  }
  return pairs;
}
