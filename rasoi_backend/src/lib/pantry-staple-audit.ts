/**
 * Pantry staple ingredient data-integrity audit.
 * Flags recipes where isStaple flags break frontend pantry-matching UX.
 */
import { canonicalizeIngredientName, expandIngredientAliasKeys } from '@/lib/ingredient-canonical';
import { inferHeroIngredientFromTitle } from '@/lib/infer-hero-ingredient';
import { normalizeRecipeIngredients } from '@/lib/recipe-ingredients';
import type { RecipeIngredient } from '@/lib/types';

/** Rule codes aligned with audit spec. */
export type PantryStapleRule =
  | 'all_staple_bloat'
  | 'hero_as_staple'
  | 'tracked_liquid'
  | 'assumed_at_home_overlap';

export type PantryStapleSeverity = 'P1' | 'P2' | 'P3' | 'P4';

export type PantryStapleViolation = {
  rule: PantryStapleRule;
  message: string;
  /** Ingredient names implicated in this violation. */
  ingredients: string[];
};

export type PantryStapleAuditInput = {
  id: string;
  title: string;
  kitchenStyleId: string;
  dietType?: string;
  ingredients: unknown;
  source?: 'supabase' | 'catalog' | 'both';
};

export type PantryStapleAuditResult = {
  id: string;
  title: string;
  kitchenStyleId: string;
  dietType?: string;
  source: 'supabase' | 'catalog' | 'both';
  severity: PantryStapleSeverity;
  violations: PantryStapleViolation[];
  /** Flat rule list for quick filtering. */
  rules: PantryStapleRule[];
  ingredientCount: number;
  stapleCount: number;
  nonStapleCount: number;
  ingredients: Array<{ name: string; isStaple: boolean }>;
  inferredHero: string;
  heroesMarkedStaple: string[];
  trackedLiquids: string[];
  assumedAtHomeInRecipe: string[];
  /** Missing when pantry contains all non-assumed ingredients (Rule 4 simulation). */
  missingWhenStockedOnHero: string[];
  suggestedFix: string;
};

/** Free utilities — belong in steps, not structured ingredients. */
const TRACKED_LIQUID_KEYS = new Set(['pani', 'water', 'ice', 'free tap water']);

/**
 * Assumed-at-home: base seasonings, fats, and aromatics that should not
 * block cooking or drive "Order missing" when the hero is stocked.
 */
const ASSUMED_AT_HOME_CANONICAL = new Set([
  'Namak',
  'Haldi',
  'Jeera',
  'Rai',
  'Lal Mirch Powder',
  'Dhania Powder',
  'Hing',
  'Garam Masala',
  'Kali Mirch',
  'Chini',
  'Tel',
  'Ghee',
  'Butter',
]);

