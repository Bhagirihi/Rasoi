-- Drop unused Recipe columns that are always empty in production.
-- API/mobile keep synthesizing:
--   kitchenStyleIds → [kitchenStyleId]
--   description → buildRecipeDescription(...)
--   tags → []

ALTER TABLE rasoi."Recipe"
  DROP COLUMN IF EXISTS "kitchenStyleIds",
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS tags;
