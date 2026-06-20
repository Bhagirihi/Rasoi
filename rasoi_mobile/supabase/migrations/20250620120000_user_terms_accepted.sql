ALTER TABLE rasoi."User"
  ADD COLUMN IF NOT EXISTS "termsAcceptedAt" timestamp without time zone;
