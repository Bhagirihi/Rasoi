-- Rasoi Supabase sync: KitchenStyle, kitchenStyleId on Recipe, reference tables, realtime
-- Run in Supabase SQL Editor (Dashboard → SQL → New query)
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT / guarded updates

-- =============================================================================
-- 0) PREFLIGHT — current state
-- =============================================================================
SELECT 'KitchenStyle' AS table_name, COUNT(*) AS row_count FROM rasoi."KitchenStyle"
UNION ALL
SELECT 'Recipe', COUNT(*) FROM rasoi."Recipe"
UNION ALL
SELECT 'Recipe missing/invalid kitchenStyleId',
       COUNT(*)
FROM rasoi."Recipe" r
WHERE r."kitchenStyleId" IS NULL
   OR r."kitchenStyleId" = ''
   OR NOT EXISTS (
     SELECT 1 FROM rasoi."KitchenStyle" ks WHERE ks.id = r."kitchenStyleId"
   )
UNION ALL
SELECT 'RegionalCuisineOption', COUNT(*) FROM rasoi."RegionalCuisineOption"
UNION ALL
SELECT 'PantrySection', COUNT(*) FROM rasoi."PantrySection"
UNION ALL
SELECT 'PartnerLink', COUNT(*) FROM rasoi."PartnerLink"
UNION ALL
SELECT 'Sponsor', COUNT(*) FROM rasoi."Sponsor";

-- Per-style recipe counts (expect 10 each when fully seeded)
SELECT r."kitchenStyleId", COUNT(*) AS recipe_count
FROM rasoi."Recipe" r
GROUP BY 1
ORDER BY 1;

-- =============================================================================
-- 1) SCHEMA — ensure kitchenStyleId column + index on Recipe
-- =============================================================================
ALTER TABLE rasoi."Recipe"
  ADD COLUMN IF NOT EXISTS "kitchenStyleId" TEXT NOT NULL DEFAULT 'north';

CREATE INDEX IF NOT EXISTS "Recipe_kitchenStyleId_idx"
  ON rasoi."Recipe" ("kitchenStyleId");

-- =============================================================================
-- 2) KITCHEN STYLES — upsert all 15 (idempotent)
-- =============================================================================
INSERT INTO rasoi."KitchenStyle" (
  id, label, tagline, mood, region, "heroImage", active, "sortOrder", "createdAt", "updatedAt"
) VALUES
  ('gujarati', 'Gujarati Home', 'Light, sweet-savoury everyday thali vibes', 'Comfort', 'West',
   'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', true, 10, NOW(), NOW()),
  ('street', 'Street Food', 'Pav bhaji, chaat & late-evening cravings', 'Bold', 'West',
   'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80', true, 20, NOW(), NOW()),
  ('south', 'South Indian', 'Crisp dosas, sambar & coconut-led flavours', 'Fresh', 'South',
   'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', true, 30, NOW(), NOW()),
  ('north', 'North Indian', 'Rich gravies, tandoori warmth & parathas', 'Hearty', 'North',
   'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80', true, 40, NOW(), NOW()),
  ('punjabi', 'Punjabi', 'Butter-laden dal, tandoori & hearty sarson ka saag', 'Hearty', 'North',
   'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', true, 50, NOW(), NOW()),
  ('rajasthani', 'Rajasthani', 'Dal baati, gatte ki sabzi & desert spice warmth', 'Royal', 'West',
   'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', true, 60, NOW(), NOW()),
  ('bengali', 'Bengali', 'Mustard fish, mishti & subtle layered flavours', 'Delicate', 'East',
   'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80', true, 70, NOW(), NOW()),
  ('maharashtrian', 'Maharashtrian', 'Poha, vada pav & bold Kolhapuri heat', 'Spicy', 'West',
   'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80', true, 80, NOW(), NOW()),
  ('hyderabadi', 'Hyderabadi', 'Biryani royalty, haleem & slow-cooked gravies', 'Rich', 'South',
   'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', true, 90, NOW(), NOW()),
  ('goan', 'Goan', 'Coconut curries, seafood & Portuguese spice', 'Coastal', 'West',
   'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', true, 100, NOW(), NOW()),
  ('kerala', 'Kerala', 'Appam, avial & coconut-forward coastal meals', 'Coastal', 'South',
   'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', true, 110, NOW(), NOW()),
  ('chinese', 'Indo-Chinese', 'Hakka noodles, manchurian & wok-tossed comfort', 'Fusion', 'West',
   'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&q=80', true, 120, NOW(), NOW()),
  ('assamese', 'Assamese', 'Smoked fish, bamboo shoot & earthy Northeast plates', 'Earthy', 'East',
   'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', true, 130, NOW(), NOW()),
  ('kashmiri', 'Kashmiri', 'Rogan josh, saffron rice & aromatic wazwan', 'Aromatic', 'North',
   'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', true, 140, NOW(), NOW()),
  ('chettinad', 'Chettinad', 'Fiery pepper masala & bold Tamil Nadu spice', 'Fiery', 'South',
   'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80', true, 150, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  tagline = EXCLUDED.tagline,
  mood = EXCLUDED.mood,
  region = EXCLUDED.region,
  "heroImage" = EXCLUDED."heroImage",
  active = EXCLUDED.active,
  "sortOrder" = EXCLUDED."sortOrder",
  "updatedAt" = NOW();

-- =============================================================================
-- 3) REFERENCE DATA — regional cuisines + pantry sections (Phase B tables)
-- =============================================================================
INSERT INTO rasoi."RegionalCuisineOption" (label, "sortOrder", active) VALUES
  ('All India', 10, true),
  ('North', 20, true),
  ('South', 30, true),
  ('East', 40, true),
  ('West', 50, true),
  ('Central', 60, true)
