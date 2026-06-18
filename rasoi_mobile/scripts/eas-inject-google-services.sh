#!/usr/bin/env bash
# EAS Build hook: materialize google-services.json from a file env var (not in git).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST_ROOT="$ROOT/google-services.json"
DEST_ANDROID="$ROOT/android/app/google-services.json"

copy_google_services() {
  local src="$1"
  cp "$src" "$DEST_ROOT"
  mkdir -p "$(dirname "$DEST_ANDROID")"
  cp "$src" "$DEST_ANDROID"
  echo "[rasoi] google-services.json ready for Android build"
}

if [[ -n "${GOOGLE_SERVICES_JSON:-}" && -f "${GOOGLE_SERVICES_JSON}" ]]; then
  copy_google_services "$GOOGLE_SERVICES_JSON"
  exit 0
fi

if [[ -f "$DEST_ROOT" ]]; then
  if [[ ! -f "$DEST_ANDROID" ]]; then
    copy_google_services "$DEST_ROOT"
  else
    echo "[rasoi] google-services.json already present"
  fi
  exit 0
fi

echo "[rasoi] ERROR: google-services.json missing on EAS build."
echo "  Upload: eas env:create production --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json --visibility secret"
echo "  Or run: npm run setup:push"
exit 1
