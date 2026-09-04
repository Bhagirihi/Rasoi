-- User gender collected at signup (Male / Female / Other).
ALTER TABLE rasoi."User"
  ADD COLUMN IF NOT EXISTS gender TEXT;

COMMENT ON COLUMN rasoi."User".gender IS 'Signup gender: Male, Female, or Other';
