#!/usr/bin/env bash
# EAS Build hook: materialize google-services.json from a file env var (not in git).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST_ROOT="$ROOT/google-services.json"
DEST_ANDROID="$ROOT/android/app/google-services.json"
TRACKED_FALLBACK="$ROOT/config/google-services.json"

is_valid_json() {
  local file="$1"
  python3 -m json.tool "$file" >/dev/null 2>&1 && return 0
  command -v node >/dev/null 2>&1 && node -e "JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'))" "$file"
}

validate_json() {
  local file="$1"
  if is_valid_json "$file"; then
    return 0
  fi
  echo "[rasoi] ERROR: google-services.json is not valid JSON: $file"
  head -5 "$file" | sed 's/^/  /'
  return 1
}

write_copy() {
  local src="$1"
  local dest="$2"
  if [[ -f "$dest" ]] && [[ "$src" -ef "$dest" ]]; then
    validate_json "$dest"
    return 0
  fi
  cp "$src" "$dest"
  validate_json "$dest"
}

copy_google_services() {
  local src="$1"
  write_copy "$src" "$DEST_ROOT"
  mkdir -p "$(dirname "$DEST_ANDROID")"
  write_copy "$src" "$DEST_ANDROID"
  echo "[rasoi] google-services.json ready for Android build"
}

try_source() {
  local src="$1"
  if [[ -f "$src" ]] && is_valid_json "$src"; then
    copy_google_services "$src"
    exit 0
  fi
  return 1
}

echo "[rasoi] eas-inject-google-services: cwd=$(pwd) root=$ROOT"
if [[ -n "${GOOGLE_SERVICES_JSON:-}" ]]; then
  echo "[rasoi] GOOGLE_SERVICES_JSON is set (len=${#GOOGLE_SERVICES_JSON}, file=$([[ -f "${GOOGLE_SERVICES_JSON}" ]] && echo yes || echo no))"
fi

try_source "$TRACKED_FALLBACK" || true
try_source "$DEST_ROOT" || true
try_source "$DEST_ANDROID" || true

if [[ -n "${GOOGLE_SERVICES_JSON:-}" && -f "${GOOGLE_SERVICES_JSON}" ]]; then
  try_source "$GOOGLE_SERVICES_JSON" || echo "[rasoi] WARNING: GOOGLE_SERVICES_JSON file is not valid JSON"
fi

if [[ -n "${GOOGLE_SERVICES_JSON:-}" && "${GOOGLE_SERVICES_JSON:0:1}" == "{" ]]; then
  printf '%s' "$GOOGLE_SERVICES_JSON" > "$DEST_ROOT"
  try_source "$DEST_ROOT" || true
fi

echo "[rasoi] ERROR: google-services.json missing on EAS build."
echo "  Add config/google-services.json or upload:"
echo "  eas env:update production --variable-name GOOGLE_SERVICES_JSON --value ./google-services.json --type file --visibility secret"
exit 1
