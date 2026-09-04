-- Meal push notifications: pg_cron + pg_net → Rasoi API /api/cron/meal-notifications
-- Replaces GitHub Actions as the primary scheduler (every 15 min).
--
-- One-time after apply: run rasoi_backend/scripts/setup-supabase-cron-vault.sql
-- with the same CRON_SECRET as Vercel.

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE SCHEMA IF NOT EXISTS rasoi_cron;

CREATE OR REPLACE FUNCTION rasoi_cron.invoke_meal_notifications()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault, net, extensions, pg_catalog
AS $$
DECLARE
  api_base text;
  cron_secret text;
BEGIN
  SELECT decrypted_secret INTO api_base
  FROM vault.decrypted_secrets
  WHERE name = 'rasoi_api_base_url'
  LIMIT 1;

  SELECT decrypted_secret INTO cron_secret
  FROM vault.decrypted_secrets
  WHERE name = 'rasoi_cron_secret'
  LIMIT 1;

  IF api_base IS NULL OR cron_secret IS NULL THEN
    RAISE WARNING 'rasoi_cron: missing vault secrets rasoi_api_base_url or rasoi_cron_secret — run setup-supabase-cron-vault.sql';
    RETURN NULL;
  END IF;

  RETURN net.http_get(
    url := rtrim(api_base, '/') || '/api/cron/meal-notifications',
    headers := jsonb_build_object('Authorization', 'Bearer ' || cron_secret),
    timeout_milliseconds := 55000
  );
END;
$$;

COMMENT ON FUNCTION rasoi_cron.invoke_meal_notifications() IS
  'Triggers Rasoi meal push cron on the production API. Requires Vault secrets rasoi_api_base_url and rasoi_cron_secret.';

-- Idempotent reschedule
DO $$
DECLARE
  existing_job_id bigint;
BEGIN
  SELECT jobid INTO existing_job_id
  FROM cron.job
  WHERE jobname = 'rasoi-meal-notifications'
  LIMIT 1;

  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;
END $$;

SELECT cron.schedule(
  'rasoi-meal-notifications',
  '*/15 * * * *',
  $$SELECT rasoi_cron.invoke_meal_notifications();$$
);
