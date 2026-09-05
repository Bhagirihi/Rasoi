/** Expand common Indian ingredient/dish synonyms for search. */
const SEARCH_SYNONYMS: Record<string, string[]> = {
  curd: ['dahi', 'yogurt', 'yoghurt'],
  dahi: ['curd', 'yogurt'],
  yogurt: ['dahi', 'curd'],
  brinjal: ['baingan', 'eggplant'],
  baingan: ['brinjal', 'eggplant'],
  eggplant: ['baingan', 'brinjal'],
  capsicum: ['shimla mirch', 'bell pepper'],
  coriander: ['dhania', 'hara dhania'],
  dhania: ['coriander'],
  chickpea: ['chana', 'chole'],
  chana: ['chickpea', 'chole'],
  chole: ['chickpea', 'chana'],
  cottage: ['paneer'],
  paneer: ['cottage cheese', 'पनीर'],
  okra: ['bhindi'],
  bhindi: ['okra', 'भिंडी', 'भिन्दी'],
  lentil: ['dal', 'daal'],
  dal: ['lentil', 'daal', 'दाल'],
  daal: ['dal', 'lentil'],
};

/** Devanagari dish/ingredient queries → English search terms. */
const HINDI_DISH_ALIASES: Record<string, string[]> = {
  पनीर: ['paneer'],
  दाल: ['dal', 'daal', 'lentil'],
  आलू: ['aloo', 'potato'],
  पराठा: ['paratha'],
  बिरयानी: ['biryani'],
  पुलाव: ['pulao', 'pilaf'],
  रोटी: ['roti', 'chapati'],
  चपाती: ['chapati', 'roti'],
  दोसा: ['dosa'],
  इडली: ['idli'],
  पोहा: ['poha'],
  खिचड़ी: ['khichdi'],
  छोले: ['chole', 'chana'],
  राजमा: ['rajma'],
  पालक: ['palak', 'spinach'],
  गोभी: ['gobhi', 'cauliflower'],
  भिंडी: ['bhindi', 'okra'],
  मटर: ['matar', 'peas'],
  चावल: ['rice'],
  करी: ['curry'],
  मसाला: ['masala'],
  टिक्का: ['tikka'],
  कबाब: ['kebab'],
  थेपला: ['thepla'],
  ढोकला: ['dhokla'],
  हांडवो: ['handvo'],
  कढ़ी: ['kadhi'],
  सांभर: ['sambar'],
  रसम: ['rasam'],
  चाट: ['chaat'],
  उपमा: ['upma'],
  बटर: ['butter'],
  चिकन: ['chicken'],
  मछली: ['fish'],
  मटन: ['mutton'],
  अंडा: ['egg'],
};

function expandHindiDishTerms(query: string, terms: Set<string>) {
  for (const [hi, english] of Object.entries(HINDI_DISH_ALIASES)) {
    if (query.includes(hi)) {
      terms.add(hi);
      for (const word of english) terms.add(word);
    }
  }
}

export function expandSearchTerms(query: string): string[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const terms = new Set<string>([normalized]);
  expandHindiDishTerms(normalized, terms);
  for (const [key, synonyms] of Object.entries(SEARCH_SYNONYMS)) {
    if (normalized.includes(key) || synonyms.some((s) => normalized.includes(s))) {
      terms.add(key);
      for (const synonym of synonyms) terms.add(synonym);
    }
  }
  return [...terms];
}

export function recipeMatchesSearchQuery(
  recipe: {
    title: string;
    titleHi?: string | null;
    description: string;
    descriptionHi?: string | null;
    stepsHi?: string[] | string | null;
    region: string;
    dietType: string;
    tags: string[] | string;
    ingredients: unknown;
  },
  query: string,
): boolean {
  const terms = expandSearchTerms(query);
  if (terms.length === 0) return true;

  const stepHiText = Array.isArray(recipe.stepsHi)
    ? recipe.stepsHi.join(' ')
    : typeof recipe.stepsHi === 'string'
      ? recipe.stepsHi
      : '';

  const haystack = [
    recipe.title,
    recipe.titleHi,
    recipe.description,
    recipe.descriptionHi,
    stepHiText,
    recipe.region,
    recipe.dietType,
    ...(Array.isArray(recipe.tags)
      ? recipe.tags
      : typeof recipe.tags === 'string'
        ? (() => {
            try {
              const parsed = JSON.parse(recipe.tags) as unknown;
              return Array.isArray(parsed) ? parsed.map(String) : [];
            } catch {
              return [];
            }
          })()
        : []),
    ...(Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map((item) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object' && 'name' in item) {
            return String((item as { name?: string }).name ?? '');
          }
          return '';
        })
      : []),
  ]
    .join(' ')
    .toLowerCase();

  return terms.some((term) => haystack.includes(term.toLowerCase()));
}
