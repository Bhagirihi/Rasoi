#!/usr/bin/env bash
# Capture Android screenshot + UI hierarchy for QA evidence.
set -euo pipefail

LABEL="${1:-snapshot}"
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
OUT="$ROOT/rasoi_mobile/.qa"
TS="$(date +%Y%m%d-%H%M%S)"
BASE="${OUT}/${TS}-${LABEL}"

mkdir -p "$OUT"

if ! command -v adb >/dev/null 2>&1; then
  echo "adb not found on PATH" >&2
  exit 1
fi

DEVICE_COUNT="$(adb devices | awk 'NR>1 && $2=="device" {print $1}' | wc -l | tr -d ' ')"
if [[ "$DEVICE_COUNT" == "0" ]]; then
  echo "No adb device connected" >&2
  exit 1
fi

adb exec-out screencap -p > "${BASE}.png"
adb shell uiautomator dump /sdcard/uidump.xml >/dev/null
adb pull /sdcard/uidump.xml "${BASE}.xml" >/dev/null

echo "saved ${BASE}.png"
echo "saved ${BASE}.xml"
