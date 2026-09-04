-- Five daily meal-notification crons (2 hr before meal anchors, IST → UTC).
-- Replaces rasoi-meal-notifications */15 * * * *.

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

-- IST 06:00 → UTC 00:30 (breakfast plan-ahead; meal at 08:00)
SELECT cron.schedule(
  'rasoi-push-breakfast',
  '30 0 * * *',
  $$SELECT rasoi_cron.invoke_meal_notifications();$$
);

-- IST 10:30 → UTC 05:00 (lunch plan-ahead; meal at 12:30)
SELECT cron.schedule(
  'rasoi-push-lunch',
  '0 5 * * *',
  $$SELECT rasoi_cron.invoke_meal_notifications();$$
);

-- IST 14:00 → UTC 08:30 (snack plan-ahead; meal at 16:00)
SELECT cron.schedule(
  'rasoi-push-snack',
  '30 8 * * *',
  $$SELECT rasoi_cron.invoke_meal_notifications();$$
);

-- IST 17:30 → UTC 12:00 (dinner plan-ahead; meal at 19:30)
SELECT cron.schedule(
  'rasoi-push-dinner',
  '0 12 * * *',
  $$SELECT rasoi_cron.invoke_meal_notifications();$$
);

-- IST 20:00 → UTC 14:30 (late-night plan-ahead; window from 21:30)
SELECT cron.schedule(
  'rasoi-push-late-night',
  '30 14 * * *',
  $$SELECT rasoi_cron.invoke_meal_notifications();$$
);
