-- Phase 2: authenticated users read/update own profile; insert analytics rows.

GRANT SELECT, UPDATE ON TABLE rasoi."User" TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE rasoi."PushToken" TO authenticated;
GRANT INSERT ON TABLE rasoi."AffiliateEvent" TO authenticated;
GRANT INSERT ON TABLE rasoi."SponsorEvent" TO authenticated;
GRANT INSERT ON TABLE rasoi."UserFeedback" TO authenticated;

DROP POLICY IF EXISTS "mobile_read_own_user" ON rasoi."User";
CREATE POLICY "mobile_read_own_user"
  ON rasoi."User"
  FOR SELECT
  TO authenticated
  USING ("supabaseUserId" = auth.uid()::text);

DROP POLICY IF EXISTS "mobile_update_own_user" ON rasoi."User";
CREATE POLICY "mobile_update_own_user"
  ON rasoi."User"
  FOR UPDATE
  TO authenticated
  USING ("supabaseUserId" = auth.uid()::text)
  WITH CHECK ("supabaseUserId" = auth.uid()::text);

DROP POLICY IF EXISTS "mobile_manage_own_push_tokens" ON rasoi."PushToken";
CREATE POLICY "mobile_manage_own_push_tokens"
  ON rasoi."PushToken"
  FOR ALL
  TO authenticated
  USING (
    "userId" IN (
      SELECT id FROM rasoi."User" WHERE "supabaseUserId" = auth.uid()::text
    )
  )
  WITH CHECK (
    "userId" IN (
      SELECT id FROM rasoi."User" WHERE "supabaseUserId" = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "mobile_insert_own_affiliate_events" ON rasoi."AffiliateEvent";
CREATE POLICY "mobile_insert_own_affiliate_events"
  ON rasoi."AffiliateEvent"
  FOR INSERT
  TO authenticated
  WITH CHECK (
    "userId" IS NULL
    OR "userId" IN (
      SELECT id FROM rasoi."User" WHERE "supabaseUserId" = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "mobile_insert_own_sponsor_events" ON rasoi."SponsorEvent";
CREATE POLICY "mobile_insert_own_sponsor_events"
  ON rasoi."SponsorEvent"
  FOR INSERT
  TO authenticated
  WITH CHECK (
    "userId" IS NULL
    OR "userId" IN (
      SELECT id FROM rasoi."User" WHERE "supabaseUserId" = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "mobile_insert_feedback" ON rasoi."UserFeedback";
CREATE POLICY "mobile_insert_feedback"
  ON rasoi."UserFeedback"
  FOR INSERT
  TO authenticated
  WITH CHECK (
    "userId" IS NULL
    OR "userId" IN (
      SELECT id FROM rasoi."User" WHERE "supabaseUserId" = auth.uid()::text
    )
  );

CREATE OR REPLACE FUNCTION rasoi.protect_user_sensitive_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  jwt_role text;
BEGIN
  jwt_role := auth.jwt() ->> 'role';

  IF jwt_role IS NULL OR jwt_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  NEW."planTier" := OLD."planTier";
  NEW."trialStartedAt" := OLD."trialStartedAt";
  NEW."hasUsedTrial" := OLD."hasUsedTrial";
  NEW."role" := OLD."role";
  NEW."isActive" := OLD."isActive";
  NEW."isGuest" := OLD."isGuest";
  NEW."email" := OLD."email";
  NEW."supabaseUserId" := OLD."supabaseUserId";
  NEW."termsAcceptedAt" := OLD."termsAcceptedAt";
  NEW."termsAcceptedVersion" := OLD."termsAcceptedVersion";
  NEW."createdAt" := OLD."createdAt";

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_user_sensitive_columns ON rasoi."User";
CREATE TRIGGER protect_user_sensitive_columns
  BEFORE UPDATE ON rasoi."User"
  FOR EACH ROW
  EXECUTE FUNCTION rasoi.protect_user_sensitive_columns();
