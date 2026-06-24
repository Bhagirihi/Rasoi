-- Merge duplicate ingredient names into canonical household names.
-- Safe to re-run: only merges rows that still exist as variants.

BEGIN;

CREATE TEMP TABLE IF NOT EXISTS ingredient_merge_map (
  variant TEXT NOT NULL,
  canonical TEXT NOT NULL
);

TRUNCATE ingredient_merge_map;

INSERT INTO ingredient_merge_map (variant, canonical) VALUES
  ('Ginger', 'Adrak'),
  ('Lasan', 'Lahsun'),
  ('Lasun', 'Lahsun'),
  ('Lassan', 'Lahsun'),
  ('Garlic', 'Lahsun'),
  ('Adrak Lasan Paste', 'Adrak Lahsun Paste'),
  ('Ginger Garlic Paste', 'Adrak Lahsun Paste'),
  ('Ginger Garlic', 'Adrak Lahsun Paste'),
  ('Adrak Lehsun Paste', 'Adrak Lahsun Paste'),
  ('Green Chilli', 'Hari Mirch'),
  ('Green Chili', 'Hari Mirch'),
  ('Mirchi', 'Hari Mirch'),
  ('Hari Mirchi', 'Hari Mirch'),
  ('Mirch', 'Hari Mirch'),
  ('Turmeric', 'Haldi'),
  ('Hara Dhania', 'Dhania Patta'),
  ('Coriander Leaves', 'Dhania Patta'),
  ('Coriander', 'Dhania Patta'),
  ('Fresh Coriander', 'Dhania Patta'),
  ('Coriander Powder', 'Dhania Powder'),
  ('Cumin', 'Jeera'),
  ('Cumin Seeds', 'Jeera'),
  ('Black Pepper', 'Kali Mirch'),
  ('Mustard Seeds', 'Rai'),
  ('Curry Leaves', 'Kadi Patta'),
  ('Curry Patta', 'Kadi Patta'),
  ('Kari Patta', 'Kadi Patta'),
  ('Lemon Juice', 'Nimbu Ras'),
  ('Tamarind', 'Imli'),
  ('Curd', 'Dahi'),
  ('Yogurt', 'Dahi'),
  ('Milk', 'Doodh'),
  ('Desi Ghee', 'Ghee'),
  ('Sugar', 'Chini'),
  ('Cheeni', 'Chini'),
  ('Jaggery', 'Gud'),
  ('Gur', 'Gud'),
  ('Salt', 'Namak'),
  ('Oil', 'Tel'),
  ('Cooking Oil', 'Tel'),
  ('Vegetable Oil', 'Tel'),
  ('Refined Oil', 'Tel'),
  ('Basmati Rice', 'Basmati Chawal'),
  ('Rice', 'Chawal'),
  ('Rice Flour', 'Chawal Atta'),
  ('Atta', 'Gehu Atta'),
  ('Wheat Flour', 'Gehu Atta'),
  ('Gahu Atta', 'Gehu Atta'),
  ('Gehun Atta', 'Gehu Atta'),
  ('Bajri Atta', 'Bajra Atta'),
  ('All-Purpose Flour', 'Maida'),
  ('All Purpose Flour', 'Maida'),
  ('Refined Flour', 'Maida'),
  ('Gram Flour', 'Besan'),
  ('Bateta', 'Aloo'),
  ('Potato', 'Aloo'),
  ('Brinjal', 'Baingan'),
  ('Ringan', 'Baingan'),
  ('Vangi', 'Baingan'),
  ('Eggplant', 'Baingan'),
  ('Gobi', 'Gobhi'),
  ('Cauliflower', 'Gobhi'),
  ('Cabbage', 'Patta Gobhi'),
  ('Kobi', 'Patta Gobhi'),
  ('Capsicum', 'Shimla Mirch'),
  ('Bell Pepper', 'Shimla Mirch'),
  ('Tomato', 'Tamatar'),
  ('Onion', 'Pyaaz'),
  ('Pyaz', 'Pyaaz'),
  ('Split Moong Dal', 'Moong Dal'),
  ('Mung Dal', 'Moong Dal'),
  ('Yellow Moong Dal', 'Moong Dal'),
  ('Toor Dal', 'Tuver Dal'),
  ('Arhar Dal', 'Tuver Dal'),
  ('Tuvar Dal', 'Tuver Dal'),
  ('Whole Urad Dal', 'Urad Dal'),
  ('Black Urad Dal', 'Urad Dal'),
  ('Red Lentils', 'Masoor Dal'),
  ('Masoor', 'Masoor Dal'),
  ('Chickpeas', 'Chana'),
  ('Kabuli Chana', 'Chana'),
  ('Peanuts', 'Mungfali'),
  ('Groundnut', 'Mungfali'),
  ('Peanut', 'Mungfali'),
  ('Singdana', 'Mungfali'),
  ('Coconut', 'Nariyal'),
  ('Fresh Coconut', 'Nariyal'),
  ('Dry Coconut', 'Sukha Nariyal'),
  ('Desiccated Coconut', 'Sukha Nariyal'),
  ('Fennel Seeds', 'Saunf'),
  ('Cardamom', 'Elaichi'),
  ('Green Cardamom', 'Elaichi'),
  ('Bay Leaf', 'Tej Patta'),
  ('Bay Leaves', 'Tej Patta'),
  ('Clove', 'Laung'),
  ('Cloves', 'Laung'),
  ('Dried Fenugreek Leaves', 'Kasuri Methi'),
  ('Kasoori Methi', 'Kasuri Methi'),
  ('Red Chilli Powder', 'Lal Mirch Powder'),
  ('Laal Mirch', 'Lal Mirch Powder'),
  ('Red Chili Powder', 'Lal Mirch Powder'),
  ('Kashmiri Chilli Powder', 'Lal Mirch Powder'),
  ('Asafoetida', 'Hing'),
  ('Heeng', 'Hing'),
  ('Garam masala', 'Garam Masala');

