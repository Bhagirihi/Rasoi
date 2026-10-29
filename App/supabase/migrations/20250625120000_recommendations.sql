-- Recommendation cache, history, interactions, and recipe ranking fields (rasoi schema).

ALTER TABLE rasoi."Recipe"
  ADD COLUMN IF NOT EXISTS "primaryIngredient" text,
  ADD COLUMN IF NOT EXISTS "popularityScore" int NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS "qualityScore" int NOT NULL DEFAULT 50;

CREATE TABLE IF NOT EXISTS rasoi."UserRecommendationCache" (
  id text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES rasoi."User"(id) ON DELETE CASCADE,
  "dayKey" text NOT NULL,
  "mealSlot" text NOT NULL,
  "windowKey" text NOT NULL,
  "algorithmVersion" text NOT NULL DEFAULT 'v1',
  "recipeIds" text NOT NULL DEFAULT '[]',
  "reasons" text NOT NULL DEFAULT '[]',
  "preferenceSnapshot" text NOT NULL DEFAULT '{}',
  "generatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_recommendation_cache_unique UNIQUE ("userId", "windowKey", "algorithmVersion")
);

CREATE INDEX IF NOT EXISTS idx_user_recommendation_cache_user_window
  ON rasoi."UserRecommendationCache" ("userId", "windowKey");

CREATE TABLE IF NOT EXISTS rasoi."UserRecommendationHistory" (
  id text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES rasoi."User"(id) ON DELETE CASCADE,
  "recipeId" text NOT NULL,
  "mealSlot" text NOT NULL,
  "shownAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_recommendation_history_user_shown
  ON rasoi."UserRecommendationHistory" ("userId", "shownAt" DESC);

CREATE INDEX IF NOT EXISTS idx_user_recommendation_history_user_recipe
  ON rasoi."UserRecommendationHistory" ("userId", "recipeId", "shownAt" DESC);

CREATE TABLE IF NOT EXISTS rasoi."UserRecipeView" (
  id text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES rasoi."User"(id) ON DELETE CASCADE,
  "recipeId" text NOT NULL,
  "viewedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_recipe_view_unique UNIQUE ("userId", "recipeId")
);

CREATE INDEX IF NOT EXISTS idx_user_recipe_view_user_viewed
  ON rasoi."UserRecipeView" ("userId", "viewedAt" DESC);

CREATE TABLE IF NOT EXISTS rasoi."UserRecipeCooked" (
  id text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES rasoi."User"(id) ON DELETE CASCADE,
  "recipeId" text NOT NULL,
  "cookedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_recipe_cooked_unique UNIQUE ("userId", "recipeId")
);

CREATE INDEX IF NOT EXISTS idx_user_recipe_cooked_user_cooked
  ON rasoi."UserRecipeCooked" ("userId", "cookedAt" DESC);

-- Backfill primaryIngredient from title keywords where missing.
UPDATE rasoi."Recipe"
SET "primaryIngredient" = CASE
  WHEN lower(title) LIKE '%paneer%' THEN 'paneer'
  WHEN lower(title) LIKE '%chicken%' THEN 'chicken'
  WHEN lower(title) LIKE '%mutton%' OR lower(title) LIKE '%gosht%' THEN 'mutton'
  WHEN lower(title) LIKE '%fish%' OR lower(title) LIKE '%machhi%' THEN 'fish'
  WHEN lower(title) LIKE '%egg%' OR lower(title) LIKE '%anda%' THEN 'egg'
  WHEN lower(title) LIKE '%aloo%' OR lower(title) LIKE '%potato%' THEN 'aloo'
  WHEN lower(title) LIKE '%dal%' OR lower(title) LIKE '%lentil%' THEN 'dal'
  WHEN lower(title) LIKE '%chole%' OR lower(title) LIKE '%chana%' THEN 'chole'
  WHEN lower(title) LIKE '%rajma%' THEN 'rajma'
  WHEN lower(title) LIKE '%mushroom%' THEN 'mushroom'
  WHEN lower(title) LIKE '%tofu%' THEN 'tofu'
  WHEN lower(title) LIKE '%poha%' THEN 'poha'
  WHEN lower(title) LIKE '%idli%' THEN 'idli'
  WHEN lower(title) LIKE '%dosa%' THEN 'dosa'
  WHEN lower(title) LIKE '%paratha%' THEN 'paratha'
  WHEN lower(title) LIKE '%rice%' OR lower(title) LIKE '%biryani%' OR lower(title) LIKE '%pulao%' THEN 'rice'
  ELSE NULL
END
WHERE "primaryIngredient" IS NULL;
