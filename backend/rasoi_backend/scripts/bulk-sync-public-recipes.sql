-- Bulk sync public recipe tables from rasoi."Recipe" JSON columns.
-- Run: psql $DATABASE_URL -f scripts/bulk-sync-public-recipes.sql
-- Or via Supabase SQL editor / MCP execute_sql.

BEGIN;

-- 1) Recipe headers
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
  COALESCE(r."descriptionHi", ''),
  r."prepTime",
  r.calories,
  r.region,
  r."dietType"::public.diet_type,
  r.difficulty::public.recipe_difficulty,
  r."imageUrl",
  '{}'::text[],
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

-- 2) Master ingredients (deduped by name; supports string[] or {name,isStaple}[] JSON)
WITH raw_ingredients AS (
  SELECT
    CASE
      WHEN jsonb_typeof(ing) = 'string' THEN trim(ing #>> '{}')
      ELSE trim(COALESCE(ing->>'name', ''))
    END AS name,
    CASE
      WHEN jsonb_typeof(ing) = 'string' THEN false
      ELSE COALESCE((ing->>'isStaple')::boolean, false)
    END AS is_staple
  FROM rasoi."Recipe" r,
  LATERAL jsonb_array_elements(r.ingredients::jsonb) AS ing
),
ingredient_rows AS (
  SELECT DISTINCT ON (lower(name))
    name,
    is_staple
  FROM raw_ingredients
  WHERE name <> ''
  ORDER BY lower(name), is_staple DESC
)
INSERT INTO public.ingredients (name, section, is_staple)
SELECT
  name,
  CASE WHEN is_staple THEN 'Staples'::public.pantry_section ELSE 'Other'::public.pantry_section END,
  is_staple
FROM ingredient_rows
ON CONFLICT (name) DO UPDATE SET
  is_staple = public.ingredients.is_staple OR EXCLUDED.is_staple;

-- 3) Recipe ↔ ingredient links (rebuild)
DELETE FROM public.recipe_ingredients;

WITH raw_links AS (
  SELECT
    r.id AS recipe_id,
    CASE
      WHEN jsonb_typeof(ing) = 'string' THEN trim(ing #>> '{}')
      ELSE trim(COALESCE(ing->>'name', ''))
    END AS ingredient_name,
    ordinality AS sort_order,
    CASE WHEN jsonb_typeof(ing) = 'object' THEN ing->'recommendedBrand'->>'name' END AS brand_name,
    CASE WHEN jsonb_typeof(ing) = 'object' THEN ing->'recommendedBrand'->>'logo' END AS brand_logo_url
  FROM rasoi."Recipe" r,
  LATERAL jsonb_array_elements(r.ingredients::jsonb) WITH ORDINALITY AS t(ing, ordinality)
),
expanded AS (
  SELECT DISTINCT ON (recipe_id, lower(ingredient_name))
    recipe_id,
    ingredient_name,
    sort_order,
    brand_name,
    brand_logo_url
  FROM raw_links
  WHERE ingredient_name <> ''
  ORDER BY recipe_id, lower(ingredient_name), sort_order
)
INSERT INTO public.recipe_ingredients (recipe_id, ingredient_id, sort_order, brand_name, brand_logo_url)
SELECT
  e.recipe_id,
  i.id,
  e.sort_order,
  e.brand_name,
  e.brand_logo_url
FROM expanded e
JOIN public.ingredients i ON i.name = e.ingredient_name;

-- 4) Cooking steps (rebuild)
DELETE FROM public.recipe_steps;

INSERT INTO public.recipe_steps (recipe_id, step_number, instruction)
SELECT
  r.id,
  ordinality::int,
  step_text
FROM rasoi."Recipe" r,
LATERAL jsonb_array_elements_text(
  CASE
    WHEN r.steps IS NULL OR r.steps::text IN ('null', '[]') THEN '[]'::jsonb
    ELSE r.steps::jsonb
  END
) WITH ORDINALITY AS t(step_text, ordinality)
WHERE trim(step_text) <> '';

-- 5) Remove public recipes no longer in catalog
DELETE FROM public.recipes
WHERE id NOT IN (SELECT id FROM rasoi."Recipe");

COMMIT;

-- 6) View (auto-counts ingredients per recipe)
CREATE OR REPLACE VIEW public.recipes_with_ingredient_count AS
SELECT
  r.*,
  COUNT(ri.id)::int AS ingredient_count
FROM public.recipes r
LEFT JOIN public.recipe_ingredients ri ON ri.recipe_id = r.id
GROUP BY r.id;

GRANT SELECT ON public.recipes_with_ingredient_count TO anon, authenticated;

-- 7) Verify
SELECT
  (SELECT COUNT(*)::int FROM rasoi."Recipe") AS rasoi_recipes,
  (SELECT COUNT(*)::int FROM public.recipes) AS public_recipes,
  (SELECT COUNT(*)::int FROM public.ingredients) AS ingredients,
  (SELECT COUNT(*)::int FROM public.recipe_ingredients) AS recipe_ingredients,
  (SELECT COUNT(*)::int FROM public.recipe_steps) AS recipe_steps,
  (SELECT COUNT(*)::int FROM public.recipes_with_ingredient_count) AS view_rows,
  (SELECT COUNT(*)::int FROM public.recipes_with_ingredient_count WHERE ingredient_count = 0) AS zero_ingredient;
