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

if [[ -f "$ROOT/.env.production" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env.production"
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

if [[ -z "${RASOI_KEYSTORE_FILE:-}" ]]; then
  echo "[rasoi] Warning: RASOI_KEYSTORE_FILE is not set — the release build will be signed with the DEBUG key."
  echo "        Do NOT publish this APK to the Play Store. Generate a release keystore once:"
  echo "          keytool -genkeypair -v -keystore rasoi-release.jks -alias rasoi -keyalg RSA -keysize 2048 -validity 10000"
  echo "        then export RASOI_KEYSTORE_FILE, RASOI_KEYSTORE_PASSWORD, RASOI_KEY_ALIAS, RASOI_KEY_PASSWORD."
  echo ""
  read -r -p "Continue with debug-signed build? [y/N] " CONFIRM
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