/** Title nouns that define a dish — if present in ingredients as staple, flag Rule 2. */
const TITLE_HERO_PATTERNS: Array<{ pattern: RegExp; ingredient: string }> = [
  { pattern: /\baloo\b|\bpotato\b|\bbateta\b/i, ingredient: 'Aloo' },
  { pattern: /\bpaneer\b/i, ingredient: 'Paneer' },
  { pattern: /\bchicken\b|\bmurgh\b|\bkozhi\b/i, ingredient: 'Chicken' },
  { pattern: /\bchana\b|\bchole\b|\bchickpea\b/i, ingredient: 'Chana' },
  { pattern: /\bgobhi\b|\bgobi\b|\bcauliflower\b/i, ingredient: 'Gobhi' },
  { pattern: /\bbhindi\b|\bokra\b|\blady finger\b/i, ingredient: 'Bhindi' },
  { pattern: /\bfish\b|\bmeen\b|\bmaach\b/i, ingredient: 'Fish' },
  { pattern: /\bmutton\b|\bgosht\b|\blamb\b/i, ingredient: 'Mutton' },
  { pattern: /\begg\b|\banda\b|\bbhurji\b|\bomlette\b|\bomelet\b/i, ingredient: 'Eggs' },
  { pattern: /\brajma\b|\bkidney bean\b/i, ingredient: 'Rajma' },
  { pattern: /\bpalak\b|\bspinach\b/i, ingredient: 'Palak' },
  { pattern: /\bbaingan\b|\bbrinjal\b|\begplant\b/i, ingredient: 'Baingan' },
  { pattern: /\blauki\b|\bbottle gourd\b|\bdoodhi\b/i, ingredient: 'Lauki' },
  { pattern: /\bkarela\b|\bbitter gourd\b/i, ingredient: 'Karela' },
  { pattern: /\bmatar\b|\bgreen peas\b/i, ingredient: 'Matar' },
  { pattern: /\bbesan\b|\bgram flour\b/i, ingredient: 'Besan' },
  { pattern: /\btofu\b/i, ingredient: 'Tofu' },
  { pattern: /\bmushroom\b/i, ingredient: 'Mushroom' },
  { pattern: /\bprawn\b|\bshrimp\b|\bjhinga\b/i, ingredient: 'Prawns' },
  { pattern: /\bcrab\b/i, ingredient: 'Crab' },
  { pattern: /\bduck\b/i, ingredient: 'Duck' },
  { pattern: /\bpoha\b|\bflattened rice\b/i, ingredient: 'Poha' },
  { pattern: /\bsabudana\b|\bsago\b/i, ingredient: 'Sabudana' },
  { pattern: /\bmoong\b|\bmung\b/i, ingredient: 'Moong Dal' },
  { pattern: /\btuver\b|\btoor\b|\barhar\b/i, ingredient: 'Tuver Dal' },
  { pattern: /\burad\b/i, ingredient: 'Urad Dal' },
  { pattern: /\bmasoor\b/i, ingredient: 'Masoor Dal' },
  { pattern: /\brice\b|\bchawal\b|\bbiryani\b|\bpulao\b/i, ingredient: 'Basmati Chawal' },
  { pattern: /\bdosa\b|\bidli\b|\bappam\b|\buttapam\b/i, ingredient: 'Dosa Batter' },
  { pattern: /\bparatha\b|\broti\b|\bthepla\b|\brotla\b|\bchapati\b|\bbhakri\b|\bphulka\b/i, ingredient: 'Gehu Atta' },
  { pattern: /\bsoya\b|\bchaap\b/i, ingredient: 'Soya Chunks' },
  { pattern: /\bbeetroot\b|\bbeet\b/i, ingredient: 'Beetroot' },
  { pattern: /\bmethi\b|\bfenugreek leaves\b/i, ingredient: 'Methi' },
];

function ingredientLookupKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

function pantryHasIngredient(pantryIngredients: string[], name: string): boolean {
  const targetKeys = expandIngredientAliasKeys(name);
  return pantryIngredients.some((pantryItem) => {
    const pantryKeys = expandIngredientAliasKeys(pantryItem);
    for (const key of targetKeys) {
      if (pantryKeys.has(key)) return true;
    }
    return false;
  });
}

function partitionIngredients(
  ingredients: RecipeIngredient[],
  pantryIngredients: string[],
): { available: string[]; missing: string[] } {
  const available: string[] = [];
  const missing: string[] = [];

  for (const ingredient of ingredients) {
    const name = ingredient.name?.trim();
    if (!name) continue;
    if (pantryHasIngredient(pantryIngredients, name)) {
      available.push(name);
    } else {
      missing.push(name);
    }
  }

  return { available, missing };
}

export function isTrackedLiquid(name: string): boolean {
  const canonical = canonicalizeIngredientName(name);
  const keys = expandIngredientAliasKeys(canonical);
  for (const k of keys) {
    if (TRACKED_LIQUID_KEYS.has(k)) return true;
  }
  return TRACKED_LIQUID_KEYS.has(ingredientLookupKey(name));
}

export function isAssumedAtHome(name: string): boolean {
  if (isTrackedLiquid(name)) return true;
  const canonical = canonicalizeIngredientName(name);
  if (ASSUMED_AT_HOME_CANONICAL.has(canonical)) return true;
  const key = ingredientLookupKey(canonical);
  for (const assumed of ASSUMED_AT_HOME_CANONICAL) {
    if (ingredientLookupKey(assumed) === key) return true;
  }
  return false;
}

function isSaltWaterOnly(ingredients: RecipeIngredient[]): boolean {
  if (ingredients.length === 0) return false;
  return ingredients.every((item) => isAssumedAtHome(item.name) || isTrackedLiquid(item.name));
}

