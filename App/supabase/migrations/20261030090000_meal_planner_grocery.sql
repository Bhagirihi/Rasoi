-- PMPG: Personalized Meal Planner & Grocery List.
--
-- Conventions follow the existing rasoi schema: PascalCase tables,
-- camelCase columns, TEXT day keys ('YYYY-MM-DD', same as
-- MealNotificationLog.dayKey / UserRecommendationCache.dayKey) instead of
-- DATE columns, so the DAL needs no date conversion for week/day keys.
-- Ingredient data carries names only (no quantities/units), so the
-- grocery list is name-based by design — see grocery-list.ts.

CREATE TABLE IF NOT EXISTS rasoi."MealPlan" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES rasoi."User"(id) ON DELETE CASCADE,
  "weekStart" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE ("userId", "weekStart")
);
CREATE INDEX IF NOT EXISTS "MealPlan_userId_weekStart_idx" ON rasoi."MealPlan" ("userId", "weekStart");

CREATE TABLE IF NOT EXISTS rasoi."MealPlanItem" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "planId" TEXT NOT NULL REFERENCES rasoi."MealPlan"(id) ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES rasoi."User"(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  "mealSlot" TEXT NOT NULL,
  "recipeId" TEXT NOT NULL REFERENCES rasoi."Recipe"(id) ON DELETE CASCADE,
  servings INTEGER NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'planned',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE ("planId", date, "mealSlot")
);
CREATE INDEX IF NOT EXISTS "MealPlanItem_userId_date_idx" ON rasoi."MealPlanItem" ("userId", date, "mealSlot");

CREATE TABLE IF NOT EXISTS rasoi."GroceryList" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES rasoi."User"(id) ON DELETE CASCADE,
  "planId" TEXT REFERENCES rasoi."MealPlan"(id) ON DELETE SET NULL,
  "weekStart" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE ("userId", "weekStart")
);
CREATE INDEX IF NOT EXISTS "GroceryList_userId_weekStart_idx" ON rasoi."GroceryList" ("userId", "weekStart");

CREATE TABLE IF NOT EXISTS rasoi."GroceryListItem" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "listId" TEXT NOT NULL REFERENCES rasoi."GroceryList"(id) ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES rasoi."User"(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT 'Other',
  "isStaple" BOOLEAN NOT NULL DEFAULT false,
  checked BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  "sourceRecipeIds" TEXT NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "GroceryListItem_listId_active_idx" ON rasoi."GroceryListItem" ("listId", active);

-- Planner profile fields on User. allergies / dislikedIngredients are
-- JSON string arrays of ingredient names, matching pantryIngredients.
ALTER TABLE rasoi."User" ADD COLUMN IF NOT EXISTS "householdSize" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE rasoi."User" ADD COLUMN IF NOT EXISTS "servingsDefault" INTEGER NOT NULL DEFAULT 2;
ALTER TABLE rasoi."User" ADD COLUMN IF NOT EXISTS "dailyCalorieTarget" INTEGER NULL;
ALTER TABLE rasoi."User" ADD COLUMN IF NOT EXISTS "maxPrepTimeMin" INTEGER NULL;
ALTER TABLE rasoi."User" ADD COLUMN IF NOT EXISTS allergies TEXT NOT NULL DEFAULT '[]';
ALTER TABLE rasoi."User" ADD COLUMN IF NOT EXISTS "dislikedIngredients" TEXT NOT NULL DEFAULT '[]';
