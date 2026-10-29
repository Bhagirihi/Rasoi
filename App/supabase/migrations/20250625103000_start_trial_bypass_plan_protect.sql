-- Allow trusted SECURITY DEFINER RPCs (start_trial) to update plan columns.
-- protect_user_sensitive_columns blocks authenticated JWT writes; RPCs still run as the user JWT.

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

  IF current_setting('rasoi.allow_plan_writes', true) = 'on' THEN
    RETURN NEW;
  END IF;

  NEW."planTier" := OLD."planTier";
  NEW."trialStartedAt" := OLD."trialStartedAt";
  NEW."hasUsedTrial" := OLD."hasUsedTrial";
  NEW."trialBonusDays" := OLD."trialBonusDays";
  NEW."yearlyPromoOfferTag" := OLD."yearlyPromoOfferTag";
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

CREATE OR REPLACE FUNCTION rasoi.start_trial()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = rasoi, public
AS $$
DECLARE
  auth_id text := auth.uid()::text;
  target rasoi."User"%ROWTYPE;
  payments_on boolean := false;
BEGIN
  IF auth_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT COALESCE("paymentsEnabled", false)
  INTO payments_on
  FROM rasoi."AppSettings"
  WHERE id = 'default'
  LIMIT 1;

  IF NOT payments_on THEN
    RAISE EXCEPTION 'Trials are not available right now';
  END IF;

  SELECT *
  INTO target
  FROM rasoi."User"
  WHERE "supabaseUserId" = auth_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  IF target."hasUsedTrial" OR target."planTier" = 'trial' THEN
    RAISE EXCEPTION 'Trial already used';
  END IF;

  PERFORM set_config('rasoi.allow_plan_writes', 'on', true);

  UPDATE rasoi."User"
  SET
    "planTier" = 'trial',
    "trialStartedAt" = now(),
    "hasUsedTrial" = true,
    "updatedAt" = now()
  WHERE id = target.id
  RETURNING * INTO target;

  RETURN json_build_object(
    'planTier', target."planTier",
    'trialStartedAt', target."trialStartedAt",
    'hasUsedTrial', target."hasUsedTrial"
  );
END;
$$;

REVOKE ALL ON FUNCTION rasoi.start_trial() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION rasoi.start_trial() TO authenticated;

NOTIFY pgrst, 'reload schema';
