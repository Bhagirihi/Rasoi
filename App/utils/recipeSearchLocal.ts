import type { Recipe } from '@/data/mockRecipes';

/** Indian kitchen synonyms — keep aligned with rasoi_backend/src/lib/recipe-search-query.ts */
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
  okra: ['bhindi', 'भिंडी'],
  bhindi: ['okra', 'भिंडी'],
  lentil: ['dal', 'daal', 'दाल'],
  dal: ['lentil', 'daal', 'दाल'],
  daal: ['dal', 'lentil'],
  potato: ['aloo'],
  aloo: ['potato'],
  tomato: ['tamatar'],
  tamatar: ['tomato'],
  onion: ['pyaz'],
  pyaz: ['onion'],
  rice: ['chawal', 'चावल'],
  chawal: ['rice'],
  cumin: ['jeera'],
  jeera: ['cumin'],
  turmeric: ['haldi'],
  haldi: ['turmeric'],
  paratha: ['पराठा'],
  biryani: ['बिरयानी'],
};

const HINDI_DISH_ALIASES: Record<string, string[]> = {
  पनीर: ['paneer'],
  दाल: ['dal', 'daal'],
  आलू: ['aloo', 'potato'],
  पराठा: ['paratha'],
  बिरयानी: ['biryani'],
  पुलाव: ['pulao'],
  रोटी: ['roti', 'chapati'],
  चपाती: ['chapati'],
  दोसा: ['dosa'],
  इडली: ['idli'],
  पोहा: ['poha'],
  खिचड़ी: ['khichdi'],
  छोले: ['chole', 'chana'],
  राजमा: ['rajma'],
  पालक: ['palak'],
  गोभी: ['gobhi'],
  भिंडी: ['bhindi', 'okra'],
  मटर: ['matar'],
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

export type RecipeSearchSuggestionKind = 'dish' | 'ingredient' | 'tag';

export type RecipeSearchSuggestion = {
  key: string;
  label: string;
  kind: RecipeSearchSuggestionKind;
};

export type RecipeSearchMode = 'none' | 'api' | 'local' | 'fuzzy';

export function expandRecipeSearchTerms(query: string): string[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const terms = new Set<string>([normalized]);
  const tokens = normalized.split(/\s+/).filter(Boolean);
  for (const token of tokens) terms.add(token);

  for (const [hi, english] of Object.entries(HINDI_DISH_ALIASES)) {
    if (normalized.includes(hi)) {
      terms.add(hi);
      for (const word of english) terms.add(word);
    }
  }

  for (const [key, synonyms] of Object.entries(SEARCH_SYNONYMS)) {
    if (
      normalized.includes(key) ||
      tokens.includes(key) ||
      synonyms.some((synonym) => normalized.includes(synonym) || tokens.includes(synonym))
    ) {
      terms.add(key);
      for (const synonym of synonyms) terms.add(synonym);
    }
  }
  return [...terms];
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix: number[] = new Array(cols);
  for (let j = 0; j < cols; j += 1) matrix[j] = j;

  for (let i = 1; i < rows; i += 1) {
    let prev = i - 1;
    matrix[0] = i;
    for (let j = 1; j < cols; j += 1) {
      const temp = matrix[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j] = Math.min(matrix[j] + 1, matrix[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return matrix[cols - 1];
}

function fuzzyTokenMatch(query: string, token: string): boolean {
  if (!query || !token) return false;
  if (token.includes(query) || query.includes(token)) return true;
  if (query.length < 3 || token.length < 3) return false;

  const maxDistance = query.length <= 4 ? 1 : 2;
  if (Math.abs(query.length - token.length) > maxDistance) return false;

  const window = token.slice(0, Math.min(token.length, query.length + maxDistance));
  return levenshtein(query, window) <= maxDistance;
}

function scoreTextMatch(query: string, terms: string[], text: string, weights: {
  exact: number;
  prefix: number;
  contains: number;
  synonym: number;
  fuzzy: number;
}): number {
  const normalized = text.toLowerCase();
  let best = 0;

  if (normalized.includes(query)) {
    best = Math.max(best, weights.exact);
  }

  for (const token of tokenize(normalized)) {
    if (token.startsWith(query)) best = Math.max(best, weights.prefix);
    if (token.includes(query)) best = Math.max(best, weights.contains);
    if (weights.fuzzy > 0 && fuzzyTokenMatch(query, token)) {
      best = Math.max(best, weights.fuzzy);
    }
  }

  for (const term of terms) {
    if (term === query) continue;
    if (normalized.includes(term)) best = Math.max(best, weights.synonym);
  }

  return best;
}

export function scoreRecipeSearchMatch(
  recipe: Recipe,
  query: string,
  options?: { allowFuzzy?: boolean },
): number {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return 0;

  const terms = expandRecipeSearchTerms(normalized);
  const allowFuzzy = options?.allowFuzzy ?? false;
  const fuzzyWeight = allowFuzzy ? 18 : 0;

  let score = 0;
  score = Math.max(
    score,
    scoreTextMatch(normalized, terms, recipe.title, {
      exact: 100,
      prefix: 88,
      contains: 72,
      synonym: 64,
      fuzzy: fuzzyWeight + 8,
    }),
  );

  for (const ingredient of recipe.ingredients) {
    const name = ingredient.name?.trim();
    if (!name) continue;
    score = Math.max(
      score,
      scoreTextMatch(normalized, terms, name, {
        exact: 70,
        prefix: 62,
        contains: 54,
        synonym: 48,
        fuzzy: fuzzyWeight,
      }),
    );
  }

  score = Math.max(
    score,
    scoreTextMatch(normalized, terms, recipe.description, {
      exact: 42,
      prefix: 36,
      contains: 30,
      synonym: 28,
      fuzzy: allowFuzzy ? 12 : 0,
    }),
  );

  if (recipe.descriptionHi) {
    score = Math.max(
      score,
      scoreTextMatch(normalized, terms, recipe.descriptionHi, {
        exact: 90,
        prefix: 80,
        contains: 70,
        synonym: 64,
        fuzzy: fuzzyWeight,
      }),
    );
  }

  for (const tag of recipe.tags) {
    score = Math.max(
      score,
      scoreTextMatch(normalized, terms, tag, {
        exact: 38,
        prefix: 34,
        contains: 28,
        synonym: 26,
        fuzzy: allowFuzzy ? 10 : 0,
      }),
    );
  }

  score = Math.max(
    score,
    scoreTextMatch(normalized, terms, `${recipe.region} ${recipe.dietType}`, {
      exact: 20,
      prefix: 16,
      contains: 12,
      synonym: 12,
      fuzzy: 0,
    }),
  );

  return score;
}

export function recipeMatchesSearchQuery(recipe: Recipe, query: string): boolean {
  return scoreRecipeSearchMatch(recipe, query, { allowFuzzy: false }) >= 28;
}

export function rankRecipesForSearch(
  recipes: Recipe[],
  query: string,
  options?: { allowFuzzy?: boolean; minScore?: number },
): Recipe[] {
  const normalized = query.trim();
  if (!normalized) return recipes;

  const allowFuzzy = options?.allowFuzzy ?? false;
  const minScore = options?.minScore ?? (allowFuzzy ? 12 : 28);

  const scored = recipes
    .map((recipe) => ({
      recipe,
      score: scoreRecipeSearchMatch(recipe, normalized, { allowFuzzy }),
    }))
    .filter((entry) => entry.score >= minScore)
    .sort((a, b) => b.score - a.score || a.recipe.title.localeCompare(b.recipe.title));

  return scored.map((entry) => entry.recipe);
}

export function resolveRecipeListSearch(options: {
  query: string;
  listRecipes: Recipe[];
  remoteResults: Recipe[];
  remoteSettled: boolean;
}): { items: Recipe[]; mode: RecipeSearchMode; message: string | null } {
  const query = options.query.trim();
  if (!query) {
    return { items: options.listRecipes, mode: 'none', message: null };
  }

  if (options.remoteResults.length > 0) {
    return { items: options.remoteResults, mode: 'api', message: null };
  }

  if (!options.remoteSettled) {
    const localPreview = rankRecipesForSearch(options.listRecipes, query, { allowFuzzy: false });
    if (localPreview.length > 0) {
      return { items: localPreview, mode: 'local', message: null };
    }
    return { items: [], mode: 'none', message: null };
  }

  const strict = rankRecipesForSearch(options.listRecipes, query, { allowFuzzy: false });
  if (strict.length > 0) {
    return { items: strict, mode: 'local', message: null };
  }

  const fuzzy = rankRecipesForSearch(options.listRecipes, query, { allowFuzzy: true });
  if (fuzzy.length > 0) {
    return {
      items: fuzzy,
      mode: 'fuzzy',
      message: `Showing similar results for “${query}”`,
    };
  }

  return { items: [], mode: 'none', message: null };
}

function suggestionScore(query: string, label: string): number {
  const normalized = label.toLowerCase();
  if (normalized.startsWith(query)) return 100 - normalized.length;
  if (normalized.includes(query)) return 70 - normalized.length;
  return 0;
}

export function getRecipeSearchSuggestions(
  recipes: Recipe[],
  query: string,
  limit = 6,
): RecipeSearchSuggestion[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < 1) return [];

  const terms = expandRecipeSearchTerms(normalized);
  const seen = new Set<string>();
  const candidates: RecipeSearchSuggestion[] = [];

  const push = (label: string, kind: RecipeSearchSuggestionKind) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    const key = `${kind}:${trimmed.toLowerCase()}`;
    if (seen.has(key)) return;
    const score = Math.max(
      suggestionScore(normalized, trimmed),
      ...terms.map((term) => suggestionScore(term, trimmed)),
    );
    if (score <= 0) return;
    seen.add(key);
    candidates.push({ key, label: trimmed, kind });
  };

  for (const recipe of recipes) {
    push(recipe.title, 'dish');
    for (const tag of recipe.tags) push(tag, 'tag');
    for (const ingredient of recipe.ingredients) {
      push(ingredient.name, 'ingredient');
    }
  }

  return candidates
    .sort((a, b) => {
      const diff = suggestionScore(normalized, b.label) - suggestionScore(normalized, a.label);
      if (diff !== 0) return diff;
      return a.label.localeCompare(b.label);
    })
    .slice(0, limit);
}
