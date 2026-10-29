#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

GOOGLE_SERVICES="$ROOT/google-services.json"
PACKAGE="com.bhagihiri.rasoiapp"
PROJECT_ID="${FIREBASE_PROJECT_ID:-rasoi-app-prod}"
DISPLAY_NAME="${FIREBASE_DISPLAY_NAME:-Rasoi App}"
APP_LABEL="${FIREBASE_APP_LABEL:-Rasoi Android}"

require_firebase_login() {
  if ! npx firebase-tools login:list 2>/dev/null | grep -q 'Logged in as'; then
    echo "Firebase CLI not logged in."
    echo "Run: npx firebase-tools login --reauth"
    exit 1
  fi
}

project_exists() {
  npx firebase-tools projects:list 2>/dev/null | grep -F "$PROJECT_ID" >/dev/null
}

create_project_if_needed() {
  if project_exists; then
    echo "Firebase project exists: ${PROJECT_ID}"
    return
  fi

  echo "Creating Firebase project: ${PROJECT_ID}"
  if ! npx firebase-tools projects:create "$PROJECT_ID" --display-name "$DISPLAY_NAME" 2>&1; then
    if project_exists; then
      echo "Firebase project already exists: ${PROJECT_ID}"
      return
    fi
    exit 1
  fi
}

android_app_id() {
  npx firebase-tools apps:list ANDROID --project "$PROJECT_ID" --json 2>/dev/null \
    | node -e "
      const input = require('fs').readFileSync(0, 'utf8');
      const pkg = process.argv[1];
      const data = JSON.parse(input);
      const match = (data.result || []).find((app) => app.packageName === pkg);
      if (match?.appId) process.stdout.write(match.appId);
    " "$PACKAGE"
}

create_android_app_if_needed() {
  local app_id
  app_id="$(android_app_id)"
  if [[ -n "$app_id" ]]; then
    echo "Android app already registered: ${PACKAGE} (${app_id})" >&2
    echo "$app_id"
    return
  fi

  echo "Registering Android app: ${PACKAGE}" >&2
  local create_output
  create_output="$(npx firebase-tools apps:create ANDROID "$APP_LABEL" \
    --package-name "$PACKAGE" \
    --project "$PROJECT_ID" 2>&1)"

  echo "$create_output" >&2
  app_id="$(echo "$create_output" | sed -n 's/.*App ID: //p' | head -1)"

  if [[ -z "$app_id" ]]; then
    app_id="$(android_app_id)"
  fi

  if [[ -z "$app_id" ]]; then
    echo "Error: could not determine Firebase app ID after registration." >&2
    exit 1
  fi

  echo "$app_id"
}

download_google_services() {
  local app_id="$1"
  echo "Downloading google-services.json..."
  rm -f "$GOOGLE_SERVICES" "$ROOT/android/app/google-services.json"
  npx firebase-tools apps:sdkconfig ANDROID "$app_id" \
    --project "$PROJECT_ID" \
    --out "$GOOGLE_SERVICES"
  cp "$GOOGLE_SERVICES" "$ROOT/android/app/google-services.json"

  if ! grep -q "\"package_name\": \"${PACKAGE}\"" "$GOOGLE_SERVICES"; then
    echo "Error: google-services.json package mismatch"
    exit 1
  fi

  echo "Saved: ${GOOGLE_SERVICES}"
}

enable_cloud_messaging_hint() {
  echo ""
  echo "Enable Cloud Messaging API if needed:"
  echo "  https://console.cloud.google.com/apis/library/fcm.googleapis.com?project=${PROJECT_ID}"
}

main() {
  echo "=== Rasoi Firebase setup ==="
  require_firebase_login
  create_project_if_needed
  local app_id
  app_id="$(create_android_app_if_needed)"
  download_google_services "$app_id"
  enable_cloud_messaging_hint
  echo ""
  echo "Next:"
  echo "  1. npm run setup:fcm          # upload FCM v1 key to Expo"
  echo "  2. npm run android:release-apk"
}

main "$@"
