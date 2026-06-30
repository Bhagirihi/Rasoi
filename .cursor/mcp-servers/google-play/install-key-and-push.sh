#!/usr/bin/env bash
# After you click "Generate new private key" in Firebase, this script picks up the
# download and pushes the Play store listing (en-US + hi-IN).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
DEST="$ROOT/credentials/service_account.json"
DOWNLOADS="${HOME}/Downloads"
MANIFEST="$ROOT/../../rasoi_mobile/store/play-console/manifest.json"
TIMEOUT_SEC="${1:-300}"

echo "=== Rasoi Play: install service account key + push listing ==="
echo ""
echo "1. In the Firebase tab that opened, click:"
echo "   Project settings → Service accounts → Generate new private key"
echo ""
echo "2. Waiting up to ${TIMEOUT_SEC}s for rasoi-app-prod*.json in Downloads..."
echo "   Destination: $DEST"
echo ""

mkdir -p "$ROOT/credentials"
START=$(date +%s)

while true; do
  NOW=$(date +%s)
  if (( NOW - START > TIMEOUT_SEC )); then
    echo "Timed out. Download the key manually, then run:"
    echo "  cp ~/Downloads/rasoi-app-prod-*.json \"$DEST\""
    echo "  $ROOT/.venv/bin/python -c \"from play_client import push_store_listing; import json; print(json.dumps(push_store_listing(language='all'), indent=2))\""
    exit 1
  fi

  # Newest Firebase admin SDK key for rasoi-app-prod
  KEY_FILE=$(find "$DOWNLOADS" -maxdepth 1 -name 'rasoi-app-prod-*.json' -type f 2>/dev/null | xargs ls -t 2>/dev/null | head -1 || true)

  if [[ -n "${KEY_FILE:-}" ]]; then
    # Only use files modified in the last 10 minutes
    if [[ "$(uname)" == "Darwin" ]]; then
      AGE=$(( NOW - $(stat -f %m "$KEY_FILE") ))
    else
      AGE=$(( NOW - $(stat -c %Y "$KEY_FILE") ))
    fi
    if (( AGE <= 600 )); then
      cp "$KEY_FILE" "$DEST"
      chmod 600 "$DEST"
      echo "Installed: $KEY_FILE → $DEST"
      break
    fi
  fi

  sleep 2
done

echo ""
echo "Pushing store listing from manifest (8,000+ recipes, en-US + hi-IN)..."
cd "$ROOT"
RESULT=$("$ROOT/.venv/bin/python" -c "
from play_client import push_store_listing, auth_status
import json
print(json.dumps({'auth': auth_status(), 'push': push_store_listing(language='all')}, indent=2, ensure_ascii=False))
")

echo "$RESULT"

if echo "$RESULT" | grep -q '"error"'; then
  echo ""
  echo "Push failed — check Manage store presence permission in Play Console."
  exit 1
fi

echo ""
echo "Done. Verify: https://play.google.com/store/apps/details?id=com.bhagihiri.rasoiapp"
