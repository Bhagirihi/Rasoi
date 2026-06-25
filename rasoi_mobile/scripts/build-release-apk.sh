#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

MISSING=0
if [[ -z "${EXPO_PUBLIC_EAS_PROJECT_ID:-}" ]]; then
  echo "[rasoi] Warning: EXPO_PUBLIC_EAS_PROJECT_ID is not set — push tokens will not register."
  echo "        Run: npm run setup:push"
  MISSING=1
fi

if [[ ! -f "$ROOT/google-services.json" ]]; then
  echo "[rasoi] Warning: google-services.json missing — Android FCM will not work."
  echo "        See docs/PUSH_SETUP.md"
  MISSING=1
fi

if [[ "$MISSING" -eq 1 ]]; then
  echo ""
  read -r -p "Continue build anyway? [y/N] " CONFIRM
  if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

expo prebuild --platform android
cd android
./gradlew assembleRelease -PreactNativeArchitectures=armeabi-v7a,arm64-v8a
mkdir -p ../dist
cp app/build/outputs/apk/release/app-release.apk ../dist/rasoi-release.apk
echo ""
echo "APK: dist/rasoi-release.apk"
