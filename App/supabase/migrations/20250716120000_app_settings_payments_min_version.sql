-- Gate Rasoi Plus paywall by minimum app marketing version (semver).
-- When paymentsEnabled is true and paymentsMinAppVersion is set, only apps
-- at or above that version show paywall / trials / plan locks.
alter table rasoi."AppSettings"
  add column if not exists "paymentsMinAppVersion" text;

comment on column rasoi."AppSettings"."paymentsMinAppVersion" is
  'Optional semver floor (e.g. 1.0.14). Empty/null = all versions when paymentsEnabled.';
