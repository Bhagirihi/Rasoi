import {
  BATCH9_CATEGORY_META,
  BATCH9_DISH_POOLS,
  BATCH9_RECIPES_PER_CATEGORY,
  BATCH9_STYLE_PREFIXES,
  type Batch9CategoryId,
} from './batch9-dish-pools';
import type { RecipeCatalogEntry } from './types';

type DietType = RecipeCatalogEntry['dietType'];
type Difficulty = RecipeCatalogEntry['difficulty'];

function toImageKeyword(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function inferDietType(title: string): DietType {
  const lower = title.toLowerCase();
  if (lower.includes('egg') || lower.includes('omelette') || lower.includes('omelet')) {
    return 'Egg';
  }
  if (
    lower.includes('chicken') ||
    lower.includes('fish') ||
    lower.includes('prawn') ||
    lower.includes('shrimp') ||
    lower.includes('mutton') ||
    lower.includes('beef') ||
    lower.includes('pork') ||
    lower.includes('lamb') ||
    lower.includes('salmon') ||
    lower.includes('carnitas') ||
    lower.includes('keema') ||
    lower.includes('osso buco') ||
    lower.includes('seafood') ||
    lower.includes('duck')
  ) {
    return 'Non-Veg';
  }
  return 'Veg';
}

function resolveDietType(categoryId: Batch9CategoryId, title: string): DietType {
  switch (categoryId) {
    case 'jain':
    case 'vegan':
    case 'vegetarian':
    case 'healthy':
    case 'weight-loss':
    case 'kids-special':
    case 'diabetic-friendly':
      return 'Veg';
    case 'high-protein':
      return inferDietType(title);
    default:
      return inferDietType(title);
  }
}

function inferDifficulty(idNumber: number): Difficulty {
  if (idNumber % 11 === 0) return 'Hard';
  if (idNumber % 2 === 0) return 'Medium';
  return 'Easy';
}

function inferTags(categoryId: Batch9CategoryId, idNumber: number, prepTime: number): string[] {
  if (categoryId === 'kids-special') {
    return prepTime <= 20 ? ['kids', 'under20', 'quick'] : ['kids', 'quick'];
  }
  if (categoryId === 'weight-loss' || categoryId === 'healthy' || categoryId === 'diabetic-friendly') {
    return prepTime <= 20 ? ['under20', 'quick'] : ['quick'];
  }
  if (prepTime <= 20) return ['under20', 'quick'];
  if (idNumber % 5 === 0) return ['festive', 'kids'];
  if (idNumber % 3 === 0) return ['quick', 'leftover'];
  return ['quick', 'kids'];
}

function inferCalories(categoryId: Batch9CategoryId, idx: number): number {
  const base = 240 + (idx % 11) * 28;
  switch (categoryId) {
    case 'weight-loss':
      return 160 + (idx % 9) * 18;
    case 'diabetic-friendly':
      return 190 + (idx % 8) * 20;
    case 'healthy':
      return 210 + (idx % 10) * 22;
    case 'high-protein':
      return 320 + (idx % 12) * 30;
    case 'kids-special':
      return 260 + (idx % 8) * 24;
    default:
      return base;
  }
}

function inferProtein(title: string, fallback: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('fish') || lower.includes('salmon')) return 'Fish';
  if (lower.includes('prawn') || lower.includes('shrimp') || lower.includes('squid')) return 'Prawns';
  if (lower.includes('chicken') || lower.includes('piccata') || lower.includes('schnitzel')) return 'Chicken';
  if (lower.includes('mutton') || lower.includes('beef') || lower.includes('pork') || lower.includes('lamb')) {
    return 'Mutton';
  }
  if (lower.includes('egg')) return 'Anda';
  if (lower.includes('paneer') || lower.includes('burrata') || lower.includes('ricotta')) return 'Paneer';
  if (lower.includes('tofu') || lower.includes('tempeh')) return 'Tofu';
  if (lower.includes('chickpea') || lower.includes('chana') || lower.includes('rajma')) return 'Chana';
  if (lower.includes('dal') || lower.includes('lentil') || lower.includes('moong')) return 'Dal';
  if (lower.includes('quinoa') || lower.includes('millet') || lower.includes('bajra') || lower.includes('ragi')) {
    return 'Millet';
  }
  if (lower.includes('mushroom')) return 'Mushroom';
  if (lower.includes('jackfruit')) return 'Kathal';
  return fallback;
}

function ingredientsFor(
  categoryId: Batch9CategoryId,
  title: string,
  dietType: DietType,
  fallback: string,
): Array<{ name: string; isStaple: boolean }> {
  const hero = inferProtein(title, fallback);

  if (categoryId === 'jain') {
    return [
      { name: hero, isStaple: true },
      { name: 'Tamatar', isStaple: true },
      { name: 'Adrak', isStaple: true },
      { name: 'Hing', isStaple: true },
      { name: 'Haldi', isStaple: true },
      { name: 'Namak', isStaple: true },
      { name: 'Tel', isStaple: true },
    ];
  }

  if (categoryId === 'vegan') {
    return [
      { name: hero, isStaple: true },
      { name: 'Tamatar', isStaple: true },
      { name: 'Pyaaz', isStaple: true },
      { name: 'Adrak', isStaple: true },
      { name: 'Haldi', isStaple: true },
      { name: 'Namak', isStaple: true },
      { name: 'Tel', isStaple: true },
    ];
  }

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
  for (const prefix of BATCH9_STYLE_PREFIXES) {
    for (const dish of baseDishes) {
      const title = prefix ? `${prefix} ${dish}` : dish;
      if (!titles.some((entry) => entry.toLowerCase() === title.toLowerCase())) {
        titles.push(title);
      }
    }
  }
  return titles.slice(0, BATCH9_RECIPES_PER_CATEGORY);
}

export function buildBatch9RecipesForCategory(categoryId: Batch9CategoryId): RecipeCatalogEntry[] {
  const meta = BATCH9_CATEGORY_META[categoryId];
  const baseDishes = BATCH9_DISH_POOLS[categoryId];
  const titles = buildTitles(baseDishes);

  if (titles.length < BATCH9_RECIPES_PER_CATEGORY) {
    throw new Error(`${categoryId}: only ${titles.length} unique titles (need ${BATCH9_RECIPES_PER_CATEGORY})`);
  }

  return titles.map((title, idx) => {
    const idNumber = idx + 1;
    const dietType = resolveDietType(categoryId, title);
    const prepTime =
      categoryId === 'weight-loss' || categoryId === 'healthy' || categoryId === 'diabetic-friendly'
        ? 14 + (idx % 10) * 2
        : 18 + (idx % 12) * 3;

    return {
      id: `${categoryId}-b9-${String(idNumber).padStart(3, '0')}`,
      kitchenStyleId: categoryId,
      title,
      prepTime,
      calories: inferCalories(categoryId, idx),
      region: meta.region,
      dietType,
      difficulty: inferDifficulty(idNumber),
      description: `${title} — ${meta.descriptionPrefix}`,
      imageKeyword: toImageKeyword(title),
      tags: inferTags(categoryId, idNumber, prepTime),
      ingredients: ingredientsFor(categoryId, title, dietType, meta.defaultProtein),
      steps: [],
    };
  });
}

export function buildAllBatch9Recipes(): RecipeCatalogEntry[] {
  return (Object.keys(BATCH9_DISH_POOLS) as Batch9CategoryId[]).flatMap((categoryId) =>
    buildBatch9RecipesForCategory(categoryId),
  );
}
