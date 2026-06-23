#!/usr/bin/env bash
# Preflight checks before running Maestro device QA.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail() {
  echo "❌ $1" >&2
  exit 1
}

ok() {
  echo "✓ $1"
}

command -v adb >/dev/null 2>&1 || fail "adb not found. Install Android platform-tools."

DEVICE_COUNT="$(adb devices 2>/dev/null | awk 'NR>1 && $2=="device" { c++ } END { print c+0 }')"
if [[ "$DEVICE_COUNT" -lt 1 ]]; then
  fail "No Android device connected. Run: adb devices"
fi
ok "Android device connected ($DEVICE_COUNT)"

MAESTRO_BIN="${MAESTRO_BIN:-maestro}"
if ! command -v "$MAESTRO_BIN" >/dev/null 2>&1; then
  cat >&2 <<'EOF'
❌ Maestro CLI not found.

Install (macOS/Linux):
  curl -Ls "https://get.maestro.mobile.dev" | bash

Then add ~/.maestro/bin to PATH, or set MAESTRO_BIN to the full path.
EOF
  exit 1
fi
ok "Maestro CLI ($("$MAESTRO_BIN" --version 2>/dev/null | head -1 || echo installed))"

APP_ID="${RASOI_APP_ID:-com.bhagihiri.rasoiapp}"
if adb shell pm path "$APP_ID" >/dev/null 2>&1; then
  ok "App installed ($APP_ID)"
else
  fail "App $APP_ID not installed. Build and install: npm run android"
fi

# Debug builds need Metro + USB reverse
if curl -sf --max-time 3 "http://localhost:8081/status" >/dev/null 2>&1; then
  adb reverse tcp:8081 tcp:8081 >/dev/null 2>&1 || true
  ok "Metro running (adb reverse tcp:8081 set)"
else
  echo "⚠ Metro not running — start: cd rasoi_mobile && npx expo start"
  echo "  Debug builds will show redbox until Metro is reachable."
fi

if curl -sf --max-time 8 "https://rasoiapplication.in/api/recipes" >/dev/null 2>&1; then
  ok "Backend API reachable"
else
  echo "⚠ Backend API not reachable — recipe flows may fail if cache is empty"
fi

if command -v npx >/dev/null 2>&1; then
  if npx tsc --noEmit >/dev/null 2>&1; then
    ok "TypeScript check passed"
  else
    echo "⚠ TypeScript errors present (qa can still run)"
  fi
fi

echo ""
echo "Preflight passed. Run: npm run qa:smoke"
