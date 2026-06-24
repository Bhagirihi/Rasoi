-- Run once on Supabase if db push is not used from CI.
ALTER TABLE rasoi."AppSettings"
  ADD COLUMN IF NOT EXISTS "defaultPantryIngredients" TEXT NOT NULL DEFAULT '[]';
