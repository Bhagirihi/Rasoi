/**
 * Canonical meal windows, scheduling, and scoring for Rasoi.
 * Mobile UI copies boundaries from here — keep rasoi_mobile/constants/mealTimeWindows.ts in sync.
 */

export type MealSlot = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'lateNight';

export const MEAL_SLOTS: MealSlot[] = ['breakfast', 'lunch', 'snack', 'dinner', 'lateNight'];

/** Local send times (hour:minute) per meal — push cron tolerance windows. */
export const MEAL_PUSH_SCHEDULE: Record<MealSlot, { hour: number; minute: number }> = {
  breakfast: { hour: 8, minute: 0 },
  lunch: { hour: 12, minute: 30 },
  snack: { hour: 16, minute: 0 },
  dinner: { hour: 19, minute: 30 },
  lateNight: { hour: 22, minute: 0 },
};

export const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: 'Breakfast pick',
  lunch: 'Lunch pick',
  snack: 'Snack pick',
  dinner: 'Dinner pick',
  lateNight: 'Late-night pick',
};

/** Minutes since midnight — section boundaries (local timezone). */
export const MEAL_SECTION_MINUTES = {
  /** 03:00 — end of overnight dual / start of tomorrow-breakfast-only */
  m0300: 3 * 60,
  /** 05:00 — breakfast day start */
  m0500: 5 * 60,
  /** 09:30 — breakfast → lunch */
  m0930: 9 * 60 + 30,
  /** 14:00 — lunch → snacks */
  m1400: 14 * 60,
  /** 17:30 — snacks → dinner */
  m1730: 17 * 60 + 30,
  /** 21:30 — dinner → overnight dual */
  m2130: 21 * 60 + 30,
} as const;

export type ScheduledMealSection = {
  slot: MealSlot;
  isTomorrowBreakfast: boolean;
  isOvernightDual: boolean;
};

export type ScheduledMealWindow = {
  slot: MealSlot;
  /** Stable key for recommendation cache within this meal window. */
  windowKey: string;
  dayKey: string;
  anchorHour: number;
  anchorMinute: number;
  anchorTimeLabel: string;
  isTomorrowBreakfast: boolean;
  isOvernightDual: boolean;
  tomorrowBreakfastWindowKey?: string;
};

const MEAL_ANCHORS: Record<MealSlot, { hour: number; minute: number }> = {
  breakfast: { hour: 8, minute: 0 },
  lunch: { hour: 12, minute: 30 },
  snack: { hour: 16, minute: 0 },
  dinner: { hour: 19, minute: 30 },
  lateNight: { hour: 21, minute: 30 },
};

function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}

function formatAnchorLabel(hour: number, minute: number): string {
  return `${hour}:${pad2(minute)}`;
}

export function formatDayKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function minutesSinceMidnight(hour: number, minute: number): number {
  return hour * 60 + minute;
}

/**
 * Primary Home recipe sections (local timezone):
 * - 05:00–09:30 → Breakfast
 * - 09:30–14:00 → Lunch
 * - 14:00–17:30 → Evening Snacks
 * - 17:30–21:30 → Dinner
 * - 21:30–03:00 → Late Night + Tomorrow's Breakfast (dual picks)
 * - 03:00–05:00 → Tomorrow's Breakfast only
 */
export function getScheduledMealSectionFromMinutes(nowMinutes: number): ScheduledMealSection {
  const { m0300, m0500, m0930, m1400, m1730, m2130 } = MEAL_SECTION_MINUTES;

  if (nowMinutes >= m2130 || nowMinutes < m0300) {
    return { slot: 'lateNight', isTomorrowBreakfast: true, isOvernightDual: true };
  }
  if (nowMinutes < m0500) {
    return { slot: 'breakfast', isTomorrowBreakfast: true, isOvernightDual: false };
  }
  if (nowMinutes < m0930) {
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

export function getScheduledMealSection(date: Date = new Date()): ScheduledMealSection {
  return getScheduledMealSectionFromMinutes(minutesSinceMidnight(date.getHours(), date.getMinutes()));
}

export function getOvernightPickWindowKeys(date: Date = new Date()) {
  const nowMinutes = minutesSinceMidnight(date.getHours(), date.getMinutes());
  const breakfastDate = new Date(date);
  if (nowMinutes >= MEAL_SECTION_MINUTES.m2130) {
    breakfastDate.setDate(breakfastDate.getDate() + 1);
  }

  return {
    lateNightKey: `${formatDayKey(date)}-21-30-late-night`,
    tomorrowBreakfastKey: `${formatDayKey(breakfastDate)}-08-00-tomorrow-breakfast`,
  };
}

export function getScheduledMealWindow(date: Date = new Date()): ScheduledMealWindow {
  const section = getScheduledMealSection(date);
  const nowMinutes = minutesSinceMidnight(date.getHours(), date.getMinutes());
  const dayKey = formatDayKey(date);

  if (section.isOvernightDual) {
    const { lateNightKey, tomorrowBreakfastKey } = getOvernightPickWindowKeys(date);
    return {
      slot: section.slot,
      windowKey: lateNightKey,
      dayKey,
      anchorHour: 21,
      anchorMinute: 30,
      anchorTimeLabel: '21:30',
      isTomorrowBreakfast: true,
      isOvernightDual: true,
      tomorrowBreakfastWindowKey: tomorrowBreakfastKey,
    };
  }

  const anchor = MEAL_ANCHORS[section.slot];
  const anchorDate = new Date(date);

  if (section.slot === 'breakfast' && section.isTomorrowBreakfast && nowMinutes >= MEAL_SECTION_MINUTES.m2130) {
    anchorDate.setDate(anchorDate.getDate() + 1);
  }

  const windowSuffix = section.isTomorrowBreakfast ? 'tomorrow-breakfast' : section.slot;
  const windowKey = `${formatDayKey(anchorDate)}-${pad2(anchor.hour)}-${pad2(anchor.minute)}-${windowSuffix}`;

  return {
    slot: section.slot,
    windowKey,
    dayKey: formatDayKey(anchorDate),
    anchorHour: anchor.hour,
    anchorMinute: anchor.minute,
    anchorTimeLabel: formatAnchorLabel(anchor.hour, anchor.minute),
    isTomorrowBreakfast: section.isTomorrowBreakfast,
    isOvernightDual: false,
  };
}

/** Meal slot from local hour + minute (minute-level boundaries). */
export function getMealSlot(hour: number, minute = 0): MealSlot {
  return getScheduledMealSectionFromMinutes(minutesSinceMidnight(hour, minute)).slot;
}

export function getLocalTimeParts(timezone: string, now = new Date()): {
  hour: number;
  minute: number;
  month: number;
  day: number;
  dayKey: string;
  dayOfWeek: number;
} {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });

  const parts = formatter.formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  const year = parts.find((p) => p.type === 'year')?.value ?? '1970';
  const month = parts.find((p) => p.type === 'month')?.value ?? '01';
  const day = parts.find((p) => p.type === 'day')?.value ?? '01';
  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon';
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  return {
    hour: get('hour'),
    minute: get('minute'),
    month: Number(month),
    day: Number(day),
    dayKey: `${year}-${month}-${day}`,
    dayOfWeek: weekdayMap[weekday] ?? 1,
  };
}

