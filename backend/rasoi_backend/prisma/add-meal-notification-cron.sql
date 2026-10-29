-- Mirror of rasoi_mobile/supabase/migrations/20250626120000_meal_notification_cron.sql

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
