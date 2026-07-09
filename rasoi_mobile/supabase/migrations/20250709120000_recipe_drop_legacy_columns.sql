-- DEPRECATED / REVERTED — do not re-apply.
-- Broke mobile + API (dropped imageUrl, steps, dietType, etc.).
-- Restored by 20250709130000_recipe_restore_app_columns_and_hardening.sql

-- Keep only the core recipe schema
ALTER TABLE rasoi."Recipe"
  DROP COLUMN IF EXISTS "dietType",
  DROP COLUMN IF EXISTS difficulty,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS "imageUrl",
  DROP COLUMN IF EXISTS tags,
  DROP COLUMN IF EXISTS steps,
  DROP COLUMN IF EXISTS "kitchenStyleId",
  DROP COLUMN IF EXISTS "kitchenStyleIds",
  DROP COLUMN IF EXISTS "primaryIngredient",
  DROP COLUMN IF EXISTS "popularityScore",
  DROP COLUMN IF EXISTS "qualityScore",
  DROP COLUMN IF EXISTS "descriptionHi",
  DROP COLUMN IF EXISTS "stepsHi",
  DROP COLUMN IF EXISTS "sourceUrl",
  DROP COLUMN IF EXISTS "sourceSite",
  DROP COLUMN IF EXISTS "scrapedAt";
