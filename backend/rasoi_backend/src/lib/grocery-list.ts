/**
 * Grocery list engine (PMPG) — builds a shopping list from a week plan.
 *
 * Name-based by design: recipe ingredients carry names only (no quantities
 * or units in the catalog), so the list aggregates canonical ingredient
 * names across the week's still-to-cook ('planned') meals, then:
 * - drops pantry staples (salt, oil, water, … — assumed at home)
 * - subtracts what the user already has in their pantry
 * - dedupes across recipes, tracking which recipes each item came from
 * - groups items by the admin PantrySection item lists, else 'Other'
 *
 * Rebuilds preserve the checked state of items that survive (matched by
 * canonical name), so re-generating the week never unchecks what the user
 * already bought. Quantities must NOT be invented here — when the catalog
 * gains qty/unit data, this is the file that gains quantity math.
 */

import { db } from '@/lib/db';
import type { GroceryList, GroceryListItem, User } from '@/lib/db/types';
import { canonicalizeIngredientName } from '@/lib/ingredient-canonical';
import { normalizeRecipeIngredients } from '@/lib/recipe-ingredients';
import { parseJson } from '@/lib/serializers';
import { getOrCreatePlan } from '@/lib/meal-planner';

export type GroceryListWithItems = {
  list: GroceryList;
  planId: string | null;
  items: GroceryListItem[];
};

function canonicalKey(name: string): string {
  return canonicalizeIngredientName(name).trim().toLowerCase();
}

type ComputedItem = {
  key: string;
  name: string;
  section: string;
  sourceRecipeIds: string[];
};

/** Map a canonical ingredient name to a pantry section title. */
async function buildSectionMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const sections = await db.pantrySection.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }],
  });
  for (const section of sections) {
    for (const raw of parseJson<string[]>(section.items, [])) {
      const key = canonicalKey(raw);
      if (key && !map.has(key)) map.set(key, section.title);
    }
  }
  return map;
}

async function computeItems(
  user: User,
  planId: string,
  sectionMap: Map<string, string>,
): Promise<ComputedItem[]> {
  const pantry = new Set(
    parseJson<string[]>(user.pantryIngredients, []).map((name) => canonicalKey(name)),
  );
  const items = await db.mealPlanItem.findMany({
    where: { planId, status: 'planned' },
    orderBy: [{ date: 'asc' }, { mealSlot: 'asc' }],
  });
  const byKey = new Map<string, ComputedItem>();
  for (const item of items) {
    const recipe = await db.recipe.findUnique({ where: { id: item.recipeId } });
    if (!recipe) continue;
    for (const ingredient of normalizeRecipeIngredients(recipe.ingredients)) {
      if (ingredient.isStaple) continue;
      const key = canonicalKey(ingredient.name);
      if (!key || pantry.has(key)) continue;
      const existing = byKey.get(key);
      if (existing) {
        if (!existing.sourceRecipeIds.includes(recipe.id)) {
          existing.sourceRecipeIds.push(recipe.id);
        }
      } else {
        byKey.set(key, {
          key,
          name: ingredient.name,
          section: sectionMap.get(key) ?? 'Other',
          sourceRecipeIds: [recipe.id],
        });
      }
    }
  }
  return [...byKey.values()].sort((a, b) =>
    a.section === b.section ? a.name.localeCompare(b.name) : a.section.localeCompare(b.section),
  );
}

export async function getOrBuildGroceryList(
  userId: string,
  weekStart: string,
): Promise<GroceryListWithItems> {
  const plan = await getOrCreatePlan(userId, weekStart);
  const existing = await db.groceryList.findUnique({
    where: { userId_weekStart: { userId, weekStart: plan.weekStart } },
  });
  const list =
    existing ??
    (await db.groceryList.create({
      data: { userId, planId: plan.id, weekStart: plan.weekStart, status: 'active' },
    }));
  const items = await db.groceryListItem.findMany({
    where: { listId: list.id, active: true },
    orderBy: [{ section: 'asc' }, { name: 'asc' }],
  });
  return { list, planId: plan.id, items };
}

/**
 * Rebuild the list from the current plan. Checked state survives for items
 * that are still needed; items no longer needed are deactivated (not
 * deleted) so a rebuild is reversible via the next rebuild.
 */
export async function rebuildGroceryList(
  userId: string,
  weekStart: string,
): Promise<GroceryListWithItems> {
  const plan = await getOrCreatePlan(userId, weekStart);
  const user = (await db.user.findUnique({ where: { id: userId } })) as User | null;
  if (!user) throw new Error('User not found');

  const list =
    (await db.groceryList.findUnique({
      where: { userId_weekStart: { userId, weekStart: plan.weekStart } },
    })) ??
    (await db.groceryList.create({
      data: { userId, planId: plan.id, weekStart: plan.weekStart, status: 'active' },
    }));

  const sectionMap = await buildSectionMap();
  const computed = await computeItems(user, plan.id, sectionMap);
  const computedKeys = new Set(computed.map((item) => item.key));

  const existing = await db.groceryListItem.findMany({ where: { listId: list.id } });
  const byKey = new Map(
    existing.map((item) => [canonicalKey(item.name), item] as const),
  );

  for (const item of computed) {
    const prev = byKey.get(item.key);
    if (prev) {
      await db.groceryListItem.update({
        where: { id: prev.id },
        data: {
          active: true,
          section: item.section,
          sourceRecipeIds: JSON.stringify(item.sourceRecipeIds),
        },
      });
    } else {
      await db.groceryListItem.create({
        data: {
          listId: list.id,
          userId,
          name: item.name,
          section: item.section,
          isStaple: false,
          checked: false,
          active: true,
          sourceRecipeIds: JSON.stringify(item.sourceRecipeIds),
        },
      });
    }
  }
  for (const prev of existing) {
    if (prev.active && !computedKeys.has(canonicalKey(prev.name))) {
      await db.groceryListItem.update({ where: { id: prev.id }, data: { active: false } });
    }
  }

  const items = await db.groceryListItem.findMany({
    where: { listId: list.id, active: true },
    orderBy: [{ section: 'asc' }, { name: 'asc' }],
  });
  return { list, planId: plan.id, items };
}

export async function setGroceryItemChecked(
  userId: string,
  itemId: string,
  checked: boolean,
): Promise<GroceryListItem> {
  const item = await db.groceryListItem.findUnique({ where: { id: itemId } });
  if (!item || item.userId !== userId) throw new Error('Grocery item not found');
  return db.groceryListItem.update({ where: { id: itemId }, data: { checked } });
}
