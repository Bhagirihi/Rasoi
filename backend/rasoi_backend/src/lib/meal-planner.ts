/**
 * Personalized Meal Planner (PMPG) — week plans backed by the rasoi schema.
 *
 * A plan is one row per user per week (Monday start, TEXT 'YYYY-MM-DD' keys,
 * same convention as MealNotificationLog.dayKey) plus one MealPlanItem per
 * day/slot. Generation reuses the recipe catalog and the same personalization
 * inputs the recommendation engine uses (diet, region, pantry, cooked
 * history), with planner-only rules layered on top:
 * - no repeats within the week, and no recipe cooked in the last 14 days
 * - allergy / disliked-ingredient exclusion (canonical-name match)
 * - max-prep-time hard filter when the user set one
 * - single-meal calories above the whole-day target are excluded
 * - pantry-first ordering (recipes you can already cook rank first)
 *
 * Quantities are intentionally absent: recipe ingredients carry names only
 * (see normalizeRecipeIngredients), so servings scale the headcount, not
 * ingredient amounts. The grocery engine (grocery-list.ts) is name-based
 * for the same reason.
 */

import { db } from '@/lib/db';
import type { MealPlan, MealPlanItem, Recipe, User } from '@/lib/db/types';
import { canonicalizeIngredientName } from '@/lib/ingredient-canonical';
import type { MealSlot } from '@/lib/meal-time';
import { normalizeRecipeIngredients } from '@/lib/recipe-ingredients';
import { parseJson, serializeRecipe } from '@/lib/serializers';
import type { RecipeResponse } from '@/lib/types';

/** Slots the generator fills. lateNight stays user-addable only. */
export const PLAN_GENERATION_SLOTS: MealSlot[] = ['breakfast', 'lunch', 'snack', 'dinner'];

const RECENTLY_COOKED_DAYS = 14;
const CANDIDATE_POOL_SIZE = 500;

export type PlannerItemWithRecipe = MealPlanItem & { recipe: RecipeResponse };

function toDateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(key: string): Date {
  return new Date(`${key}T00:00:00Z`);
}

/** Monday of the week containing the given 'YYYY-MM-DD' key. */
export function getWeekStart(dateKey: string): string {
  const date = parseDateKey(dateKey);
  const day = date.getUTCDay(); // 0 = Sunday
  const mondayOffset = (day + 6) % 7;
  date.setUTCDate(date.getUTCDate() - mondayOffset);
  return toDateKey(date);
}

/** The 7 day keys (Mon..Sun) of the week starting at weekStart. */
export function getWeekDates(weekStart: string): string[] {
  const start = parseDateKey(weekStart);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + index);
    return toDateKey(date);
  });
}

function canonicalSet(names: string[]): Set<string> {
  return new Set(
    names.map((name) => canonicalizeIngredientName(name).trim().toLowerCase()).filter(Boolean),
  );
}

function dietAllows(dietChoice: string, dietType: string): boolean {
  const choice = dietChoice.trim().toLowerCase();
  const type = dietType.trim().toLowerCase();
  if (!choice || choice === 'all') return true;
  if (choice.includes('non')) return true; // non-veg eats everything
  if (choice.includes('jain')) return type.includes('jain');
  if (choice.includes('egg')) return type.includes('veg') || type.includes('egg') || type.includes('jain');
  if (choice.includes('veg')) return type.includes('veg') || type.includes('jain');
  return true;
}

function normalizeLoose(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z]/g, '');
}

/** Pantry-match % over non-staple ingredients (staples are assumed at home). */
function pantryMatchPercent(recipe: Recipe, pantry: Set<string>): number {
  const ingredients = normalizeRecipeIngredients(recipe.ingredients).filter((item) => !item.isStaple);
  if (ingredients.length === 0) return 0;
  const matched = ingredients.filter((item) =>
    pantry.has(canonicalizeIngredientName(item.name).trim().toLowerCase()),
  ).length;
  return Math.round((matched / ingredients.length) * 100);
}

export async function getOrCreatePlan(userId: string, weekStart: string): Promise<MealPlan> {
  const monday = getWeekStart(weekStart);
  const existing = await db.mealPlan.findUnique({
    where: { userId_weekStart: { userId, weekStart: monday } },
  });
  if (existing) return existing;
  return db.mealPlan.create({
    data: { userId, weekStart: monday, status: 'active' },
  });
}

export async function getWeekPlanWithRecipes(
  userId: string,
  weekStart: string,
): Promise<{ plan: MealPlan; items: PlannerItemWithRecipe[] }> {
  const plan = await getOrCreatePlan(userId, weekStart);
  const items = await db.mealPlanItem.findMany({
    where: { planId: plan.id },
    orderBy: [{ date: 'asc' }, { mealSlot: 'asc' }],
  });
  const visible = items.filter((item) => item.status !== 'removed');
  const recipes = await Promise.all(
    visible.map((item) => db.recipe.findUnique({ where: { id: item.recipeId } })),
  );
  const withRecipes: PlannerItemWithRecipe[] = [];
  visible.forEach((item, index) => {
    const recipe = recipes[index];
    if (recipe) withRecipes.push({ ...item, recipe: serializeRecipe(recipe) });
  });
  return { plan, items: withRecipes };
}

/**
 * Generate (or regenerate) a week. Regeneration updates existing 'planned'
 * items in place and creates missing ones; 'cooked' / 'skipped' / user-added
 * extras are never overwritten, so a regenerate never erases what the user
 * already did.
 */
