-- User location fields + sponsor analytics events
-- Run on Supabase (rasoi schema) after deploy.
-- Applied via Supabase migration: user_location_sponsor_events

ALTER TABLE rasoi."User"
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision,
  ADD COLUMN IF NOT EXISTS "locationUpdatedAt" timestamp without time zone;

CREATE TABLE IF NOT EXISTS rasoi."SponsorEvent" (
  id text PRIMARY KEY,
  "userId" text,
  "eventType" text NOT NULL,
  "brandName" text NOT NULL,
  placement text NOT NULL,
  "sponsorId" text,
  partner text,
  query text,
  city text,
  "createdAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SponsorEvent_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES rasoi."User"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "SponsorEvent_brandName_placement_createdAt_idx"
  ON rasoi."SponsorEvent" ("brandName", placement, "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "SponsorEvent_eventType_createdAt_idx"
  ON rasoi."SponsorEvent" ("eventType", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "SponsorEvent_userId_createdAt_idx"
  ON rasoi."SponsorEvent" ("userId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "AffiliateEvent_context_createdAt_idx"
  ON rasoi."AffiliateEvent" (context, "createdAt" DESC);

DO $$
BEGIN
  EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE rasoi."SponsorEvent"';
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'SponsorEvent already in supabase_realtime';
END $$;
