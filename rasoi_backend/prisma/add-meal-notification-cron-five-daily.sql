-- Mirror of rasoi_mobile/supabase/migrations/20250626130000_meal_notification_cron_five_daily.sql

DO $$
DECLARE
  job record;
BEGIN
  FOR job IN SELECT jobid, jobname FROM cron.job
    WHERE jobname = 'rasoi-meal-notifications'
       OR jobname LIKE 'rasoi-push-%'
  LOOP
    PERFORM cron.unschedule(job.jobid);
  END LOOP;
END $$;

SELECT cron.schedule('rasoi-push-breakfast', '30 0 * * *', $$SELECT rasoi_cron.invoke_meal_notifications();$$);
SELECT cron.schedule('rasoi-push-lunch', '0 5 * * *', $$SELECT rasoi_cron.invoke_meal_notifications();$$);
SELECT cron.schedule('rasoi-push-snack', '30 8 * * *', $$SELECT rasoi_cron.invoke_meal_notifications();$$);
SELECT cron.schedule('rasoi-push-dinner', '0 12 * * *', $$SELECT rasoi_cron.invoke_meal_notifications();$$);
SELECT cron.schedule('rasoi-push-late-night', '30 14 * * *', $$SELECT rasoi_cron.invoke_meal_notifications();$$);
