-- Link rasoi.User rows to Supabase auth.users (anonymous guest → email upgrade keeps same UUID).
ALTER TABLE rasoi."User"
  ADD COLUMN IF NOT EXISTS "supabaseUserId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "User_supabaseUserId_key"
  ON rasoi."User" ("supabaseUserId")
  WHERE "supabaseUserId" IS NOT NULL;
