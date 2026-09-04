#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SUITE="${1:-smoke}"
MAESTRO_BIN="${MAESTRO_BIN:-maestro}"
EVIDENCE_DIR="${ROOT}/.qa/maestro-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$EVIDENCE_DIR"

SMOKE_FLOWS=(e2e/maestro/01-auth-validation.yaml)
AUTH_FLOWS=(e2e/maestro/02-authenticated-regression.yaml)
MODULE_FLOWS=(
  e2e/maestro/02-authenticated-regression.yaml
  e2e/maestro/03-resilience-and-crash.yaml
)

run_flow() {
  local flow="$1"
  "$MAESTRO_BIN" test \
    --format NOOP \
    --flatten-debug-output \
    --debug-output "${EVIDENCE_DIR}/debug" \
    "$flow"
}

case "$SUITE" in
  smoke)
    FLOWS=("${SMOKE_FLOWS[@]}")
    ;;
  auth)
    FLOWS=("${AUTH_FLOWS[@]}")
    ;;
  modules)
    FLOWS=("${MODULE_FLOWS[@]}")
    ;;
  all)
    FLOWS=("${SMOKE_FLOWS[@]}" "${MODULE_FLOWS[@]}")
    ;;
  *)
    echo "Usage: $0 [smoke|auth|modules|all]" >&2
    exit 1
    ;;
esac

FAIL=0
for flow in "${FLOWS[@]}"; do
  echo "Running $(basename "$flow")"
  run_flow "$flow" || FAIL=$((FAIL + 1))
done

echo "Evidence: $EVIDENCE_DIR"
if [[ "$FAIL" -gt 0 ]]; then
  echo "Rasoi device QA finished with $FAIL failure(s)" >&2
  exit 1
fi
