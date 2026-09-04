-- Default pantry items for new users (admin-managed via Rasoi Console).
ALTER TABLE rasoi."AppSettings"
  ADD COLUMN IF NOT EXISTS "defaultPantryIngredients" TEXT NOT NULL DEFAULT '[]';
