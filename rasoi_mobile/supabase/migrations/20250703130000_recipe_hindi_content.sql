-- Hindi recipe content (description + cooking steps)
ALTER TABLE rasoi."Recipe"
  ADD COLUMN IF NOT EXISTS "descriptionHi" text,
  ADD COLUMN IF NOT EXISTS "stepsHi" text;

COMMENT ON COLUMN rasoi."Recipe"."descriptionHi" IS 'Hindi description for recipe detail screen';
COMMENT ON COLUMN rasoi."Recipe"."stepsHi" IS 'JSON array of Hindi cooking steps';
