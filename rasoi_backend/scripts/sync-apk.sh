#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$ROOT/../rasoi_mobile/dist/rasoi-release.apk}"
DEST="$ROOT/public/rasoi-release.apk"

if [[ ! -f "$SRC" ]]; then
  echo "APK not found: $SRC"
  echo "Build first: cd rasoi_mobile && npm run android:release-apk"
  exit 1
fi

cp "$SRC" "$DEST"
echo "Synced → public/rasoi-release.apk ($(du -h "$DEST" | cut -f1))"