export function getScheduledMealWindowForTimezone(timezone: string, now = new Date()): ScheduledMealWindow {
  const { hour, minute, dayKey } = getLocalTimeParts(timezone, now);
  const section = getScheduledMealSectionFromMinutes(minutesSinceMidnight(hour, minute));

  if (section.isOvernightDual) {
    const lateNightKey = `${dayKey}-21-30-late-night`;
    const breakfastDayKey = hour * 60 + minute >= MEAL_SECTION_MINUTES.m2130 ? addDayToDayKey(dayKey, 1) : dayKey;
    const tomorrowBreakfastKey = `${breakfastDayKey}-08-00-tomorrow-breakfast`;
    return {
      slot: section.slot,
      windowKey: lateNightKey,
      dayKey,
      anchorHour: 21,
      anchorMinute: 30,
      anchorTimeLabel: '21:30',
      isTomorrowBreakfast: true,
      isOvernightDual: true,
      tomorrowBreakfastWindowKey: tomorrowBreakfastKey,
    };
  }

  const anchor = MEAL_ANCHORS[section.slot];
  let anchorDayKey = dayKey;
  if (section.isTomorrowBreakfast) {
    anchorDayKey = addDayToDayKey(dayKey, 1);
  }

  const windowSuffix = section.isTomorrowBreakfast ? 'tomorrow-breakfast' : section.slot;
  const windowKey = `${anchorDayKey}-${pad2(anchor.hour)}-${pad2(anchor.minute)}-${windowSuffix}`;

  return {
    slot: section.slot,
    windowKey,
    dayKey: anchorDayKey,
    anchorHour: anchor.hour,
    anchorMinute: anchor.minute,
    anchorTimeLabel: formatAnchorLabel(anchor.hour, anchor.minute),
    isTomorrowBreakfast: section.isTomorrowBreakfast,
    isOvernightDual: false,
  };
}

function addDayToDayKey(dayKey: string, days: number): string {
  const [year, month, day] = dayKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return formatDayKey(date);
}

export function isWeekend(dayOfWeek: number): boolean {
  return dayOfWeek === 0 || dayOfWeek === 6;
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

export function getMealSlotsDueNow(
  timezone: string,
  now = new Date(),
  toleranceMinutes = 15,
): MealSlot[] {
  const { hour, minute } = getLocalTimeParts(timezone, now);
  const currentMinutes = minutesSinceMidnight(hour, minute);

  return MEAL_SLOTS.filter((slot) => {
    const schedule = MEAL_PUSH_SCHEDULE[slot];
    const targetMinutes = schedule.hour * 60 + schedule.minute;
    return Math.abs(currentMinutes - targetMinutes) <= toleranceMinutes;
  });
}

export function minutesUntilNextMeal(timezone: string, now = new Date()): number {
  const { hour, minute } = getLocalTimeParts(timezone, now);
  const currentMinutes = minutesSinceMidnight(hour, minute);

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
  const currentMinutes = minutesSinceMidnight(hour, minute);

  for (const slot of MEAL_SLOTS) {
    const s = MEAL_PUSH_SCHEDULE[slot];
    if (s.hour * 60 + s.minute > currentMinutes) return slot;
  }

  return 'breakfast';
}

/** Stable cache window key for a meal slot on a given local day. */
export function windowKeyForMealSlot(dayKey: string, mealSlot: MealSlot): string {
  if (mealSlot === 'lateNight') {
    return `${dayKey}-21-30-late-night`;
  }
  const anchor = MEAL_ANCHORS[mealSlot];
  return `${dayKey}-${pad2(anchor.hour)}-${pad2(anchor.minute)}-${mealSlot}`;
}
