#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
VENV_PY="$ROOT/.venv/bin/python"
ANDROID_MCP="$ROOT/.venv/bin/android-mcp"

if [[ ! -x "$ANDROID_MCP" ]]; then
  python3 -m venv "$ROOT/.venv"
  "$ROOT/.venv/bin/pip" install -q -r "$ROOT/requirements.txt"
fi

exec "$ANDROID_MCP" "$@"
