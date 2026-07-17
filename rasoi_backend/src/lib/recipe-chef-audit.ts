/**
 * Chef-style recipe quality audit: title ↔ ingredients ↔ steps consistency.
 */
import { canonicalizeIngredientName } from '@/lib/ingredient-canonical';
import { heroIngredientMismatch, inferHeroIngredientFromTitle } from '@/lib/infer-hero-ingredient';
import { normalizeRecipeIngredients } from '@/lib/recipe-ingredients';
import {
  detectDishKind,
  stepsLookVague,
  stepsMismatchTitle,
  type RecipeStepInput,
} from '@/lib/recipe-steps';
import type { RecipeIngredient } from '@/lib/types';

export type ChefAuditIssueCode =
  | 'hero_mismatch'
  | 'missing_title_ingredient'
  | 'missing_khichdi_dal'
  | 'duplicate_ingredients'
  | 'empty_steps'
  | 'vague_steps'
  | 'steps_title_mismatch'
  | 'steps_dish_kind_mismatch';

export type ChefAuditIssue = {
  code: ChefAuditIssueCode;
  message: string;
};

export type ChefAuditResult = {
  id: string;
  title: string;
  kitchenStyleId: string;
  issues: ChefAuditIssue[];
  hero: string;
  ingredientNames: string[];
  stepCount: number;
};

const TITLE_INGREDIENT_RULES: Array<{ pattern: RegExp; ingredient: string; isStaple?: boolean }> = [
  { pattern: /\bmethi\b/i, ingredient: 'Methi', isStaple: false },
  { pattern: /\bpalak\b|\bspinach\b/i, ingredient: 'Palak', isStaple: false },
  { pattern: /\bkarela\b|\bbitter gourd\b/i, ingredient: 'Karela', isStaple: false },
  { pattern: /\blauki\b|\bbottle gourd\b|\bdoodhi\b/i, ingredient: 'Lauki', isStaple: false },
  { pattern: /\bbeetroot\b|\bbeet\b/i, ingredient: 'Beetroot', isStaple: false },
  { pattern: /\bpaneer\b/i, ingredient: 'Paneer', isStaple: false },
  { pattern: /\bbhindi\b|\bokra\b|\blady finger\b/i, ingredient: 'Bhindi', isStaple: false },
  { pattern: /\bgobhi\b|\bgobi\b|\bcauliflower\b/i, ingredient: 'Gobhi', isStaple: false },
  { pattern: /\bbaingan\b|\bbrinjal\b|\begplant\b/i, ingredient: 'Baingan', isStaple: false },
  { pattern: /\bmatar\b|\bgreen peas\b/i, ingredient: 'Matar', isStaple: false },
  { pattern: /\bbesan\b|\bgram flour\b/i, ingredient: 'Besan', isStaple: false },
  { pattern: /\btofu\b/i, ingredient: 'Tofu', isStaple: false },
  { pattern: /\bmushroom\b/i, ingredient: 'Mushroom', isStaple: false },
  { pattern: /\bchana\b|\bchole\b|\bchickpea\b/i, ingredient: 'Chana', isStaple: false },
  { pattern: /\brajma\b|\bkidney bean\b/i, ingredient: 'Rajma', isStaple: false },
  { pattern: /\bpoha\b|\bflattened rice\b/i, ingredient: 'Poha', isStaple: false },
  { pattern: /\bsabudana\b|\bsago\b/i, ingredient: 'Sabudana', isStaple: false },
  { pattern: /\bcoconut\b|\bnariyal\b/i, ingredient: 'Nariyal', isStaple: false },
  { pattern: /\begg\b|\banda\b|\bbhurji\b|\bomlette\b|\bomelet\b/i, ingredient: 'Eggs', isStaple: false },
  { pattern: /\bsoya\b|\bsoy\b|\bchaap\b/i, ingredient: 'Soya Chunks', isStaple: false },
  { pattern: /\bcorn\b|\bmakai\b/i, ingredient: 'Sweet Corn', isStaple: false },
  { pattern: /\bcapsicum\b|\bbell pepper\b|\bshimla mirch\b/i, ingredient: 'Shimla Mirch', isStaple: false },
  { pattern: /\bcabbage\b|\bkobi\b|\bpatta gobhi\b/i, ingredient: 'Patta Gobhi', isStaple: false },
  { pattern: /\btil\b|\bsesame\b/i, ingredient: 'Til', isStaple: false },
];

