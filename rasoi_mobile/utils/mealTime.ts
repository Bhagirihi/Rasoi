import type { Recipe } from '@/data/mockRecipes';

export type MealSlot = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'lateNight';

export type MealContext = {
  slot: MealSlot;
  greeting: string;
  subtitle: string;
  topPickEyebrow: string;
  alsoLabel: string;
  cookCta: string;
  sheetTitle: string;
};

/**
 * Meal windows (local time):
 * - 5 AM – 10 AM → breakfast
 * - 10 AM – 2 PM → lunch
 * - 2 PM – 5 PM → snack
 * - 5 PM – 10 PM → dinner
 * - 10 PM – 5 AM → late-night / light snack
 */
export function getMealSlot(hour: number = new Date().getHours()): MealSlot {
  if (hour >= 22 || hour < 5) return 'lateNight';
  if (hour >= 5 && hour < 10) return 'breakfast';
  if (hour >= 10 && hour < 14) return 'lunch';
  if (hour >= 14 && hour < 17) return 'snack';
  return 'dinner';
}

const MEAL_KEYWORDS: Record<MealSlot, string[]> = {
  breakfast: [
    'breakfast',
    'poha',
    'paratha',
    'dosa',
    'idli',
    'upma',
    'bhurji',
    'omelette',
    'oats',
    'chilla',
    'thepla',
    'misal',
    'pav',
    'morning',
  ],
  lunch: [
    'lunch',
    'dal',
    'roti',
    'sabzi',
    'rajma',
    'chole',
    'pulao',
    'khichdi',
    'thali',
    'rice',
    'paneer',
    'palak',
    'bhindi',
  ],
  snack: [
    'snack',
    'chaat',
    'sandwich',
    'pakora',
    'samosa',
    'bhel',
    'cutting',
    'chai',
    'quick',
    'light',
  ],
  dinner: [
    'dinner',
    'biryani',
    'curry',
    'masala',
    'tikka',
    'korma',
    'gravy',
    'butter',
    'roast',
    'tonight',
  ],
  lateNight: ['snack', 'maggi', 'sandwich', 'quick', 'light', 'midnight', 'late', 'pav', 'bhurji'],
};

function getGreetingForHour(hour: number, slot: MealSlot): { greeting: string; subtitle: string } {
  switch (slot) {
    case 'breakfast':
      return { greeting: 'Good Morning!', subtitle: "What's for breakfast?" };
    case 'lunch':
      return { greeting: hour < 12 ? 'Good Morning!' : 'Good Afternoon!', subtitle: 'Planning lunch?' };
    case 'snack':
      return { greeting: 'Good Afternoon!', subtitle: 'Time for a snack?' };
    case 'dinner':
      return { greeting: 'Good Evening!', subtitle: 'Planning dinner?' };
    case 'lateNight':
      return { greeting: 'Good Night!', subtitle: 'Late-night cravings?' };
  }
}

export function getMealContext(hour: number = new Date().getHours()): MealContext {
  const slot = getMealSlot(hour);
  const { greeting, subtitle } = getGreetingForHour(hour, slot);

  const contexts: Record<MealSlot, Omit<MealContext, 'slot' | 'greeting' | 'subtitle'>> = {
    breakfast: {
      topPickEyebrow: 'Breakfast pick',
      alsoLabel: 'Also for breakfast',
      cookCta: 'Cook breakfast',
      sheetTitle: 'Cook breakfast',
    },
    lunch: {
      topPickEyebrow: 'Lunch pick',
      alsoLabel: 'Also for lunch',
      cookCta: 'Cook lunch',
      sheetTitle: 'Cook lunch',
    },
    snack: {
      topPickEyebrow: 'Snack pick',
      alsoLabel: 'More snack ideas',
      cookCta: 'Make snack',
      sheetTitle: 'Make snack',
    },
    dinner: {
      topPickEyebrow: 'Dinner pick',
      alsoLabel: 'Also for dinner',
      cookCta: 'Cook dinner',
      sheetTitle: 'Cook dinner',
    },
    lateNight: {
      topPickEyebrow: 'Late-night pick',
      alsoLabel: 'More late-night ideas',
      cookCta: 'Cook now',
      sheetTitle: 'Cook now',
    },
  };

  return { slot, greeting, subtitle, ...contexts[slot] };
}

function recipeSearchText(recipe: Recipe): string {
  const tags = Array.isArray(recipe.tags) ? recipe.tags.join(' ') : '';
  return `${recipe.title ?? ''} ${recipe.description ?? ''} ${tags}`.toLowerCase();
}

export function scoreRecipeForMealSlot(recipe: Recipe, slot: MealSlot): number {
  const text = recipeSearchText(recipe);
  let score = 40;

  for (const keyword of MEAL_KEYWORDS[slot]) {
    if (text.includes(keyword)) {
      score += 12;
    }
  }

  if (slot === 'breakfast') {
    if (recipe.prepTime <= 15) score += 18;
    else if (recipe.prepTime <= 25) score += 10;
    else if (recipe.prepTime > 40) score -= 20;
    if (recipe.tags?.includes('quick')) score += 10;
    if (recipe.calories <= 420) score += 6;
  }

  if (slot === 'lunch') {
    if (recipe.prepTime >= 20 && recipe.prepTime <= 45) score += 12;
    if (recipe.tags?.includes('kids')) score += 4;
    if (text.includes('biryani')) score -= 8;
  }

  if (slot === 'snack') {
    if (recipe.prepTime <= 20) score += 16;
    if (recipe.tags?.includes('quick') || recipe.tags?.includes('under20')) score += 12;
    if (recipe.calories <= 400) score += 8;
    if (recipe.prepTime > 40) score -= 15;
  }

  if (slot === 'dinner') {
    if (recipe.prepTime >= 25) score += 8;
    if (recipe.calories >= 450) score += 6;
    if (text.includes('biryani') || text.includes('curry')) score += 10;
  }

  if (slot === 'lateNight') {
    if (recipe.prepTime <= 15) score += 18;
    if (recipe.tags?.includes('quick') || recipe.tags?.includes('under20')) score += 14;
    if (recipe.calories <= 380) score += 8;
    if (recipe.prepTime > 35) score -= 20;
  }

  return Math.max(0, Math.min(100, score));
}

export function getMealQuickReasonSuffix(slot: MealSlot): string {
  switch (slot) {
    case 'breakfast':
      return 'quick this morning';
    case 'lunch':
      return 'great for lunch';
    case 'snack':
      return 'perfect snack';
    case 'lateNight':
      return 'easy late-night fix';
    default:
      return 'great for dinner';
  }
}