function findIngredientByHero(ingredients: RecipeIngredient[], hero: string): RecipeIngredient | undefined {
  const heroKeys = expandIngredientAliasKeys(hero);
  return ingredients.find((item) => {
    const itemKeys = expandIngredientAliasKeys(item.name);
    for (const key of heroKeys) {
      if (itemKeys.has(key)) return true;
    }
    return ingredientLookupKey(item.name).includes(ingredientLookupKey(hero))
      || ingredientLookupKey(hero).includes(ingredientLookupKey(item.name));
  });
}

/** Collect hero candidates from title inference + noun patterns. */
export function extractTitleHeroCandidates(title: string): string[] {
  const seen = new Set<string>();
  const candidates: string[] = [];

  const push = (name: string) => {
    const canonical = canonicalizeIngredientName(name);
    const key = ingredientLookupKey(canonical);
    if (!key || seen.has(key)) return;
    seen.add(key);
    candidates.push(canonical);
  };

  push(inferHeroIngredientFromTitle(title, ''));
  for (const rule of TITLE_HERO_PATTERNS) {
    if (rule.pattern.test(title)) push(rule.ingredient);
  }

  return candidates;
}

export function findHeroesMarkedStaple(
  title: string,
  ingredients: RecipeIngredient[],
): string[] {
  const flagged: string[] = [];
  const seen = new Set<string>();

  for (const hero of extractTitleHeroCandidates(title)) {
    const match = findIngredientByHero(ingredients, hero);
    if (!match?.isStaple) continue;
    const key = ingredientLookupKey(match.name);
    if (seen.has(key)) continue;
    seen.add(key);
    flagged.push(match.name);
  }

  return flagged;
}

function detectAllStapleBloat(ingredients: RecipeIngredient[]): boolean {
  if (ingredients.length === 0) return false;
  const allStaple = ingredients.every((item) => item.isStaple);
  if (!allStaple) return false;
  return !isSaltWaterOnly(ingredients);
}

function detectTrackedLiquids(ingredients: RecipeIngredient[]): string[] {
  return ingredients.filter((item) => isTrackedLiquid(item.name)).map((item) => item.name);
}

function detectAssumedAtHomeOverlap(ingredients: RecipeIngredient[]): {
  flagged: boolean;
  missingWhenStockedOnHero: string[];
} {
  const distinctivePantry = ingredients
    .filter((item) => !isAssumedAtHome(item.name) && !isTrackedLiquid(item.name))
    .map((item) => item.name);

  const { missing } = partitionIngredients(ingredients, distinctivePantry);
  if (missing.length === 0) {
    return { flagged: false, missingWhenStockedOnHero: [] };
  }

  const onlyAssumed = missing.every((name) => isAssumedAtHome(name) || isTrackedLiquid(name));
  return { flagged: onlyAssumed, missingWhenStockedOnHero: missing };
}

export function severityFromRules(rules: PantryStapleRule[]): PantryStapleSeverity {
  if (rules.includes('hero_as_staple')) return 'P1';
  if (rules.includes('tracked_liquid')) return 'P2';
  if (rules.includes('all_staple_bloat')) return 'P3';
  if (rules.includes('assumed_at_home_overlap')) return 'P4';
  return 'P4';
}

function buildSuggestedFix(input: {
  violations: PantryStapleViolation[];
  inferredHero: string;
  heroesMarkedStaple: string[];
  trackedLiquids: string[];
  missingWhenStockedOnHero: string[];
}): string {
  const fixes: string[] = [];

  for (const violation of input.violations) {
    switch (violation.rule) {
      case 'hero_as_staple':
        fixes.push(
          `Mark hero(s) as isStaple: false — ${input.heroesMarkedStaple.join(', ') || input.inferredHero}`,
        );
        break;
      case 'tracked_liquid':
        fixes.push(`Remove tracked liquid(s) from ingredients: ${input.trackedLiquids.join(', ')}`);
        break;
      case 'all_staple_bloat':
        fixes.push('At least one distinctive ingredient must have isStaple: false');
        break;
      case 'assumed_at_home_overlap':
        fixes.push(
          `Exclude assumed-at-home from pantry match or user pantry — blocks on: ${input.missingWhenStockedOnHero.join(', ')}`,
        );
        break;
      default:
        break;
    }
  }

  return [...new Set(fixes)].join('; ') || 'Review ingredient staple flags';
}

