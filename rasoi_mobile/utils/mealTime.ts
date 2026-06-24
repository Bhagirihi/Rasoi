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
  /** Local meal anchor time label, e.g. "12:30". */
  anchorTimeLabel: string;
  isTomorrowBreakfast?: boolean;
  /** 21:30–03:00 shows late-night pick + tomorrow breakfast pick. */
  isOvernightDual?: boolean;
  lateNightPickEyebrow?: string;
  tomorrowTopPickEyebrow?: string;
};

export type ScheduledMealWindow = {
  slot: MealSlot;
  /** Stable key for caching home picks within this meal window. */
  windowKey: string;
  anchorHour: number;
  anchorMinute: number;
  anchorTimeLabel: string;
  isTomorrowBreakfast: boolean;
  isOvernightDual: boolean;
  tomorrowBreakfastWindowKey?: string;
};

function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}

function formatAnchorLabel(hour: number, minute: number): string {
  return `${hour}:${pad2(minute)}`;
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function minutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

const MEAL_ANCHORS: Array<{ hour: number; minute: number; slot: MealSlot }> = [
  { hour: 8, minute: 0, slot: 'breakfast' },
  { hour: 12, minute: 30, slot: 'lunch' },
  { hour: 16, minute: 0, slot: 'snack' },
  { hour: 19, minute: 30, slot: 'dinner' },
  { hour: 8, minute: 0, slot: 'breakfast' },
];

export type ScheduledMealSection = {
  slot: MealSlot;
  isTomorrowBreakfast: boolean;
  isOvernightDual: boolean;
};

/**
 * Primary Home recipe sections (local timezone):
 * - 05:00–09:30 → Breakfast
 * - 09:30–14:00 → Lunch
 * - 14:00–17:30 → Evening Snacks
 * - 17:30–21:30 → Dinner
 * - 21:30–03:00 → Late Night + Tomorrow's Breakfast (dual picks)
 * - 03:00–05:00 → Tomorrow's Breakfast only
 */
export function getScheduledMealSection(date: Date = new Date()): ScheduledMealSection {
  const nowMinutes = minutesSinceMidnight(date);
  const m300 = 3 * 60;
  const m500 = 5 * 60;
  const m930 = 9 * 60 + 30;
  const m1400 = 14 * 60;
  const m1730 = 17 * 60 + 30;
  const m2130 = 21 * 60 + 30;

  if (nowMinutes >= m2130 || nowMinutes < m300) {
    return { slot: 'lateNight', isTomorrowBreakfast: true, isOvernightDual: true };
  }
  if (nowMinutes < m500) {
    return { slot: 'breakfast', isTomorrowBreakfast: true, isOvernightDual: false };
  }
  if (nowMinutes < m930) {
    return { slot: 'breakfast', isTomorrowBreakfast: false, isOvernightDual: false };
  }
  if (nowMinutes < m1400) {
    return { slot: 'lunch', isTomorrowBreakfast: false, isOvernightDual: false };
  }
  if (nowMinutes < m1730) {
    return { slot: 'snack', isTomorrowBreakfast: false, isOvernightDual: false };
  }
  return { slot: 'dinner', isTomorrowBreakfast: false, isOvernightDual: false };
}

/** Cache keys for the 21:30–03:00 dual-pick window. */
export function getOvernightPickWindowKeys(date: Date = new Date()) {
  const nowMinutes = minutesSinceMidnight(date);
  const breakfastDate = new Date(date);
  if (nowMinutes >= 21 * 60 + 30) {
    breakfastDate.setDate(breakfastDate.getDate() + 1);
  }

  return {
    lateNightKey: `${formatDateKey(date)}-21-30-late-night`,
    tomorrowBreakfastKey: `${formatDateKey(breakfastDate)}-08-00-tomorrow-breakfast`,
  };
}

/**
 * Stable meal window for caching home picks (local timezone).
 * Anchor times: 8:00 breakfast, 12:30 lunch, 16:00 snacks, 19:30 dinner.
 */
export function getScheduledMealWindow(date: Date = new Date()): ScheduledMealWindow {
  const section = getScheduledMealSection(date);
  const nowMinutes = minutesSinceMidnight(date);
  const m2130 = 21 * 60 + 30;

  let anchor = MEAL_ANCHORS[0];
  let anchorDate = new Date(date);

  if (section.isOvernightDual) {
    const { lateNightKey, tomorrowBreakfastKey } = getOvernightPickWindowKeys(date);
    return {
      slot: section.slot,
      windowKey: lateNightKey,
      anchorHour: 21,
      anchorMinute: 30,
      anchorTimeLabel: '21:30',
      isTomorrowBreakfast: true,
      isOvernightDual: true,
      tomorrowBreakfastWindowKey: tomorrowBreakfastKey,
    };
  }

  switch (section.slot) {
    case 'breakfast':
      anchor = MEAL_ANCHORS[0];
      if (section.isTomorrowBreakfast && nowMinutes >= m2130) {
        anchorDate.setDate(anchorDate.getDate() + 1);
      }
      break;
    case 'lunch':
      anchor = MEAL_ANCHORS[1];
      break;
    case 'snack':
      anchor = MEAL_ANCHORS[2];
      break;
    case 'dinner':
      anchor = MEAL_ANCHORS[3];
      break;
    default:
      anchor = MEAL_ANCHORS[0];
  }

  const windowSuffix = section.isTomorrowBreakfast ? 'tomorrow-breakfast' : section.slot;
  const windowKey = `${formatDateKey(anchorDate)}-${pad2(anchor.hour)}-${pad2(anchor.minute)}-${windowSuffix}`;

  return {
    slot: section.slot,
    windowKey,
    anchorHour: anchor.hour,
    anchorMinute: anchor.minute,
    anchorTimeLabel: formatAnchorLabel(anchor.hour, anchor.minute),
    isTomorrowBreakfast: section.isTomorrowBreakfast,
    isOvernightDual: false,
  };
}

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

function getGreetingForHour(
  hour: number,
  slot: MealSlot,
  isTomorrowBreakfast = false,
  isOvernightDual = false,
): { greeting: string; subtitle: string } {
  if (isOvernightDual) {
    return { greeting: 'Good Night!', subtitle: 'Late-night cravings or tomorrow\'s breakfast?' };
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

export function getMealContext(hour: number = new Date().getHours()): MealContext {
  const slot = getMealSlot(hour);
  const { greeting, subtitle } = getGreetingForHour(hour, slot);

  const contexts: Record<MealSlot, Omit<MealContext, 'slot' | 'greeting' | 'subtitle' | 'anchorTimeLabel'>> = {
    breakfast: {
      topPickEyebrow: 'Breakfast pick',
      alsoLabel: 'More breakfast ideas',
      cookCta: 'Cook breakfast',
      sheetTitle: 'Cook breakfast',
    },
    lunch: {
      topPickEyebrow: 'Lunch pick',
      alsoLabel: 'More lunch ideas',
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
      alsoLabel: 'More dinner ideas',
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

  return {
    slot,
    greeting,
    subtitle,
    anchorTimeLabel: '',
    ...contexts[slot],
  };
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
