-- Scrape provenance for recipes pushed from outputs/recipes
ALTER TABLE rasoi."Recipe"
  ADD COLUMN IF NOT EXISTS "sourceUrl" text,
  ADD COLUMN IF NOT EXISTS "sourceSite" text,
  ADD COLUMN IF NOT EXISTS "scrapedAt" timestamptz;

COMMENT ON COLUMN rasoi."Recipe"."sourceUrl" IS 'Original recipe page URL from scrape';
COMMENT ON COLUMN rasoi."Recipe"."sourceSite" IS 'Source domain from scrape metadata';
COMMENT ON COLUMN rasoi."Recipe"."scrapedAt" IS 'When the markdown was scraped locally';