ON CONFLICT (label) DO UPDATE SET
  "sortOrder" = EXCLUDED."sortOrder",
  active = EXCLUDED.active;

INSERT INTO rasoi."PantrySection" (id, title, items, "sortOrder", active) VALUES
  ('staples', 'Staples', '["Atta","Rice","Dal","Besan","Jeera","Haldi","Namak","Oil","Chawal"]', 10, true),
  ('veggies', 'Veggies', '["Aloo","Pyaaz","Tamatar","Gobi","Bhindi","Palak","Matar","Mirch","Adrak"]', 20, true),
  ('dairy', 'Dairy', '["Paneer","Dahi","Milk","Ghee","Butter","Cream","Eggs"]', 30, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  items = EXCLUDED.items,
  "sortOrder" = EXCLUDED."sortOrder",
  active = EXCLUDED.active;

-- =============================================================================
-- 4) RECIPES — backfill kitchenStyleId from recipe id prefix (e.g. gujarati-01)
-- =============================================================================
UPDATE rasoi."Recipe" r
SET "kitchenStyleId" = split_part(r.id, '-', 1),
    "updatedAt" = NOW()
WHERE r.id ~ '^[a-z]+-[0-9]+$'
  AND EXISTS (
    SELECT 1
    FROM rasoi."KitchenStyle" ks
    WHERE ks.id = split_part(r.id, '-', 1)
  )
  AND (
    r."kitchenStyleId" IS NULL
    OR r."kitchenStyleId" = ''
    OR r."kitchenStyleId" <> split_part(r.id, '-', 1)
  );

-- Legacy / orphan recipes: point to north if style is missing or invalid
UPDATE rasoi."Recipe" r
SET "kitchenStyleId" = 'north',
    "updatedAt" = NOW()
WHERE r."kitchenStyleId" IS NULL
   OR r."kitchenStyleId" = ''
   OR NOT EXISTS (
     SELECT 1 FROM rasoi."KitchenStyle" ks WHERE ks.id = r."kitchenStyleId"
   );

-- Optional: align region column with kitchen style region where mismatched
UPDATE rasoi."Recipe" r
SET region = ks.region,
    "updatedAt" = NOW()
FROM rasoi."KitchenStyle" ks
WHERE ks.id = r."kitchenStyleId"
  AND r.region IS DISTINCT FROM ks.region;

-- =============================================================================
-- 5) REALTIME — grants + publication (skip if already done via npm run db:realtime)
-- =============================================================================
GRANT USAGE ON SCHEMA rasoi TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA rasoi TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA rasoi GRANT SELECT ON TABLES TO anon, authenticated;

-- Add any missing rasoi tables to realtime publication (ignore "already member" errors)
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'User', 'Admin', 'Recipe', 'Sponsor', 'PartnerLink', 'KitchenStyle',
    'RegionalCuisineOption', 'PantrySection', 'SponsorApplication',
    'AffiliateEvent', 'PushToken'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    BEGIN
      EXECUTE format(
        'ALTER PUBLICATION supabase_realtime ADD TABLE rasoi.%I',
        t
      );
      RAISE NOTICE 'Added rasoi.% to supabase_realtime', t;
    EXCEPTION
      WHEN duplicate_object THEN
        RAISE NOTICE 'rasoi.% already in supabase_realtime', t;
    END;
  END LOOP;