export async function generateWeekPlan(
  userId: string,
  weekStart: string,
): Promise<{ plan: MealPlan; items: PlannerItemWithRecipe[] }> {
  const plan = await getOrCreatePlan(userId, weekStart);
  const user = (await db.user.findUnique({ where: { id: userId } })) as User | null;
  if (!user) throw new Error('User not found');

  const pantry = canonicalSet(parseJson<string[]>(user.pantryIngredients, []));
  const allergies = canonicalSet(parseJson<string[]>(user.allergies, []));
  const disliked = canonicalSet(parseJson<string[]>(user.dislikedIngredients, []));

  const cookedCutoff = Date.now() - RECENTLY_COOKED_DAYS * 24 * 60 * 60 * 1000;
  const cookedRows = await db.userRecipeCooked.findMany({ where: { userId } });
  const recentlyCooked = new Set(
    cookedRows
      .filter((row) => new Date(row.cookedAt).getTime() >= cookedCutoff)
      .map((row) => row.recipeId),
  );

  const candidates = await db.recipe.findMany({
    where: { published: true },
    orderBy: [{ popularityScore: 'desc' }, { title: 'asc' }],
    take: CANDIDATE_POOL_SIZE,
  });

  const eligible = candidates.filter((recipe) => {
    if (!dietAllows(user.dietChoice, recipe.dietType)) return false;
    if (recentlyCooked.has(recipe.id)) return false;
    if (user.maxPrepTimeMin != null && recipe.prepTime > user.maxPrepTimeMin) return false;
    if (user.dailyCalorieTarget != null && recipe.calories > user.dailyCalorieTarget) return false;
    const names = normalizeRecipeIngredients(recipe.ingredients).map((item) =>
      canonicalizeIngredientName(item.name).trim().toLowerCase(),
    );
    if (names.some((name) => allergies.has(name) || disliked.has(name))) return false;
    return true;
  });

  const userRegion = normalizeLoose(user.regionalCuisine);
  const scored = eligible
    .map((recipe) => ({
      recipe,
      score:
        pantryMatchPercent(recipe, pantry) +
        (userRegion && normalizeLoose(recipe.region) === userRegion ? 20 : 0) +
        Math.min(recipe.popularityScore, 100) / 100,
    }))
    .sort((a, b) => b.score - a.score);

  const used = new Set<string>();
  const servings = user.servingsDefault || 2;
  const days = getWeekDates(plan.weekStart);

  // Never overwrite what the user already did: cooked / skipped / removed
  // items keep their state; only 'planned' slots get re-picked.
  const existingItems = await db.mealPlanItem.findMany({ where: { planId: plan.id } });
  const existingByKey = new Map(
    existingItems.map((item) => [`${item.date}|${item.mealSlot}`, item] as const),
  );

  for (const date of days) {
    for (const slot of PLAN_GENERATION_SLOTS) {
      const prev = existingByKey.get(`${date}|${slot}`);
      if (prev && prev.status !== 'planned') continue;
      const pick = scored.find((entry) => !used.has(entry.recipe.id));
      if (!pick) break;
      used.add(pick.recipe.id);
      await db.mealPlanItem.upsert({
        where: { planId_date_mealSlot: { planId: plan.id, date, mealSlot: slot } },
        create: {
          planId: plan.id,
          userId,
          date,
          mealSlot: slot,
          recipeId: pick.recipe.id,
          servings,
          status: 'planned',
        },
        update: { recipeId: pick.recipe.id, servings, status: 'planned' },
      });
    }
  }

  return getWeekPlanWithRecipes(userId, plan.weekStart);
}

export async function addPlanItem(input: {
  userId: string;
  planId: string;
  date: string;
  mealSlot: MealSlot;
  recipeId: string;
  servings?: number;
}): Promise<MealPlanItem> {
  const plan = await db.mealPlan.findUnique({ where: { id: input.planId } });
  if (!plan || plan.userId !== input.userId) throw new Error('Plan not found');
  const recipe = await db.recipe.findUnique({ where: { id: input.recipeId } });
  if (!recipe || !recipe.published) throw new Error('Recipe not found');
  const user = (await db.user.findUnique({ where: { id: input.userId } })) as User | null;
  return db.mealPlanItem.upsert({
    where: {
      planId_date_mealSlot: { planId: plan.id, date: input.date, mealSlot: input.mealSlot },
    },
    create: {
      planId: plan.id,
      userId: input.userId,
      date: input.date,
      mealSlot: input.mealSlot,
      recipeId: input.recipeId,
      servings: input.servings ?? user?.servingsDefault ?? 2,
      status: 'planned',
    },
    update: {
      recipeId: input.recipeId,
      servings: input.servings ?? user?.servingsDefault ?? 2,
      status: 'planned',
    },
  });
}

export async function setPlanItemStatus(
  userId: string,
  itemId: string,
  status: MealPlanItem['status'],
): Promise<MealPlanItem> {
  const item = await db.mealPlanItem.findUnique({ where: { id: itemId } });
  if (!item || item.userId !== userId) throw new Error('Plan item not found');
  return db.mealPlanItem.update({ where: { id: itemId }, data: { status } });
}

/**
 * Notification hook: the planned meal for a user/day/slot, if one exists.
 * meal-notifications.ts prefers this over a generated pick and falls back
 * to the recommendation engine when there is no plan (or no item).
 */
export async function getPlannedMealForSlot(
  userId: string,
  dayKey: string,
  mealSlot: MealSlot,
): Promise<RecipeResponse | null> {
  const items = await db.mealPlanItem.findMany({
    where: { userId, date: dayKey, mealSlot, status: 'planned' },
    take: 1,
  });
  if (items.length === 0) return null;
  const recipe = await db.recipe.findUnique({ where: { id: items[0].recipeId } });
  if (!recipe || !recipe.published) return null;
  return serializeRecipe(recipe);
}
