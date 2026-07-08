#!/usr/bin/env bash
# Dump remote Supabase (rasoi + public schemas) to local backups/supabase/<date>/
# Requires: rasoi_backend/.env with SUPABASE_DB_PASSWORD, SUPABASE_PROJECT_REF, SUPABASE_POOLER_HOST
# Requires: pg_dump (brew install libpq && export PATH="/usr/local/opt/libpq/bin:$PATH")

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="$ROOT/rasoi_backend/.env"
DATE_STAMP="$(date +%Y-%m-%d)"
BACKUP_DIR="$ROOT/backups/supabase/$DATE_STAMP"
PG_DUMP="${PG_DUMP:-$(command -v pg_dump || echo /usr/local/opt/libpq/bin/pg_dump)}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

if [[ ! -x "$PG_DUMP" ]] && ! command -v "$PG_DUMP" >/dev/null 2>&1; then
  echo "pg_dump not found. Install: brew install libpq"
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

for var in SUPABASE_DB_PASSWORD SUPABASE_PROJECT_REF SUPABASE_POOLER_HOST; do
  if [[ -z "${!var:-}" ]]; then
    echo "Missing $var in $ENV_FILE"
    exit 1
  fi
done

mkdir -p "$BACKUP_DIR"
export PGPASSWORD="$SUPABASE_DB_PASSWORD"
PGUSER="postgres.${SUPABASE_PROJECT_REF}"
PGHOST="$SUPABASE_POOLER_HOST"
PGPORT=5432
PGDATABASE=postgres

echo "Backing up to $BACKUP_DIR ..."

"$PG_DUMP" -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
  --schema=rasoi --schema-only --no-owner --no-acl \
  -f "$BACKUP_DIR/rasoi_schema.sql"

"$PG_DUMP" -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
  --schema=public --schema-only --no-owner --no-acl \
  -f "$BACKUP_DIR/public_schema.sql"

"$PG_DUMP" -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
  --schema=rasoi --data-only --no-owner --no-acl \
  -f "$BACKUP_DIR/rasoi_data.sql"

"$PG_DUMP" -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
  --schema=public --data-only --no-owner --no-acl \
  -f "$BACKUP_DIR/public_data.sql"

"$PG_DUMP" -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
  --schema=rasoi --schema=public --no-owner --no-acl -F c \
  -f "$BACKUP_DIR/rasoi_public_full.dump"

unset PGPASSWORD

echo ""
echo "Backup complete:"
ls -lh "$BACKUP_DIR"
du -sh "$BACKUP_DIR"
