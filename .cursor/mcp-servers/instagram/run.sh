#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$ROOT/.env"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

if [[ -z "${INSTAGRAM_ACCESS_TOKEN:-}" ]]; then
  echo "instagram-mcp: set INSTAGRAM_ACCESS_TOKEN in .cursor/mcp-servers/instagram/.env" >&2
  exit 1
fi

exec npx -y @exileum/meta-mcp
