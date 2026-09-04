-- Legacy mirror of rasoi.Recipe into public.* — no longer written or read by the app.
-- Pantry catalog and recipes API use rasoi.Recipe; saved recipes live on rasoi.User.savedRecipeIds.

DROP VIEW IF EXISTS public.recipes_with_ingredient_count;

DROP TABLE IF EXISTS public.saved_recipes;
DROP TABLE IF EXISTS public.recipe_ingredients;
DROP TABLE IF EXISTS public.recipe_steps;

ALTER TABLE public.affiliate_events
  DROP CONSTRAINT IF EXISTS affiliate_events_recipe_id_fkey;

DROP TABLE IF EXISTS public.recipes;

-- Orphaned with recipe mirror; pantry is rasoi.User.pantryIngredients (JSON).
DROP TABLE IF EXISTS public.user_pantry_items;
DROP TABLE IF EXISTS public.ingredients;
