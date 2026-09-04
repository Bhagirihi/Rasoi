import type { RecipeCatalogEntry } from './types';

type DietType = RecipeCatalogEntry['dietType'];
type Difficulty = RecipeCatalogEntry['difficulty'];

export type Batch6DishSeed = {
  title: string;
  dietType?: DietType;
  prepTime: number;
  calories: number;
  difficulty: Difficulty;
  description: string;
  imageKeyword: string;
  tags: RecipeCatalogEntry['tags'];
  ingredients: Array<{ name: string; isStaple: boolean }>;
};

export type Batch6CuisineConfig = {
  kitchenStyleId: string;
  region: string;
  startId: number;
  dishes: Batch6DishSeed[];
};

function inferDietType(title: string, fallback: DietType = 'Veg'): DietType {
  const lower = title.toLowerCase();
  if (lower.includes('egg') || lower.includes('anda') || lower.includes('omelette')) return 'Egg';
  if (
    lower.includes('chicken') ||
    lower.includes('murgh') ||
    lower.includes('mutton') ||
    lower.includes('fish') ||
    lower.includes('meen') ||
    lower.includes('prawn') ||
    lower.includes('gosht') ||
    lower.includes('pork') ||
    lower.includes('duck') ||
    lower.includes('crab') ||
    lower.includes('lamb') ||
    lower.includes('keema') ||
    lower.includes('haleem') ||
    lower.includes('saus') ||
    lower.includes('sorpotel')
  ) {
    return 'Non-Veg';
  }
  return fallback;
}

export function buildBatch6Recipes(config: Batch6CuisineConfig): RecipeCatalogEntry[] {
  return config.dishes.map((dish, idx) => {
    const idNumber = config.startId + idx;
    const dietType = dish.dietType ?? inferDietType(dish.title);

    return {
      id: `${config.kitchenStyleId}-${idNumber}`,
      kitchenStyleId: config.kitchenStyleId,
      title: dish.title,
      prepTime: dish.prepTime,
      calories: dish.calories,
      region: config.region,
      dietType,
      difficulty: dish.difficulty,
      description: dish.description,
      imageKeyword: dish.imageKeyword,
      tags: dish.tags,
      ingredients: dish.ingredients,
      steps: [],
    };
  });
}