/** Audit one recipe against all four data-integrity rules. Returns null if clean. */
export function auditPantryStapleRecipe(input: PantryStapleAuditInput): PantryStapleAuditResult | null {
  const ingredients = normalizeRecipeIngredients(input.ingredients);
  if (ingredients.length === 0) return null;

  const violations: PantryStapleViolation[] = [];
  const stapleCount = ingredients.filter((item) => item.isStaple).length;
  const nonStapleCount = ingredients.length - stapleCount;
  const inferredHero = inferHeroIngredientFromTitle(input.title, ingredients[0]?.name ?? '');
  const heroesMarkedStaple = findHeroesMarkedStaple(input.title, ingredients);
  const trackedLiquids = detectTrackedLiquids(ingredients);
  const assumedAtHomeInRecipe = ingredients
    .filter((item) => isAssumedAtHome(item.name))
    .map((item) => item.name);

  if (detectAllStapleBloat(ingredients)) {
    violations.push({
      rule: 'all_staple_bloat',
      message: 'Every ingredient is marked isStaple: true (100% staple bloat)',
      ingredients: ingredients.map((item) => item.name),
    });
  }

  if (heroesMarkedStaple.length > 0) {
    violations.push({
      rule: 'hero_as_staple',
      message: `Title hero ingredient(s) incorrectly marked staple: ${heroesMarkedStaple.join(', ')}`,
      ingredients: heroesMarkedStaple,
    });
  }

  if (trackedLiquids.length > 0) {
    violations.push({
      rule: 'tracked_liquid',
      message: `Free utility liquid(s) tracked as ingredients: ${trackedLiquids.join(', ')}`,
      ingredients: trackedLiquids,
    });
  }

  const assumedOverlap = detectAssumedAtHomeOverlap(ingredients);
  if (assumedOverlap.flagged) {
    violations.push({
      rule: 'assumed_at_home_overlap',
      message: `Missing UI driven only by assumed-at-home items: ${assumedOverlap.missingWhenStockedOnHero.join(', ')}`,
      ingredients: assumedOverlap.missingWhenStockedOnHero,
    });
  }

  if (violations.length === 0) return null;

  const rules = violations.map((v) => v.rule);
  const base = {
    id: input.id,
    title: input.title,
    kitchenStyleId: input.kitchenStyleId,
    dietType: input.dietType,
    source: input.source ?? 'supabase',
    severity: severityFromRules(rules),
    violations,
    rules,
    ingredientCount: ingredients.length,
    stapleCount,
    nonStapleCount,
    ingredients: ingredients.map((item) => ({ name: item.name, isStaple: item.isStaple })),
    inferredHero,
    heroesMarkedStaple,
    trackedLiquids,
    assumedAtHomeInRecipe,
    missingWhenStockedOnHero: assumedOverlap.missingWhenStockedOnHero,
  };

  return {
    ...base,
    suggestedFix: buildSuggestedFix({
      violations,
      inferredHero,
      heroesMarkedStaple,
      trackedLiquids,
      missingWhenStockedOnHero: assumedOverlap.missingWhenStockedOnHero,
    }),
  };
}

export function countByRule(results: PantryStapleAuditResult[]): Record<PantryStapleRule, number> {
  return {
    all_staple_bloat: results.filter((r) => r.rules.includes('all_staple_bloat')).length,
    hero_as_staple: results.filter((r) => r.rules.includes('hero_as_staple')).length,
    tracked_liquid: results.filter((r) => r.rules.includes('tracked_liquid')).length,
    assumed_at_home_overlap: results.filter((r) => r.rules.includes('assumed_at_home_overlap')).length,
  };
}

export function countBySeverity(results: PantryStapleAuditResult[]): Record<PantryStapleSeverity, number> {
  return {
    P1: results.filter((r) => r.severity === 'P1').length,
    P2: results.filter((r) => r.severity === 'P2').length,
    P3: results.filter((r) => r.severity === 'P3').length,
    P4: results.filter((r) => r.severity === 'P4').length,
  };
}

export type PantryStapleFixPhase = 'p2' | 'p1' | 'rule1';

