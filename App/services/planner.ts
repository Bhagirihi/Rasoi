import { authApiFetch } from '@/utils/api';

/**
 * Planner + grocery API client (PMPG).
 *
 * API-only by design: week generation runs server-side (diet, pantry,
 * cooked-history, allergy rules), so there is no Supabase-direct path here
 * the way the recipe catalog has. All calls carry the user's auth token
 * via authApiFetch, and the backend resolves the user from it.
 */

export type MealSlot = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'lateNight';

export type PlanRecipe = {
  id: string;
  title: string;
  imageUrl: string;
  prepTime: number;
  calories: number;
  dietType: string;
};

export type PlanItem = {
  id: string;
  planId: string;
  date: string;
  mealSlot: MealSlot;
  servings: number;
  status: string;
  recipe: PlanRecipe;
};

export type WeekPlanResponse = {
  plan: { id: string; weekStart: string; status: string };
  items: PlanItem[];
};

export type GroceryItem = {
  id: string;
  name: string;
  section: string;
  checked: boolean;
};

export type GroceryListResponse = {
  list: { id: string; weekStart: string };
  planId: string | null;
  items: GroceryItem[];
};

/** Monday 'YYYY-MM-DD' of the week containing the given date (local time). */
export function getWeekStartString(date = new Date()): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const mondayOffset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - mondayOffset);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

/** 7 'YYYY-MM-DD' keys (Mon..Sun) for a week start. */
export function getWeekDates(weekStart: string): string[] {
  const [year, month, day] = weekStart.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  return Array.from({ length: 7 }, (_, index) => {
    const d = new Date(start);
    d.setDate(d.getDate() + index);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${dd}`;
  });
}

/** Shift a week-start key by whole weeks (negative for previous). */
export function shiftWeek(weekStart: string, weeks: number): string {
  const [year, month, day] = weekStart.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + weeks * 7);
  return getWeekStartString(d);
}

export function getWeekPlan(weekStart: string): Promise<WeekPlanResponse> {
  return authApiFetch<WeekPlanResponse>(`/api/planner?weekStart=${weekStart}`);
}

export function generateWeekPlan(weekStart: string): Promise<WeekPlanResponse> {
  return authApiFetch<WeekPlanResponse>('/api/planner', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weekStart }),
  });
}

export function addPlanItem(input: {
  planId: string;
  date: string;
  mealSlot: MealSlot;
  recipeId: string;
  servings?: number;
}): Promise<{ item: PlanItem }> {
  return authApiFetch<{ item: PlanItem }>('/api/planner/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export function setPlanItemStatus(
  id: string,
  status: 'planned' | 'cooked' | 'skipped' | 'removed',
): Promise<{ item: PlanItem }> {
  return authApiFetch<{ item: PlanItem }>('/api/planner/items', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  });
}

export function getGroceryList(weekStart: string): Promise<GroceryListResponse> {
  return authApiFetch<GroceryListResponse>(`/api/grocery?weekStart=${weekStart}`);
}

export function rebuildGroceryList(weekStart: string): Promise<GroceryListResponse> {
  return authApiFetch<GroceryListResponse>('/api/grocery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weekStart }),
  });
}

export function setGroceryItemChecked(
  id: string,
  checked: boolean,
): Promise<{ item: { id: string; checked: boolean } }> {
  return authApiFetch<{ item: { id: string; checked: boolean } }>('/api/grocery/items', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, checked }),
  });
}

export function updatePlannerProfile(input: {
  householdSize?: number;
  servingsDefault?: number;
  dailyCalorieTarget?: number | null;
  maxPrepTimeMin?: number | null;
  allergies?: string[];
  dislikedIngredients?: string[];
}): Promise<unknown> {
  return authApiFetch('/api/users/me/planner-profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}
