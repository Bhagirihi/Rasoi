/**
 * Keep in sync with rasoi_backend/src/lib/meal-time.ts (MEAL_SECTION_MINUTES + scheduling).
 */

export type MealSlot = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'lateNight';

export const MEAL_SECTION_MINUTES = {
  m0300: 3 * 60,
  m0500: 5 * 60,
  m0930: 9 * 60 + 30,
  m1400: 14 * 60,
  m1730: 17 * 60 + 30,
  m2130: 21 * 60 + 30,
} as const;

export type ScheduledMealSection = {
  slot: MealSlot;
  isTomorrowBreakfast: boolean;
  isOvernightDual: boolean;
};

export type ScheduledMealWindow = {
  slot: MealSlot;
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

export function getMealSlot(hour: number, minute = 0): MealSlot {
  return getScheduledMealSectionFromMinutes(minutesSinceMidnight(hour, minute)).slot;
}
