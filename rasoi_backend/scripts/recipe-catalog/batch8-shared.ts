import {
  BATCH8_CUISINE_META,
  BATCH8_DISH_POOLS,
  BATCH8_STYLE_PREFIXES,
} from './batch8-dish-pools';
import type { RecipeCatalogEntry } from './types';
import { inferHeroIngredientFromTitle } from '../../src/lib/infer-hero-ingredient';

type DietType = RecipeCatalogEntry['dietType'];
type Difficulty = RecipeCatalogEntry['difficulty'];

export const BATCH8_START_ID = 299;
export const BATCH8_RECIPES_PER_CUISINE = 100;

function toImageKeyword(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function inferDietType(title: string): DietType {
  const lower = title.toLowerCase();
  if (lower.includes('egg') || lower.includes('anda') || lower.includes('omelette') || lower.includes('dim ')) {
    return 'Egg';
  }
  if (
    lower.includes('chicken') ||
    lower.includes('murgh') ||
    lower.includes('mutton') ||
    lower.includes('gosht') ||
    lower.includes('fish') ||
    lower.includes('meen') ||
    lower.includes('maach') ||
    lower.includes('prawn') ||
    lower.includes('crab') ||
    lower.includes('pork') ||
    lower.includes('beef') ||
    lower.includes('duck') ||
    lower.includes('lamb') ||
    lower.includes('keema') ||
    lower.includes('haleem') ||
    lower.includes('kozhi') ||
    lower.includes('kolmi') ||
    lower.includes('chaap') ||
    lower.includes('saus') ||
    lower.includes('sorpotel')
  ) {
    return 'Non-Veg';
  }
  return 'Veg';
}

function inferDifficulty(idNumber: number): Difficulty {
  if (idNumber % 11 === 0) return 'Hard';
  if (idNumber % 2 === 0) return 'Medium';
  return 'Easy';
}

function inferTags(idNumber: number, prepTime: number): RecipeCatalogEntry['tags'] {
  if (prepTime <= 20) return ['under20', 'quick'];
  if (idNumber % 5 === 0) return ['festive', 'kids'];
  if (idNumber % 3 === 0) return ['quick', 'leftover'];
  return ['quick', 'kids'];
}

function inferProtein(title: string, fallback: string): string {
  return inferHeroIngredientFromTitle(title, fallback);
}

function ingredientsFor(
  title: string,
  dietType: DietType,
  fallback: string,
): Array<{ name: string; isStaple: boolean }> {
  const hero = inferProtein(title, fallback);
  const base = [
    { name: 'Pyaaz', isStaple: true },
    { name: 'Tamatar', isStaple: true },
    { name: 'Adrak', isStaple: true },
    { name: 'Hari mirch', isStaple: true },
    { name: 'Haldi', isStaple: true },
    { name: 'Namak', isStaple: true },
    { name: 'Tel', isStaple: true },
  ];
  if (dietType === 'Non-Veg' || dietType === 'Egg') {
    return [{ name: hero, isStaple: false }, ...base];
  }
  return [{ name: hero, isStaple: true }, ...base];
}

function buildTitles(baseDishes: readonly string[]): string[] {
  const titles: string[] = [];
  for (const prefix of BATCH8_STYLE_PREFIXES) {
    for (const dish of baseDishes) {
      const title = prefix ? `${prefix} ${dish}` : dish;
      if (!titles.some((t) => t.toLowerCase() === title.toLowerCase())) {
        titles.push(title);
      }
    }
  }
  return titles.slice(0, BATCH8_RECIPES_PER_CUISINE);
}

export function buildBatch8RecipesForCuisine(kitchenStyleId: string): RecipeCatalogEntry[] {
  const meta = BATCH8_CUISINE_META[kitchenStyleId];
  const baseDishes = BATCH8_DISH_POOLS[kitchenStyleId];
  if (!meta || !baseDishes) return [];

  const titles = buildTitles(baseDishes);
  if (titles.length < BATCH8_RECIPES_PER_CUISINE) {
    throw new Error(`${kitchenStyleId}: only ${titles.length} unique titles (need ${BATCH8_RECIPES_PER_CUISINE})`);
  }

  return titles.map((title, idx) => {
    const idNumber = BATCH8_START_ID + idx;
    const dietType = inferDietType(title);
    const prepTime = 18 + (idx % 12) * 3;

    return {
      id: `${kitchenStyleId}-${idNumber}`,
      kitchenStyleId,
      title,
      prepTime,
      calories: 240 + (idx % 11) * 28,
      region: meta.region,
      dietType,
      difficulty: inferDifficulty(idNumber),
      description: `${title} — ${meta.descriptionPrefix}`,
      imageKeyword: toImageKeyword(title),
      tags: inferTags(idNumber, prepTime),
      ingredients: ingredientsFor(title, dietType, meta.defaultProtein),
      steps: [],
    };
  });
}

export function buildAllBatch8Recipes(): RecipeCatalogEntry[] {
  return Object.keys(BATCH8_DISH_POOLS).flatMap((kitchenStyleId) =>
    buildBatch8RecipesForCuisine(kitchenStyleId),
  );
}
