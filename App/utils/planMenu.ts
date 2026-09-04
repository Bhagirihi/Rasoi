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

type BuildMenuOptions = {
  /** Recipe ids already used in earlier plan days or reserved for home picks. */
  used?: Set<string>;
};

export function buildMenuForDate(
  eligibleRecipes: Recipe[],
  date: Date,
  shuffleSalt = 0,
  options?: BuildMenuOptions,
): PlanMenuEntry[] {
  if (eligibleRecipes.length === 0) return [];

  const used = options?.used ?? new Set<string>();
  const seed = dayKey(date) + shuffleSalt * 13;
  const result: PlanMenuEntry[] = [];

  PLAN_SLOTS.forEach((entry, index) => {
    let available = eligibleRecipes.filter((recipe) => !used.has(recipe.id));
    if (available.length === 0) {
      available = eligibleRecipes;
    }
    const recipe = pickForSlot(available, entry.slot, seed + index * 7);
    if (recipe) {
      used.add(recipe.id);
      result.push({ ...entry, recipe });
    }
  });

  return result;
}

export function buildAllPlanMenus(
  eligibleRecipes: Recipe[],
  shuffleSaltByOffset: Record<PlanDayOffset, number> = { 0: 0, 1: 0, 2: 0 },
  excludeRecipeIds: string[] = [],
): Record<PlanDayOffset, PlanMenuEntry[]> {
  const used = new Set(excludeRecipeIds);
  const planDays = buildPlanDayOptions();
  const menus: Partial<Record<PlanDayOffset, PlanMenuEntry[]>> = {};

  for (const day of planDays) {
    menus[day.offset] = buildMenuForDate(
      eligibleRecipes,
      day.date,
      shuffleSaltByOffset[day.offset],
      { used },
    );
  }

  return menus as Record<PlanDayOffset, PlanMenuEntry[]>;
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
  excludeRecipeIds: string[] = [],
): Recipe[] {
  const menus = buildAllPlanMenus(eligibleRecipes, shuffleSaltByOffset, excludeRecipeIds);
  return uniqueRecipes(Object.values(menus).flatMap((entries) => entries.map((entry) => entry.recipe)));
}

/** Recipe ids on today's plan menu — lighter than full 3-day set for home-pick exclusion. */
export function getPlanRecipeIdsForHomeExclusion(
  eligibleRecipes: Recipe[],
  shuffleSalt = 0,
  excludeRecipeIds: string[] = [],
): string[] {
  if (eligibleRecipes.length === 0) return [];
  const today = buildPlanDayOptions()[0];
  const menu = buildMenuForDate(eligibleRecipes, today.date, shuffleSalt, {
    used: new Set(excludeRecipeIds),
  });
  return menu.map((entry) => entry.recipe.id);
}

/** Recipe ids reserved by the 3-day plan — use to keep home picks distinct. */
export function getPlanRecipeIds(
  eligibleRecipes: Recipe[],
  shuffleSaltByOffset: Record<PlanDayOffset, number> = { 0: 0, 1: 0, 2: 0 },
  excludeRecipeIds: string[] = [],
): string[] {
  return collectPlanMenuRecipes(eligibleRecipes, shuffleSaltByOffset, excludeRecipeIds).map(
    (recipe) => recipe.id,
  );
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
  excludeRecipeIds: string[] = [],
): PlanDayRecipes[] {
  const planDays = buildPlanDayOptions();
  const menus = buildAllPlanMenus(eligibleRecipes, shuffleSaltByOffset, excludeRecipeIds);
  return planDays.map((day) => ({
    offset: day.offset,
    heading: day.heading,
    segmentLabel: day.segmentLabel,
    caption: day.caption,
    recipes: (menus[day.offset] ?? []).map((entry) => entry.recipe),
  }));
}