const STEP_KIND_MARKERS: Record<string, RegExp> = {
  khichdi: /khichdi|creamy|mushy|rice-lentil|soak for 15 minutes/i,
  dhebra: /dhebra|knead into a soft dough|lemon-sized balls|pat each ball/i,
  bread: /knead.*dough|roll.*roti|tawa.*roti|phulka|chapati/i,
  dal: /pressure-cook|whistles|tadka|dal boils|lentil/i,
  dosa: /ferment|batter.*spread|dosa|idli mould|steam idli/i,
  biryani: /layer.*rice|dum|biryani|marinate/i,
  fried: /fry in small batches|drain on a wire rack|crisp and evenly golden/i,
  salad: /toss.*dressing|mix.*salad|serve chilled/i,
  sweet: /sugar syrup|jaggery melts|ladle into/i,
  soup: /broth|simmer gently|piping hot|stock|blend a ladleful/i,
  porridge: /whisk in|coat a spoon|simmer.*stirring often/i,
  smoothie: /blender|blend on high|smooth and pourable/i,
};

function ingredientText(ingredients: RecipeIngredient[]): string {
  return ingredients.map((item) => item.name.toLowerCase()).join(' ');
}

function hasIngredientLike(ingredients: RecipeIngredient[], pattern: RegExp): boolean {
  return ingredients.some((item) => pattern.test(item.name.toLowerCase()));
}

function missingTitleIngredients(title: string, ingredients: RecipeIngredient[]): string[] {
  const missing: string[] = [];
  for (const rule of TITLE_INGREDIENT_RULES) {
    if (!rule.pattern.test(title)) continue;
    const canonical = canonicalizeIngredientName(rule.ingredient);
    const key = canonical.toLowerCase();
    const present = ingredients.some((item) => {
      const name = canonicalizeIngredientName(item.name).toLowerCase();
      return name === key || name.includes(key.split(' ')[0]!) || key.includes(name.split(' ')[0]!);
    });
    if (!present) missing.push(canonical);
  }
  return missing;
}

function stepsDishKindMismatch(title: string, ingredients: RecipeIngredient[], steps: string[]): boolean {
  if (steps.length === 0) return false;
  const expectedKind = detectDishKind(title, ingredients);
  const text = steps.join(' ');
  const expectedMarker = STEP_KIND_MARKERS[expectedKind];
  if (expectedMarker?.test(text)) return false;

  if (expectedKind === 'khichdi' && STEP_KIND_MARKERS.dhebra.test(text)) return true;
  if (expectedKind === 'khichdi' && STEP_KIND_MARKERS.bread.test(text)) return true;
  if (expectedKind === 'bread' && STEP_KIND_MARKERS.dal.test(text) && !/stuffed|paratha|thepla/.test(title.toLowerCase())) {
    return true;
  }
  if (expectedKind === 'dhebra' && STEP_KIND_MARKERS.khichdi.test(text)) return true;
  if (expectedKind === 'fermented' && !STEP_KIND_MARKERS.dosa.test(text)) return true;
  if (expectedKind === 'dal' && STEP_KIND_MARKERS.dhebra.test(text)) return true;
  if (expectedKind === 'dry-sabzi' && /onion-tomato masala thickens|gravy consistency/i.test(text)) return true;
  if (/thepla|paratha|rotla|roti|bhakri|missi|naan/.test(title.toLowerCase()) && STEP_KIND_MARKERS.dal.test(text) && !STEP_KIND_MARKERS.bread.test(text)) {
    return true;
  }
  if (/raita|salad|soup|porridge|raab|smoothie/.test(title.toLowerCase()) && /onion turns golden|onion-tomato masala/i.test(text)) {
    return true;
  }
  return false;
}

