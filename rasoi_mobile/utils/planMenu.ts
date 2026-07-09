import type { Recipe } from '@/data/mockRecipes';
import { scoreRecipeForMealSlot, type MealSlot } from '@/utils/mealTime';

export const PLAN_DAY_OFFSETS = [0, 1, 2] as const;
export type PlanDayOffset = (typeof PLAN_DAY_OFFSETS)[number];

const DAY_MS = 24 * 60 * 60 * 1000;

export const PLAN_SLOTS: Array<{
  slot: MealSlot;
  label: string;
}> = [
  { slot: 'breakfast', label: 'Breakfast' },
  { slot: 'lunch', label: 'Lunch' },
  { slot: 'snack', label: 'Snack' },
  { slot: 'dinner', label: 'Dinner' },
  { slot: 'lateNight', label: 'Late night' },
];

export type PlanDayOption = {
  offset: PlanDayOffset;
  date: Date;
  segmentLabel: string;
  heading: string;
  caption: string;
};

export type PlanMenuEntry = {
  slot: MealSlot;
  label: string;
  recipe: Recipe;
};

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function dayKey(date: Date): number {
  return Math.floor(date.getTime() / DAY_MS);
}

function formatDateCaption(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatPlanDayHeading(date: Date): string {
  const today = startOfToday();
  const diffDays = Math.round((date.getTime() - today.getTime()) / DAY_MS);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return date.toLocaleDateString(undefined, { weekday: 'long' });
}

export function buildPlanDayOptions(): PlanDayOption[] {
  const today = startOfToday();
  return PLAN_DAY_OFFSETS.map((offset) => {
    const date = new Date(today.getTime() + offset * DAY_MS);
    const segmentLabel =
      offset === 0
        ? 'Today'
        : offset === 1
          ? 'Tomorrow'
          : date.toLocaleDateString(undefined, { weekday: 'short' });
    return {
      offset,
      date,
      segmentLabel,
      heading: formatPlanDayHeading(date),
      caption: formatDateCaption(date),
    };
  });
}

function pickForSlot(pool: Recipe[], slot: MealSlot, seed: number): Recipe | null {
  if (pool.length === 0) return null;
  const ranked = [...pool].sort(
    (a, b) => scoreRecipeForMealSlot(b, slot) - scoreRecipeForMealSlot(a, slot),
  );
  const topCount = Math.min(5, ranked.length);
  return ranked[seed % topCount] ?? ranked[0];
}

export function buildMenuForDate(
  eligibleRecipes: Recipe[],
  date: Date,
  shuffleSalt = 0,
): PlanMenuEntry[] {
  if (eligibleRecipes.length === 0) return [];

  const seed = dayKey(date) + shuffleSalt * 13;
  const used = new Set<string>();
  const result: PlanMenuEntry[] = [];

  PLAN_SLOTS.forEach((entry, index) => {
    const available = eligibleRecipes.filter((recipe) => !used.has(recipe.id));
    const pool = available.length > 0 ? available : eligibleRecipes;
    const recipe = pickForSlot(pool, entry.slot, seed + index * 7);
    if (recipe) {
      used.add(recipe.id);
      result.push({ ...entry, recipe });
    }
  });

  return result;
}

function uniqueRecipes(recipes: Array<Recipe | null | undefined>): Recipe[] {
  const seen = new Set<string>();
  const result: Recipe[] = [];
  for (const recipe of recipes) {
    if (!recipe || seen.has(recipe.id)) continue;
    seen.add(recipe.id);
    result.push(recipe);
  }
  return result;
}

/** All unique recipes across the 3-day plan (default shuffle). */
export function collectPlanMenuRecipes(
  eligibleRecipes: Recipe[],
  shuffleSaltByOffset: Record<PlanDayOffset, number> = { 0: 0, 1: 0, 2: 0 },
): Recipe[] {
  const planDays = buildPlanDayOptions();
  const menuRecipes = planDays.flatMap((day) =>
    buildMenuForDate(
      eligibleRecipes,
      day.date,
      shuffleSaltByOffset[day.offset],
    ).map((entry) => entry.recipe),
  );
  return uniqueRecipes(menuRecipes);
}

export type PlanDayRecipes = {
  offset: PlanDayOffset;
  heading: string;
  segmentLabel: string;
  caption: string;
  recipes: Recipe[];
};

/** Recipes grouped per day (Today / Tomorrow / day+2) for the 3-day plan. */
export function collectPlanMenuRecipesByDay(
  eligibleRecipes: Recipe[],
  shuffleSaltByOffset: Record<PlanDayOffset, number> = { 0: 0, 1: 0, 2: 0 },
): PlanDayRecipes[] {
  const planDays = buildPlanDayOptions();
  return planDays.map((day) => ({
    offset: day.offset,
    heading: day.heading,
    segmentLabel: day.segmentLabel,
    caption: day.caption,
    recipes: buildMenuForDate(
      eligibleRecipes,
      day.date,
      shuffleSaltByOffset[day.offset],
    ).map((entry) => entry.recipe),
  }));
}
