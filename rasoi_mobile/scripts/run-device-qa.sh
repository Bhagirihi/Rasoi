#!/usr/bin/env bash
# Run Maestro UI tests on a connected Android device.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${JAVA_HOME:-}" || ! -d "${JAVA_HOME}/bin" ]]; then
  if [[ -d "/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home" ]]; then
    export JAVA_HOME="/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
  elif command -v /usr/libexec/java_home >/dev/null 2>&1; then
    export JAVA_HOME="$(/usr/libexec/java_home 2>/dev/null || true)"
  fi
fi

SUITE="${1:-smoke}"
MAESTRO_BIN="${MAESTRO_BIN:-maestro}"
APP_ID="${RASOI_APP_ID:-com.bhagihiri.rasoiapp}"
EVIDENCE_DIR="${ROOT}/.qa/maestro-$(date +%Y%m%d-%H%M%S)"

bash scripts/qa-preflight.sh

mkdir -p "$EVIDENCE_DIR"

run_flow() {
  local flow="$1"
  local name
  name="$(basename "$flow" .yaml)"
  echo ""
  echo "▶ Running $name …"
  "$MAESTRO_BIN" test \
    --format junit \
    --output "${EVIDENCE_DIR}/${name}.xml" \
    "$flow"
  ok "$name"
}

ok() {
  echo "✓ $1"
}

case "$SUITE" in
  smoke)
    run_flow e2e/maestro/01-guest-smoke.yaml
    ;;
  recipe)
    run_flow e2e/maestro/02-recipe-detail.yaml
    ;;
  theme)
    run_flow e2e/maestro/03-settings-theme.yaml
    ;;
  all)
    run_flow e2e/maestro/01-guest-smoke.yaml
    run_flow e2e/maestro/02-recipe-detail.yaml
    run_flow e2e/maestro/03-settings-theme.yaml
    ;;
  *)
    echo "Usage: $0 [smoke|recipe|theme|all]" >&2
    exit 1
    ;;
esac

echo ""
echo "Evidence: $EVIDENCE_DIR"
echo "App ID: $APP_ID"
ok "Device QA suite '$SUITE' finished"
