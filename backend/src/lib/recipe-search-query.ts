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
  paneer: ['cottage cheese'],
  okra: ['bhindi'],
  bhindi: ['okra'],
  lentil: ['dal', 'daal'],
  dal: ['lentil', 'daal'],
  daal: ['dal', 'lentil'],
};

export function expandSearchTerms(query: string): string[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const terms = new Set<string>([normalized]);
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
    description: string;
    region: string;
    dietType: string;
    tags: string[] | string;
    ingredients: unknown;
  },
  query: string,
): boolean {
  const terms = expandSearchTerms(query);
  if (terms.length === 0) return true;

  const haystack = [
    recipe.title,
    recipe.description,
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

  return terms.some((term) => haystack.includes(term));
}
