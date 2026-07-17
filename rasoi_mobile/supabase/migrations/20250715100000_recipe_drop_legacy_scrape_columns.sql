-- Backfill canonical Recipe columns from schema-v2 scrape twins, then drop unused columns.
--
-- Safe drops (empty / never read): sourceUrl, sourceSite, scrapedAt
-- Drops only after backfill: cuisine → kitchenStyleId, diet → dietType,
--   method → steps, image_url → imageUrl
--
-- Do NOT overwrite non-empty steps / imageUrl (42 recipes already differ from method).

-- ---------------------------------------------------------------------------
-- 1. Backfill
-- ---------------------------------------------------------------------------
UPDATE rasoi."Recipe"
SET
  steps = method,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE (steps IS NULL OR btrim(steps) = '' OR steps = '[]')
  AND method IS NOT NULL
  AND btrim(method) <> '';

UPDATE rasoi."Recipe"
SET
  "imageUrl" = image_url,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE btrim("imageUrl") = ''
  AND image_url IS NOT NULL
  AND btrim(image_url) <> '';

-- cuisine / diet already match kitchenStyleId / dietType (0 mismatches) — no backfill needed.

-- ---------------------------------------------------------------------------
-- 2. Drop unused + superseded columns
-- ---------------------------------------------------------------------------
ALTER TABLE rasoi."Recipe"
  DROP COLUMN IF EXISTS "sourceUrl",
  DROP COLUMN IF EXISTS "sourceSite",
  DROP COLUMN IF EXISTS "scrapedAt",
  DROP COLUMN IF EXISTS cuisine,
  DROP COLUMN IF EXISTS diet,
  DROP COLUMN IF EXISTS method,
  DROP COLUMN IF EXISTS image_url;
