-- User-facing recipe fields (snake_case) alongside existing camelCase columns
ALTER TABLE rasoi."Recipe"
  ADD COLUMN IF NOT EXISTS cuisine text,
  ADD COLUMN IF NOT EXISTS diet text,
  ADD COLUMN IF NOT EXISTS main_ingredients text,
  ADD COLUMN IF NOT EXISTS method text,
  ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN rasoi."Recipe".cuisine IS 'Kitchen style id, e.g. north, healthy';
COMMENT ON COLUMN rasoi."Recipe".diet IS 'Veg, Egg, or Non-Veg';
COMMENT ON COLUMN rasoi."Recipe".main_ingredients IS 'Main ingredients summary text from scrape';
COMMENT ON COLUMN rasoi."Recipe".method IS 'JSON array of cooking steps';
COMMENT ON COLUMN rasoi."Recipe".image_url IS 'Public URL for recipe hero image';
