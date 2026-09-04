-- Start in-app trial from mobile (SECURITY DEFINER bypasses client planTier UPDATE block).

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
