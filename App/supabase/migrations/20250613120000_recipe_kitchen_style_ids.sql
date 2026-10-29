-- Multi-cuisine recipe support + catalog expansion prep
-- Run in Supabase SQL Editor before seeding recipes.

ALTER TABLE rasoi."Recipe"
  ADD COLUMN IF NOT EXISTS "kitchenStyleIds" text NOT NULL DEFAULT '[]';

UPDATE rasoi."Recipe"
SET "kitchenStyleIds" = json_build_array("kitchenStyleId")::text
WHERE "kitchenStyleIds" IS NULL
   OR "kitchenStyleIds" = '[]'
   OR "kitchenStyleIds" = '';

-- After running scripts/seed-recipes-to-supabase.ts, expect 450 recipes:
-- 150 base (01-10 per cuisine) + 300 new (11-30 per cuisine)
