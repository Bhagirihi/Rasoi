-- Expose rasoi schema to PostgREST (mobile .schema('rasoi') + Edge Functions).
-- Dashboard: Settings → API → Exposed schemas should include rasoi (SQL keeps pgrst.db_schemas in sync).

DO $$
DECLARE
  current_schemas text;
BEGIN
  SELECT split_part(unnest::text, '=', 2)
  INTO current_schemas
  FROM unnest(
    COALESCE(
      (SELECT rolconfig FROM pg_roles WHERE rolname = 'authenticator'),
      ARRAY[]::text[]
    )
  ) AS unnest
  WHERE unnest LIKE 'pgrst.db_schemas=%'
  LIMIT 1;

  IF current_schemas IS NULL OR current_schemas = '' THEN
    current_schemas := 'public';
  END IF;

  IF position('rasoi' in current_schemas) = 0 THEN
    current_schemas := current_schemas || ', rasoi';
  END IF;

  EXECUTE format('ALTER ROLE authenticator SET pgrst.db_schemas = %L', current_schemas);
END $$;

NOTIFY pgrst, 'reload config';

GRANT USAGE ON SCHEMA rasoi TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA rasoi TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA rasoi TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA rasoi GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA rasoi GRANT ALL ON SEQUENCES TO service_role;
