import type { Recipe } from '@/data/mockRecipes';

import {
  getMealSlot as getMealSlotFromWindows,
  getScheduledMealSection,
  getScheduledMealWindow,
  type MealSlot,
  type ScheduledMealSection,
  type ScheduledMealWindow,
} from '@/constants/mealTimeWindows';

export type { MealSlot, ScheduledMealSection, ScheduledMealWindow };
export {
  formatDayKey,
  getOvernightPickWindowKeys,
  getScheduledMealSection,
  getScheduledMealWindow,
} from '@/constants/mealTimeWindows';

export type MealContext = {
  slot: MealSlot;
  greeting: string;
  subtitle: string;
  topPickEyebrow: string;
  alsoLabel: string;
  cookCta: string;
  sheetTitle: string;
  anchorTimeLabel: string;
  isTomorrowBreakfast?: boolean;
  isOvernightDual?: boolean;
  lateNightPickEyebrow?: string;
  tomorrowTopPickEyebrow?: string;
  /** Server-generated reason for the top pick (when available). */
  topPickReason?: string;
};

function mealLabelsForSlot(
  slot: MealSlot,
  isTomorrowBreakfast: boolean,
  isOvernightDual: boolean,
): Omit<
  MealContext,
  'slot' | 'greeting' | 'subtitle' | 'anchorTimeLabel' | 'isTomorrowBreakfast' | 'isOvernightDual'
> & {
  planningSubtitle: string;
} {
  if (isOvernightDual) {
    return {
      topPickEyebrow: "🌅 Tomorrow's breakfast pick",
      lateNightPickEyebrow: '🌙 Late night pick',
      tomorrowTopPickEyebrow: "🌅 Tomorrow's breakfast pick",
      alsoLabel: 'More breakfast ideas for tomorrow',
      cookCta: 'Cook now',
      sheetTitle: "Tomorrow's breakfast",
      planningSubtitle: "Tomorrow's breakfast",
    };
  }

  if (isTomorrowBreakfast) {
    return {
      topPickEyebrow: "🌅 Tomorrow's breakfast pick",
      alsoLabel: 'More breakfast ideas for tomorrow',
      cookCta: 'Plan breakfast',
      sheetTitle: "Tomorrow's breakfast",
      planningSubtitle: "Tomorrow's breakfast",
    };
  }

  const labels: Record<
    MealSlot,
    Omit<
      MealContext,
      'slot' | 'greeting' | 'subtitle' | 'anchorTimeLabel' | 'isTomorrowBreakfast' | 'isOvernightDual'
    > & { planningSubtitle: string }
  > = {
    breakfast: {
      topPickEyebrow: '🌅 Breakfast pick',
      alsoLabel: 'More breakfast ideas',
      cookCta: 'Cook breakfast',
      sheetTitle: 'Cook breakfast',
      planningSubtitle: 'Breakfast',
    },
    lunch: {
      topPickEyebrow: '🍛 Lunch pick',
      alsoLabel: 'More lunch ideas',
      cookCta: 'Cook lunch',
      sheetTitle: 'Cook lunch',
      planningSubtitle: 'Lunch',
    },
    snack: {
      topPickEyebrow: '☕ Evening snack pick',
      alsoLabel: 'More evening snack ideas',
      cookCta: 'Make snack',
      sheetTitle: 'Evening snacks',
      planningSubtitle: 'Evening snacks',
    },
    dinner: {
      topPickEyebrow: '🍽️ Dinner pick',
      alsoLabel: 'More dinner ideas',
      cookCta: 'Cook dinner',
      sheetTitle: 'Cook dinner',
      planningSubtitle: 'Dinner',
    },
    lateNight: {
      topPickEyebrow: '🌙 Late night pick',
      alsoLabel: '',
      cookCta: 'Cook now',
      sheetTitle: 'Cook now',
      planningSubtitle: 'Late night cravings',
    },
  };

  return labels[slot];
}

function getGreetingForHour(
  hour: number,
  slot: MealSlot,
  isTomorrowBreakfast = false,
  isOvernightDual = false,
): { greeting: string; subtitle: string } {
  if (isOvernightDual) {
    return { greeting: 'Good Night!', subtitle: "Late-night cravings or tomorrow's breakfast?" };
  }

  if (isTomorrowBreakfast) {
    return {
      greeting: hour >= 22 || hour < 5 ? 'Good Night!' : 'Good Morning!',
      subtitle: "Planning tomorrow's breakfast?",
    };
  }

  switch (slot) {
    case 'breakfast':
      return { greeting: 'Good Morning!', subtitle: "What's for breakfast?" };
    case 'lunch':
      return { greeting: hour < 12 ? 'Good Morning!' : 'Good Afternoon!', subtitle: 'Planning lunch?' };
    case 'snack':
      return { greeting: 'Good Afternoon!', subtitle: 'Time for evening snacks?' };
    case 'dinner':
      return { greeting: 'Good Evening!', subtitle: 'Planning dinner?' };
    case 'lateNight':
      return { greeting: 'Good Night!', subtitle: 'Late-night cravings?' };
  }
}

export function getScheduledMealContext(date: Date = new Date()): MealContext {
  const window = getScheduledMealWindow(date);
  const hour = date.getHours();
  const { greeting } = getGreetingForHour(
    hour,
    window.slot,
    window.isTomorrowBreakfast,
    window.isOvernightDual,
  );
  const labels = mealLabelsForSlot(window.slot, window.isTomorrowBreakfast, window.isOvernightDual);

  let subtitle: string;
  if (window.isOvernightDual) {
    subtitle = 'Late-night bite now · plan breakfast for 8:00';
  } else if (window.isTomorrowBreakfast) {
    subtitle = `Plan for ${window.anchorTimeLabel} tomorrow · ${labels.planningSubtitle.toLowerCase()}`;
  } else {
    subtitle = `What to make around ${window.anchorTimeLabel} · ${labels.planningSubtitle.toLowerCase()}`;
  }

  return {
    slot: window.slot,
    greeting,
    subtitle,
    topPickEyebrow: labels.topPickEyebrow,
    alsoLabel: labels.alsoLabel,
    cookCta: labels.cookCta,
    sheetTitle: labels.sheetTitle,
    anchorTimeLabel: window.isOvernightDual ? '8:00' : window.anchorTimeLabel,
    isTomorrowBreakfast: window.isTomorrowBreakfast,
    isOvernightDual: window.isOvernightDual,
    lateNightPickEyebrow: labels.lateNightPickEyebrow,
    tomorrowTopPickEyebrow: labels.tomorrowTopPickEyebrow,
  };
}

/** Minute-level meal slot — mirrors rasoi_backend/src/lib/meal-time.ts */
export function getMealSlot(hour: number = new Date().getHours(), minute = new Date().getMinutes()): MealSlot {
  return getMealSlotFromWindows(hour, minute);
}

export function getMealContext(hour: number = new Date().getHours()): MealContext {
  const now = new Date();
  now.setHours(hour, 0, 0, 0);
  return getScheduledMealContext(now);
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