END $$;

-- =============================================================================
-- 6) POST-CHECK — expect 15 styles, 150 recipes, 10 per style
-- =============================================================================
SELECT COUNT(*) AS kitchen_style_count FROM rasoi."KitchenStyle";
SELECT COUNT(*) AS recipe_count FROM rasoi."Recipe";

SELECT r."kitchenStyleId", COUNT(*) AS recipe_count
FROM rasoi."Recipe" r
GROUP BY 1
ORDER BY 1;

SELECT COUNT(*) AS recipes_missing_valid_style
FROM rasoi."Recipe" r
WHERE NOT EXISTS (
  SELECT 1 FROM rasoi."KitchenStyle" ks WHERE ks.id = r."kitchenStyleId"
);

-- =============================================================================
-- 7) MIRROR — sync rasoi.KitchenStyle → public.cuisines (Supabase Table Editor)
-- =============================================================================
INSERT INTO public.cuisines (
  id, label, tagline, mood, region, hero_image, sort_order, created_at
)
SELECT
  ks.id,
  ks.label,
  ks.tagline,
  ks.mood,
  ks.region,
  ks."heroImage",
  ks."sortOrder",
  ks."createdAt"
FROM rasoi."KitchenStyle" ks
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  tagline = EXCLUDED.tagline,
  mood = EXCLUDED.mood,
  region = EXCLUDED.region,
  hero_image = EXCLUDED.hero_image,
  sort_order = EXCLUDED.sort_order;

SELECT COUNT(*) AS public_cuisines_count FROM public.cuisines;

-- =============================================================================
-- 8) MIRROR — sync rasoi.Recipe → public.recipes (Supabase Table Editor)
-- =============================================================================
INSERT INTO public.recipes (
  id,
  title,
  description,
  prep_time,
  calories,
  region,
  diet_type,
  difficulty,
  image_url,
  tags,
  published,
  updated_at
)
SELECT
  r.id,
  r.title,
  r.description,
  r."prepTime",
  r.calories,
  r.region,
  r."dietType"::public.diet_type,
  r.difficulty::public.recipe_difficulty,
  r."imageUrl",
  COALESCE(
    (
      SELECT array_agg(value::text)
      FROM jsonb_array_elements_text(r.tags::jsonb)
    ),
    '{}'::text[]
  ),
  r.published,
  NOW()
FROM rasoi."Recipe" r
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  prep_time = EXCLUDED.prep_time,
  calories = EXCLUDED.calories,
  region = EXCLUDED.region,
  diet_type = EXCLUDED.diet_type,
  difficulty = EXCLUDED.difficulty,
  image_url = EXCLUDED.image_url,
  tags = EXCLUDED.tags,
  published = EXCLUDED.published,
  updated_at = NOW();

SELECT COUNT(*) AS public_recipes_count FROM public.recipes;

-- =============================================================================
-- 9) CLEANUP — remove legacy public recipes not in rasoi.Recipe
-- =============================================================================
DELETE FROM public.recipes
WHERE id NOT IN (SELECT id FROM rasoi."Recipe");

-- =============================================================================
-- 10) VIEW — recipes_with_ingredient_count (auto-refreshes; recreate if needed)
-- =============================================================================
CREATE OR REPLACE VIEW public.recipes_with_ingredient_count AS
SELECT
  r.*,
  COUNT(ri.id)::int AS ingredient_count
FROM public.recipes r
LEFT JOIN public.recipe_ingredients ri ON ri.recipe_id = r.id
GROUP BY r.id;

GRANT SELECT ON public.recipes_with_ingredient_count TO anon, authenticated;

-- Verify view matches recipes table
SELECT
  (SELECT COUNT(*) FROM public.recipes) AS recipes,
  (SELECT COUNT(*) FROM public.recipes_with_ingredient_count) AS view_rows,
  (SELECT COUNT(*) FROM public.recipe_ingredients) AS recipe_ingredients,
  (SELECT COUNT(*) FROM public.recipe_steps) AS recipe_steps;

-- For full ingredient + step sync from rasoi JSON, run:
--   cd rasoi_backend && npm run db:sync-public