function hasDuplicateIngredients(raw: unknown): boolean {
  const normalized = normalizeRecipeIngredients(raw);
  const keys = normalized.map((item) => canonicalizeIngredientName(item.name).toLowerCase());
  return keys.length !== new Set(keys).size;
}

export function auditRecipeChefQuality(input: {
  id: string;
  title: string;
  kitchenStyleId: string;
  ingredients: unknown;
  steps: string[];
}): ChefAuditResult {
  const ingredients = normalizeRecipeIngredients(input.ingredients);
  const heroIndex = ingredients.findIndex((item) => !item.isStaple);
  const hero = (heroIndex >= 0 ? ingredients[heroIndex] : ingredients[0])?.name ?? '';
  const issues: ChefAuditIssue[] = [];

  if (heroIngredientMismatch(input.title, hero)) {
    issues.push({
      code: 'hero_mismatch',
      message: `Hero "${hero}" does not match title (expected "${inferHeroIngredientFromTitle(input.title, hero)}")`,
    });
  }

  for (const missing of missingTitleIngredients(input.title, ingredients)) {
    issues.push({
      code: 'missing_title_ingredient',
      message: `Title implies "${missing}" but it is not in the ingredient list`,
    });
  }

  const lower = input.title.toLowerCase();
  if (/khichdi|khichri/.test(lower) && !/dal/.test(lower) && !hasIngredientLike(ingredients, /moong dal|dal|lentil/i)) {
    issues.push({
      code: 'missing_khichdi_dal',
      message: 'Khichdi title missing dal/lentil ingredient',
    });
  }

  if (hasDuplicateIngredients(input.ingredients)) {
    issues.push({ code: 'duplicate_ingredients', message: 'Duplicate ingredient names in list' });
  }

  if (input.steps.length === 0) {
    issues.push({ code: 'empty_steps', message: 'No cooking steps' });
  } else {
    if (stepsLookVague(input.steps)) {
      issues.push({ code: 'vague_steps', message: 'Steps look auto-generated / too generic' });
    }
    if (stepsMismatchTitle(input.title, input.steps)) {
      issues.push({ code: 'steps_title_mismatch', message: 'Steps do not match dish type in title' });
    }
    if (stepsDishKindMismatch(input.title, ingredients, input.steps)) {
      issues.push({
        code: 'steps_dish_kind_mismatch',
        message: `Steps read like a different dish than "${detectDishKind(input.title, ingredients)}"`,
      });
    }
  }

  return {
    id: input.id,
    title: input.title,
    kitchenStyleId: input.kitchenStyleId,
    issues,
    hero,
    ingredientNames: ingredients.map((item) => item.name),
    stepCount: input.steps.length,
  };
}

export function recipeNeedsChefFix(audit: ChefAuditResult): boolean {
  return audit.issues.length > 0;
}

export function buildRecipeStepInput(recipe: {
  title: string;
  kitchenStyleId: string;
  dietType: string;
  prepTime: number;
  difficulty: string;
  description?: string;
  ingredients: RecipeIngredient[];
  steps?: string[];
}): RecipeStepInput {
  return {
    title: recipe.title,
    kitchenStyleId: recipe.kitchenStyleId,
    dietType: recipe.dietType,
    ingredients: recipe.ingredients,
    prepTime: recipe.prepTime,
    difficulty: recipe.difficulty,
    description: recipe.description,
    steps: recipe.steps,
  };
}

export function missingTitleIngredientNames(title: string, ingredients: RecipeIngredient[]): string[] {
  return missingTitleIngredients(title, ingredients);
}

export function ingredientTextForAudit(ingredients: RecipeIngredient[]): string {
  return ingredientText(ingredients);
}
