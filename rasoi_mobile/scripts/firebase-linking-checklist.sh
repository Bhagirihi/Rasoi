#!/usr/bin/env bash
# Print Firebase ↔ AdMob ↔ Play linking checklist and validate local IDs.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PACKAGE="com.bhagihiri.rasoiapp"
FIREBASE_PROJECT="rasoi-app-prod"
FIREBASE_APP_ID="1:304365765846:android:85492c6a6786f4cec27577"
ADMOB_APP_ID="ca-app-pub-4173581536398147~9898362276"

ok() { echo "  ✓ $1"; }
warn() { echo "  ⚠ $1"; }
fail() { echo "  ✗ $1"; }

echo "=== Rasoi Firebase linking checklist ==="
echo ""
echo "Firebase: https://console.firebase.google.com/u/0/project/${FIREBASE_PROJECT}/overview"
echo "Account:  devsp1901@gmail.com (primary)"
echo ""

echo "Local config"
if [[ -f "$ROOT/google-services.json" ]] || [[ -f "$ROOT/config/google-services.json" ]]; then
  ok "google-services.json present"
  GS="$ROOT/google-services.json"
  [[ -f "$GS" ]] || GS="$ROOT/config/google-services.json"
  if grep -q "\"package_name\": \"${PACKAGE}\"" "$GS"; then
    ok "Package in google-services.json: ${PACKAGE}"
  else
    fail "Package mismatch in google-services.json"
  fi
  if grep -q "\"project_id\": \"${FIREBASE_PROJECT}\"" "$GS"; then
    ok "Firebase project: ${FIREBASE_PROJECT}"
  else
    warn "project_id in JSON may differ from ${FIREBASE_PROJECT}"
  fi
else
  fail "google-services.json missing — run npm run setup:firebase"
fi

if grep -q "$ADMOB_APP_ID" "$ROOT/constants/admobAppIds.js" 2>/dev/null; then
  ok "AdMob app ID in codebase: ${ADMOB_APP_ID}"
else
  warn "AdMob app ID not found in admobAppIds.js"
fi

if grep -q "$ADMOB_APP_ID" "$ROOT/android/app/src/main/AndroidManifest.xml" 2>/dev/null; then
  ok "AdMob APPLICATION_ID in AndroidManifest"
else
  warn "AdMob meta-data missing from AndroidManifest (run expo prebuild)"
fi

if grep -q "@react-native-firebase/analytics" "$ROOT/package.json"; then
  ok "Firebase Analytics SDK in package.json"
else
  warn "Firebase Analytics not installed"
fi

echo ""
echo "Console steps (manual — sign in as devsp1901@gmail.com or account with both access)"
echo ""
echo "1. Google Analytics"
echo "   https://console.firebase.google.com/u/0/project/${FIREBASE_PROJECT}/settings/integrations"
echo "   → Link Google Analytics to rasoi-app-prod"
echo ""
echo "2. AdMob ↔ Firebase (in AdMob console)"
echo "   https://admob.google.com/"
echo "   → Apps → Rasoi Android → Enable User metrics → Link to Firebase"
echo "   → Project: ${FIREBASE_PROJECT} · Package: ${PACKAGE}"
echo "   Note: AdMob publisher is on my.website.email2@gmail.com — invite devsp1901@gmail.com"
echo "         as AdMob Admin OR link while signed into an account with both permissions."
echo ""
echo "3. Google Play ↔ Firebase"
echo "   https://console.firebase.google.com/u/0/project/${FIREBASE_PROJECT}/settings/integrations"
echo "   → Google Play → Link → Bhagihiri Applications → ${PACKAGE}"
echo "   Then add Play App Signing SHA-1 to Firebase app settings."
echo ""
echo "Full guide: docs/FIREBASE_INTEGRATIONS.md"
