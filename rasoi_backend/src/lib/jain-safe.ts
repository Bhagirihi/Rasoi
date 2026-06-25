/** Words that indicate a recipe is not suitable for Jain (no onion/garlic) diets. */
const JAIN_FORBIDDEN_PATTERNS = [
  /\bonion\b/i,
  /\bgarlic\b/i,
  /\bpyaz\b/i,
  /\bpyaaz\b/i,
  /\bkanda\b/i,
  /\blasun\b/i,
  /\blehsun\b/i,
  /\blehsan\b/i,
  /\badrak[\s-]*lasun\b/i,
  /\bginger[\s-]*garlic\b/i,
];

type JainCheckable = {
  title?: string;
  description?: string;
  tags?: string[] | string;
  ingredients?: unknown;
};

function normalizeTags(tags: string[] | string | undefined): string[] {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags) as unknown;
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function ingredientTexts(ingredients: unknown): string[] {
  if (!Array.isArray(ingredients)) return [];
  return ingredients
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'name' in item) {
        return String((item as { name?: string }).name ?? '');
      }
      return '';
    })
    .filter(Boolean);
}

function textContainsJainForbidden(text: string): boolean {
  return JAIN_FORBIDDEN_PATTERNS.some((pattern) => pattern.test(text));
}

/** True when recipe is OK for Jain users (no onion/garlic), or explicitly tagged. */
export function isJainSafeRecipe(recipe: JainCheckable): boolean {
  const tags = normalizeTags(recipe.tags);
  if (tags.includes('jain-safe')) return true;

  const chunks = [
    recipe.title ?? '',
    recipe.description ?? '',
    ...tags,
    ...ingredientTexts(recipe.ingredients),
  ];

  return !chunks.some((chunk) => textContainsJainForbidden(chunk));
}

export function filterRecipesForJain<T extends JainCheckable>(recipes: T[]): T[] {
  return recipes.filter((recipe) => isJainSafeRecipe(recipe));
}
