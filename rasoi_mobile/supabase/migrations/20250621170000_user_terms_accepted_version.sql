-- Required by rasoi.protect_user_sensitive_columns trigger (user write RLS migration).
ALTER TABLE rasoi."User"
  ADD COLUMN IF NOT EXISTS "termsAcceptedVersion" TEXT;

NOTIFY pgrst, 'reload schema';