export type PantryStapleFixResult = {
  ingredients: RecipeIngredient[];
  changes: string[];
  changed: boolean;
};

const DISTINCTIVE_INGREDIENT =
  /aloo|paneer|chicken|fish|mutton|egg|anda|chana|chole|rajma|dal|lentil|gobhi|gobi|bhindi|palak|matar|baingan|besan|tofu|mushroom|prawn|shrimp|crab|duck|poha|sabudana|bajra|ragi|jowar|moong|tuver|toor|urad|masoor|chawal|rice|atta|bread|pav|paneer|methi|lauki|karela|beetroot|soya|chaap|keema|milk|doodh|curd|dahi|nariyal|coconut|imli|tamarind|seviyan|rava|maida|mungfali|peanut|til|sesame|bateta|potato|tamatar|tomato|pyaaz|onion/i;

function cloneIngredients(ingredients: RecipeIngredient[]): RecipeIngredient[] {
  return ingredients.map((item) => ({ ...item }));
}

function setIngredientStaple(
  ingredients: RecipeIngredient[],
  name: string,
  isStaple: boolean,
): boolean {
  const keys = expandIngredientAliasKeys(name);
  let changed = false;
  for (const item of ingredients) {
    const itemKeys = expandIngredientAliasKeys(item.name);
    for (const key of keys) {
      if (itemKeys.has(key) && item.isStaple !== isStaple) {
        item.isStaple = isStaple;
        changed = true;
      }
    }
  }
  return changed;
}

function removeTrackedLiquids(ingredients: RecipeIngredient[]): { next: RecipeIngredient[]; removed: string[] } {
  const removed: string[] = [];
  const next = ingredients.filter((item) => {
    if (!isTrackedLiquid(item.name)) return true;
    removed.push(item.name);
    return false;
  });
  return { next, removed };
}

function stillAllStaple(ingredients: RecipeIngredient[]): boolean {
  return ingredients.length > 0 && ingredients.every((item) => item.isStaple);
}

/**
 * Apply P2 → P1 → Rule1 pantry staple fixes to a recipe ingredient list.
 */
export function fixPantryStapleIngredients(
  title: string,
  raw: unknown,
  phases: PantryStapleFixPhase[] = ['p2', 'p1', 'rule1'],
): PantryStapleFixResult {
  const phaseSet = new Set(phases);
  const changes: string[] = [];
  let ingredients = cloneIngredients(normalizeRecipeIngredients(raw));

  if (phaseSet.has('p2')) {
    const { next, removed } = removeTrackedLiquids(ingredients);
    if (removed.length > 0) {
      ingredients = next;
      changes.push(`removed liquids: ${removed.join(', ')}`);
    }
  }

  if (phaseSet.has('p1')) {
    for (const hero of findHeroesMarkedStaple(title, ingredients)) {
      if (setIngredientStaple(ingredients, hero, false)) {
        changes.push(`hero isStaple=false: ${hero}`);
      }
    }
    const inferred = inferHeroIngredientFromTitle(title, '');
    if (inferred && setIngredientStaple(ingredients, inferred, false)) {
      changes.push(`inferred hero isStaple=false: ${inferred}`);
    }
  }

  if (phaseSet.has('rule1') && stillAllStaple(ingredients)) {
    for (const item of ingredients) {
      if (isAssumedAtHome(item.name) || isTrackedLiquid(item.name)) continue;
      if (DISTINCTIVE_INGREDIENT.test(item.name) && item.isStaple) {
        item.isStaple = false;
        changes.push(`distinctive isStaple=false: ${item.name}`);
      }
    }
  }

  if (phaseSet.has('rule1') && stillAllStaple(ingredients)) {
    const fallback =
      ingredients.find((item) => !isAssumedAtHome(item.name) && !isTrackedLiquid(item.name)) ??
      ingredients[0];
    if (fallback && fallback.isStaple) {
      fallback.isStaple = false;
      changes.push(`fallback hero isStaple=false: ${fallback.name}`);
    }
  }

  const deduped = normalizeRecipeIngredients(ingredients);
  const changed =
    changes.length > 0 ||
    JSON.stringify(deduped) !== JSON.stringify(normalizeRecipeIngredients(raw));

  return { ingredients: deduped, changes, changed };
}
