-- Partner checkout links by market (IN, US, CA, AU)
ALTER TABLE rasoi."PartnerLink"
  ADD COLUMN IF NOT EXISTS region TEXT NOT NULL DEFAULT 'IN';

UPDATE rasoi."PartnerLink"
SET region = 'IN'
WHERE region IS NULL OR region = '';

CREATE INDEX IF NOT EXISTS "PartnerLink_region_idx"
  ON rasoi."PartnerLink" (region);
