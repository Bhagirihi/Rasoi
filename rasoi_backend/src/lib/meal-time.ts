/**
 * Meal windows and scoring — mirrors rasoi_mobile/utils/mealTime.ts for server push picks.
 */

export type MealSlot = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'lateNight';

export const MEAL_SLOTS: MealSlot[] = ['breakfast', 'lunch', 'snack', 'dinner', 'lateNight'];

/** Local send times (hour:minute) per meal — Jamvanu-style dinner ~7 PM. */
export const MEAL_PUSH_SCHEDULE: Record<MealSlot, { hour: number; minute: number }> = {
  breakfast: { hour: 8, minute: 0 },
  lunch: { hour: 12, minute: 30 },
  snack: { hour: 16, minute: 0 },
  dinner: { hour: 19, minute: 0 },
  lateNight: { hour: 22, minute: 0 },
};

export const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: 'Breakfast pick',
  lunch: 'Lunch pick',
  snack: 'Snack pick',
  dinner: 'Dinner pick',
  lateNight: 'Late-night pick',
};

export function getMealSlot(hour: number): MealSlot {
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
  snack: ['snack', 'chaat', 'sandwich', 'pakora', 'samosa', 'bhel', 'cutting', 'chai', 'quick', 'light'],
  dinner: ['dinner', 'biryani', 'curry', 'masala', 'tikka', 'korma', 'gravy', 'butter', 'roast', 'tonight'],
  lateNight: ['snack', 'maggi', 'sandwich', 'quick', 'light', 'midnight', 'late', 'pav', 'bhurji'],
};

export function scoreRecipeForMealSlot(
  recipe: { title: string; description: string; tags: string[]; prepTime: number; calories: number },
  slot: MealSlot,
): number {
  const text = `${recipe.title} ${recipe.description} ${recipe.tags.join(' ')}`.toLowerCase();
  let score = 40;

  for (const keyword of MEAL_KEYWORDS[slot]) {
    if (text.includes(keyword)) score += 12;
  }

  if (slot === 'breakfast') {
    if (recipe.prepTime <= 15) score += 18;
    else if (recipe.prepTime <= 25) score += 10;
    else if (recipe.prepTime > 40) score -= 20;
    if (recipe.tags.includes('quick')) score += 10;
    if (recipe.calories <= 420) score += 6;
  }

  if (slot === 'lunch') {
    if (recipe.prepTime >= 20 && recipe.prepTime <= 45) score += 12;
    if (recipe.tags.includes('kids')) score += 4;
    if (text.includes('biryani')) score -= 8;
  }

  if (slot === 'snack') {
    if (recipe.prepTime <= 20) score += 16;
    if (recipe.tags.includes('quick') || recipe.tags.includes('under20')) score += 12;
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
    if (recipe.tags.includes('quick') || recipe.tags.includes('under20')) score += 14;
    if (recipe.calories <= 380) score += 8;
    if (recipe.prepTime > 35) score -= 20;
  }

  return Math.max(0, Math.min(100, score));
}

export function getLocalTimeParts(timezone: string, now = new Date()): {
  hour: number;
  minute: number;
  dayKey: string;
} {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  const year = parts.find((p) => p.type === 'year')?.value ?? '1970';
  const month = parts.find((p) => p.type === 'month')?.value ?? '01';
  const day = parts.find((p) => p.type === 'day')?.value ?? '01';

  return {
    hour: get('hour'),
    minute: get('minute'),
    dayKey: `${year}-${month}-${day}`,
  };
}

export function getMealSlotsDueNow(
  timezone: string,
  now = new Date(),
  toleranceMinutes = 15,
): MealSlot[] {
  const { hour, minute } = getLocalTimeParts(timezone, now);
  const currentMinutes = hour * 60 + minute;

  return MEAL_SLOTS.filter((slot) => {
    const schedule = MEAL_PUSH_SCHEDULE[slot];
    const targetMinutes = schedule.hour * 60 + schedule.minute;
    return Math.abs(currentMinutes - targetMinutes) <= toleranceMinutes;
  });
}

export function minutesUntilNextMeal(timezone: string, now = new Date()): number {
  const { hour, minute } = getLocalTimeParts(timezone, now);
  const currentMinutes = hour * 60 + minute;

  const allTargets = MEAL_SLOTS.map((slot) => {
    const s = MEAL_PUSH_SCHEDULE[slot];
    return s.hour * 60 + s.minute;
  }).sort((a, b) => a - b);

  const nextToday = allTargets.find((t) => t > currentMinutes);
  if (nextToday !== undefined) return nextToday - currentMinutes;

  const firstTomorrow = allTargets[0] ?? 8 * 60;
  return 24 * 60 - currentMinutes + firstTomorrow;
}

export function getNextMealSlotLabel(timezone: string, now = new Date()): MealSlot {
  const { hour, minute } = getLocalTimeParts(timezone, now);
  const currentMinutes = hour * 60 + minute;

  for (const slot of MEAL_SLOTS) {
    const s = MEAL_PUSH_SCHEDULE[slot];
    if (s.hour * 60 + s.minute > currentMinutes) return slot;
  }

  return 'breakfast';
}
