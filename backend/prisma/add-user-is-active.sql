-- Run once in Supabase SQL editor (rasoi schema).
ALTER TABLE rasoi."User"
ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true;
