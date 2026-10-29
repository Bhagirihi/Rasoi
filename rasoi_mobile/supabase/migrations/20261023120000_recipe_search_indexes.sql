-- Recipe search/read indexes for the rasoi schema.
-- Every public query filters published = true and orders by popularityScore,
-- and neither was indexed (full seq scans on every search/recommendation).

-- 1) Cover the hot path: published filter + popularity ordering.
CREATE INDEX IF NOT EXISTS "Recipe_published_popularityScore_idx"
  ON rasoi."Recipe" ("published", "popularityScore" DESC);

-- 2) Trigram index for future DB-side text search on titles.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS "Recipe_title_trgm_idx"
  ON rasoi."Recipe" USING gin ("title" gin_trgm_ops);

-- Verify on prod after applying (Supabase SQL editor):
--   SELECT indexname FROM pg_indexes WHERE schemaname = 'rasoi' AND tablename = 'Recipe';
