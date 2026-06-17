#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE="$ROOT/.env"
GOOGLE_SERVICES="$ROOT/google-services.json"
EAS_PROJECT_ID="01de1672-85ce-4ad7-83d7-7fc958fc5659"

write_env_project_id() {
  local id="$1"
  touch "$ENV_FILE"
  if grep -q '^EXPO_PUBLIC_EAS_PROJECT_ID=' "$ENV_FILE"; then
    if [[ "$(uname)" == "Darwin" ]]; then
      sed -i '' "s|^EXPO_PUBLIC_EAS_PROJECT_ID=.*|EXPO_PUBLIC_EAS_PROJECT_ID=${id}|" "$ENV_FILE"
    else
      sed -i "s|^EXPO_PUBLIC_EAS_PROJECT_ID=.*|EXPO_PUBLIC_EAS_PROJECT_ID=${id}|" "$ENV_FILE"
    fi
  else
    echo "EXPO_PUBLIC_EAS_PROJECT_ID=${id}" >> "$ENV_FILE"
  fi
}

read_project_id() {
  node -e "
    const fs = require('fs');
    const app = JSON.parse(fs.readFileSync('app.json', 'utf8'));
    const id = app?.expo?.extra?.eas?.projectId?.trim();
    process.stdout.write(id || '');
  "
}

echo "=== Rasoi push notification setup ==="
echo ""

if ! command -v npx >/dev/null 2>&1; then
  echo "Error: npx not found. Install Node.js first."
  exit 1
fi

if ! npx eas whoami >/dev/null 2>&1; then
  echo "Step 1: Log in to Expo"
  echo "  npx eas login"
  echo ""
  echo "Re-run: npm run setup:push"
  exit 1
fi

echo "Expo account: $(npx eas whoami 2>/dev/null | tail -1)"
echo ""

if [[ ! -f "$ROOT/eas.json" ]]; then
  echo "Error: eas.json missing in rasoi_mobile/"
  exit 1
fi

PROJECT_ID="$(read_project_id)"

echo "Step 2: Link EAS project..."
if [[ -n "$PROJECT_ID" ]]; then
  npx eas init --id "$PROJECT_ID" --non-interactive 2>&1 || true
else
  npx eas init --non-interactive 2>&1 || npx eas init 2>&1 || true
  PROJECT_ID="$(read_project_id)"
fi

if [[ -z "$PROJECT_ID" ]]; then
  PROJECT_ID="$EAS_PROJECT_ID"
  echo ""
  echo "Using linked project ID: ${PROJECT_ID}"
  echo "(Dynamic app.config.ts — ID is stored in app.json extra.eas.projectId)"
fi

echo ""
echo "Step 3: Write EXPO_PUBLIC_EAS_PROJECT_ID to .env"
write_env_project_id "$PROJECT_ID"
echo "  EXPO_PUBLIC_EAS_PROJECT_ID=${PROJECT_ID}"
echo ""

if [[ ! -f "$GOOGLE_SERVICES" ]]; then
  echo "Step 4: Add Firebase google-services.json (required for Android FCM)"
  echo "  1. https://console.firebase.google.com/ → Add/use project"
  echo "  2. Add Android app → package: com.rasoi.app"
  echo "  3. Download google-services.json → save as:"
  echo "     ${GOOGLE_SERVICES}"
  echo ""
  echo "  Template: google-services.json.example"
  echo ""
  echo "Step 5 (after google-services.json): Upload FCM v1 to Expo"
  echo "  npx eas credentials"
  echo "  → Android → production → Google Service Account → FCM V1"
  echo ""
  echo "Step 6: Rebuild release APK"
  echo "  npm run android:release-apk"
  exit 0
fi

echo "google-services.json: OK"
echo ""
echo "Step 4: Upload FCM v1 credentials (if not done yet)"
echo "  npm run setup:fcm"
echo ""
echo "Step 5: Rebuild release APK"
echo "  npm run android:release-apk"
echo ""
echo "Step 6: On device — install APK, log in, enable notifications, reopen app."
echo "  Admin → Users → verify push token → Send meal notification (Dinner)."
