import type { RecipeCatalogEntry } from './types';
import { inferHeroIngredientFromTitle } from '../../src/lib/infer-hero-ingredient';

type DietType = RecipeCatalogEntry['dietType'];
type Difficulty = RecipeCatalogEntry['difficulty'];

export type Batch4CuisineConfig = {
  kitchenStyleId: string;
  region: string;
  descriptionPrefix: string;
  defaultProtein: string;
  titles: readonly string[];
  startId?: number;
  multiCuisine?: Record<number, string[]>;
};

function toImageKeyword(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function inferDietType(title: string): DietType {
  const lower = title.toLowerCase();
  if (
    lower.includes('egg') ||
    lower.includes('anda') ||
    lower.includes('omelette') ||
    lower.includes('omelet')
  ) {
    return 'Egg';
  }
  if (
    lower.includes('chicken') ||
    lower.includes('murgh') ||
    lower.includes('mutton') ||
    lower.includes('fish') ||
    lower.includes('prawn') ||
    lower.includes('kolmi') ||
    lower.includes('crab') ||
    lower.includes('pork') ||
    lower.includes('beef') ||
    lower.includes('lamb') ||
    lower.includes('keema') ||
    lower.includes('kaleji') ||
    lower.includes('duck') ||
    lower.includes('squid') ||
    lower.includes('meen') ||
    lower.includes('ilish') ||
    lower.includes('rui') ||
    lower.includes('bhetki') ||
    lower.includes('katla') ||
    lower.includes('hilsa') ||
    lower.includes('surmai') ||
    lower.includes('chaap') ||
    lower.includes('gosht')
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

function inferTags(idNumber: number, prepTime: number): string[] {
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
    { name: 'Masala', isStaple: true },
  ];
  if (dietType === 'Non-Veg') return [{ name: hero, isStaple: false }, ...base];
  if (dietType === 'Egg') return [{ name: hero, isStaple: false }, ...base];
  return [{ name: hero, isStaple: true }, ...base];
}

function stepsFor(title: string): string[] {
  return [
    `Prepare and portion ingredients for ${title.toLowerCase()}.`,
    'Cook the base tempering until aromatic and balanced.',
    'Add hero ingredients and cook on medium heat until the dish comes together.',
    'Finish with garnish and serve hot.',
  ];
}

export function buildBatch4Recipes(config: Batch4CuisineConfig): RecipeCatalogEntry[] {
  const startId = config.startId ?? 85;

  return config.titles.map((title, idx) => {
    const idNumber = startId + idx;
    const dietType = inferDietType(title);
    const prepTime = 18 + (idx % 12) * 3;

    return {
      id: `${config.kitchenStyleId}-${idNumber}`,
      kitchenStyleId: config.kitchenStyleId,
      ...(config.multiCuisine?.[idNumber]
        ? { kitchenStyleIds: config.multiCuisine[idNumber] }
        : {}),
      title,
      prepTime,
      calories: 240 + (idx % 11) * 28,
      region: config.region,
      dietType,
      difficulty: inferDifficulty(idNumber),
      description: `${title} — ${config.descriptionPrefix}`,
      imageKeyword: toImageKeyword(title),
      tags: inferTags(idNumber, prepTime),
      ingredients: ingredientsFor(title, dietType, config.defaultProtein),
      steps: stepsFor(title),
    };
  });
}
