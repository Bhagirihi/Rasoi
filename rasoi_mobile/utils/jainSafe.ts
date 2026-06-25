import type { Recipe } from '@/data/mockRecipes';

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

function textContainsJainForbidden(text: string): boolean {
  return JAIN_FORBIDDEN_PATTERNS.some((pattern) => pattern.test(text));
}

/** True when recipe is OK for Jain users (no onion/garlic), or explicitly tagged. */
export function isJainSafeRecipe(recipe: Recipe): boolean {
  const tags = recipe.tags as string[];
  if (tags.includes('jain-safe')) return true;

  const chunks = [
    recipe.title,
    recipe.description,
    ...recipe.tags,
    ...recipe.ingredients.map((ing) => ing.name),
  ];

  return !chunks.some((chunk) => textContainsJainForbidden(chunk));
}
