#!/usr/bin/env bash
# Bootstrap Bhagihiri Applications → Rasoi APP on Google Play.
# Steps 1–2 are manual (Google requires browser + $25). Steps 3–4 use MCP or this script.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MCP_DIR="$ROOT/.cursor/mcp-servers/google-play"
MANIFEST="$ROOT/rasoi_mobile/store/play-console/manifest.json"

echo "=== Rasoi Play Console bootstrap ==="
echo "Developer: Bhagihiri Applications"
echo "App: Rasoi APP"
echo "Package: com.bhagihiri.rasoiapp"
echo ""

if [[ ! -f "$MANIFEST" ]]; then
  echo "Missing manifest: $MANIFEST"
  exit 1
fi

echo "── Step 1: Developer account (manual) ──"
echo "  1. Open https://play.google.com/console/signup"
echo "  2. Register as: Bhagihiri Applications"
echo "  3. Pay \$25 one-time fee + complete verification"
echo ""

echo "── Step 2: Create app (manual) ──"
echo "  1. Play Console → Create app"
echo "  2. App name: Rasoi APP"
echo "  3. Package: com.bhagihiri.rasoiapp (must match app.json)"
echo "  4. Type: App · Category: Food & Drink · Free"
echo "  5. Declarations: Ads YES · IAP YES · Play App Signing YES"
echo ""

echo "── Step 3: Build AAB ──"
echo "  cd rasoi_mobile && eas build -p android --profile production"
echo ""

echo "── Step 4: API credentials ──"
if [[ ! -f "$MCP_DIR/credentials/service_account.json" ]]; then
  echo "  ⚠️  Missing $MCP_DIR/credentials/service_account.json"
  echo "  Create service account in Google Cloud → invite in Play Console → Users & permissions"
else
  echo "  ✓ Service account found"
fi

if [[ ! -f "$MCP_DIR/.env" ]]; then
  echo "  Copy: cp $MCP_DIR/.env.example $MCP_DIR/.env"
else
  echo "  ✓ .env found"
fi
echo ""

echo "── Step 5: Automated setup (after steps 1–4) ──"
echo "  In Cursor MCP, run: play_full_setup"
echo "  Or: cd $MCP_DIR && .venv/bin/python -c \"from play_client import full_rasoi_setup; import json; print(json.dumps(full_rasoi_setup(), indent=2))\""
echo ""

echo "── Store listing copy (from manifest) ──"
if command -v jq >/dev/null 2>&1; then
  jq -r '.storeListing | "Title: \(.title)\nShort: \(.shortDescription)\nEmail: \(.email)\nPrivacy: \(.privacyPolicyUrl)"' "$MANIFEST"
else
  echo "  Install jq to preview listing fields, or open $MANIFEST"
fi
