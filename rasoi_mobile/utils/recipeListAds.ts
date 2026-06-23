export type RecipeListAdOptions = {
  /** Show the first ad before this recipe index (default 2 = after two recipes). */
  minRecipesBeforeFirstAd?: number;
  /** Minimum recipe cards between consecutive ads. */
  minGap?: number;
  /** Extra random spacing added on top of minGap. */
  maxGapJitter?: number;
  /** Hard cap on ads in one list. */
  maxAds?: number;
};

const DEFAULTS = {
  minRecipesBeforeFirstAd: 2,
  minGap: 4,
  maxGapJitter: 2,
} as const;

function hashString(input: string): number {
  let hash = 2_166_136_261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 1_677_761_9);
  }
  return hash >>> 0;
}

function createSeededRandom(seed: number): () => number {
  let state = seed || 1;
  return () => {
    state = (Math.imul(1_664_525, state) + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

export function getMaxRecipeListAds(recipeCount: number): number {
  if (recipeCount < 3) return 0;
  if (recipeCount < 7) return 1;
  if (recipeCount < 12) return 2;
  return 3;
}

/** Indices where an in-feed ad should render before the recipe card at that index. */
export function getRecipeListAdIndices(
  recipeCount: number,
  seed: string,
  options: RecipeListAdOptions = {},
): Set<number> {
  const minBefore = options.minRecipesBeforeFirstAd ?? DEFAULTS.minRecipesBeforeFirstAd;
  const minGap = options.minGap ?? DEFAULTS.minGap;
  const maxGapJitter = options.maxGapJitter ?? DEFAULTS.maxGapJitter;
  const maxAds = options.maxAds ?? getMaxRecipeListAds(recipeCount);

  if (recipeCount < minBefore + 1 || maxAds <= 0) {
    return new Set();
  }

  const rng = createSeededRandom(hashString(seed));
  const indices: number[] = [];
  let next =
    minBefore + (maxGapJitter > 0 ? Math.floor(rng() * (maxGapJitter + 1)) : 0);

  while (next < recipeCount && indices.length < maxAds) {
    indices.push(next);
    const jitter = maxGapJitter > 0 ? Math.floor(rng() * (maxGapJitter + 1)) : 0;
    next += minGap + jitter;
  }

  return new Set(indices);
}

export function recipeListAdSeed(recipes: readonly { id: string }[]): string {
  return recipes.map((recipe) => recipe.id).join('\0');
}
