#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SHARED="$(cd "$ROOT/../gmail-imap" && pwd)"
VENV_PY="$SHARED/.venv/bin/python"
SERVER="$SHARED/server.py"
ENV_FILE="$ROOT/.env"

if [[ ! -x "$VENV_PY" ]]; then
  python3 -m venv "$SHARED/.venv"
  "$SHARED/.venv/bin/pip" install -q -r "$SHARED/requirements.txt"
fi

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

: "${GMAIL_USER:=dvesp1901@gmail.com}"

exec "$VENV_PY" "$SERVER"