-- Ensure canonical ingredient rows exist.
INSERT INTO public.ingredients (name, section, is_staple)
SELECT DISTINCT m.canonical, 'Other'::public.pantry_section, false
FROM ingredient_merge_map m
ON CONFLICT (name) DO NOTHING;

-- Re-link recipe ingredients from variant → canonical.
UPDATE public.recipe_ingredients ri
SET ingredient_id = canonical_row.id
FROM ingredient_merge_map m
JOIN public.ingredients variant_row
  ON lower(trim(variant_row.name)) = lower(trim(m.variant))
JOIN public.ingredients canonical_row
  ON lower(trim(canonical_row.name)) = lower(trim(m.canonical))
WHERE ri.ingredient_id = variant_row.id
  AND variant_row.id <> canonical_row.id;

-- Drop duplicate user pantry links after merge.
DELETE FROM public.user_pantry_items upi
USING ingredient_merge_map m,
      public.ingredients variant_row,
      public.ingredients canonical_row,
      public.user_pantry_items existing
WHERE lower(trim(variant_row.name)) = lower(trim(m.variant))
  AND lower(trim(canonical_row.name)) = lower(trim(m.canonical))
  AND upi.ingredient_id = variant_row.id
  AND existing.user_id = upi.user_id
  AND existing.ingredient_id = canonical_row.id;

UPDATE public.user_pantry_items upi
SET ingredient_id = canonical_row.id
FROM ingredient_merge_map m
JOIN public.ingredients variant_row
  ON lower(trim(variant_row.name)) = lower(trim(m.variant))
JOIN public.ingredients canonical_row
  ON lower(trim(canonical_row.name)) = lower(trim(m.canonical))
WHERE upi.ingredient_id = variant_row.id
  AND variant_row.id <> canonical_row.id;

-- Remove unreferenced variant rows.
DELETE FROM public.ingredients i
USING ingredient_merge_map m
WHERE lower(trim(i.name)) = lower(trim(m.variant))
  AND NOT EXISTS (SELECT 1 FROM public.recipe_ingredients ri WHERE ri.ingredient_id = i.id)
  AND NOT EXISTS (SELECT 1 FROM public.user_pantry_items upi WHERE upi.ingredient_id = i.id);

-- Mark household staples.
UPDATE public.ingredients
SET is_staple = true
WHERE name IN (
  'Haldi', 'Namak', 'Lal Mirch Powder', 'Dhania Powder', 'Jeera', 'Rai', 'Hing', 'Garam Masala',
  'Aloo', 'Pyaaz', 'Tamatar', 'Adrak', 'Lahsun', 'Hari Mirch'
);

-- Default pantry for new users (admin-managed).
UPDATE rasoi."AppSettings"
SET "defaultPantryIngredients" = '["Haldi","Namak","Lal Mirch Powder","Dhania Powder","Jeera","Rai","Hing","Garam Masala","Aloo","Pyaaz","Tamatar","Adrak","Lahsun","Hari Mirch"]'::text
WHERE id = 'default';

INSERT INTO rasoi."AppSettings" (id, "paymentsEnabled", "defaultPantryIngredients", "updatedAt")
VALUES (
  'default',
  false,
  '["Haldi","Namak","Lal Mirch Powder","Dhania Powder","Jeera","Rai","Hing","Garam Masala","Aloo","Pyaaz","Tamatar","Adrak","Lahsun","Hari Mirch"]',
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET "defaultPantryIngredients" = EXCLUDED."defaultPantryIngredients",
    "updatedAt" = NOW();

COMMIT;
