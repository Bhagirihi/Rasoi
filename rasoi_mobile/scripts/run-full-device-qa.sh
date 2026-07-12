#!/usr/bin/env bash
# Full module QA: register (Gmail OTP) → all tabs → logout → login (Gmail OTP).
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

MAESTRO_BIN="${MAESTRO_BIN:-maestro}"
EVIDENCE_DIR="${ROOT}/.qa/full-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$EVIDENCE_DIR"

export QA_NAME="${QA_NAME:-QA Tester}"
export QA_PHONE="${QA_PHONE:-9374766500}"
export QA_EMAIL="${QA_EMAIL:-dvesp1901+$(date +%s)@gmail.com}"

bash scripts/qa-preflight.sh

run_flow() {
  local flow="$1"
  local name
  name="$(basename "$flow" .yaml)"
  echo ""
  echo "▶ Running $name …"
  if ! "$MAESTRO_BIN" test \
    --format junit \
    --output "${EVIDENCE_DIR}/${name}.xml" \
    -e "QA_NAME=${QA_NAME}" \
    -e "QA_PHONE=${QA_PHONE}" \
    -e "QA_EMAIL=${QA_EMAIL}" \
    ${QA_OTP:+-e "QA_OTP=${QA_OTP}"} \
    "$flow"; then
    echo "❌ $name FAILED" >&2
    exit 1
  fi
  echo "✓ $name"
}

run_flows() {
  local label="$1"
  shift
  echo ""
  echo "▶ Running $label …"
  if ! "$MAESTRO_BIN" test \
    --format junit \
    --output "${EVIDENCE_DIR}/${label}.xml" \
    -e "QA_NAME=${QA_NAME}" \
    -e "QA_PHONE=${QA_PHONE}" \
    -e "QA_EMAIL=${QA_EMAIL}" \
    ${QA_OTP:+-e "QA_OTP=${QA_OTP}"} \
    "$@"; then
    echo "❌ $label FAILED" >&2
    exit 1
  fi
  echo "✓ $label"
}

wait_for_otp() {
  local attempt=0
  local max="${OTP_WAIT_ATTEMPTS:-40}"
  echo "Waiting for OTP email (up to ${max} attempts)…"
  while [[ "$attempt" -lt "$max" ]]; do
    if OTP="$(QA_OTP_KNOWN_OLD="${QA_OTP_KNOWN_OLD:-}" python3 scripts/fetch-otp.py 2>/dev/null)"; then
      export QA_OTP="$OTP"
      echo "✓ OTP received: ${QA_OTP}"
      return 0
    fi
    attempt=$((attempt + 1))
    sleep 3
  done
  echo "❌ OTP not received after ${max} attempts" >&2
  return 1
}

echo "QA email: ${QA_EMAIL}"
echo "Evidence: ${EVIDENCE_DIR}"

# Ignore OTPs already in inbox so we wait for the code from this run.
export QA_OTP_KNOWN_OLD="$(python3 scripts/fetch-otp.py 2>/dev/null || true)"

# Phase 1: Register — send OTP
run_flow e2e/maestro/01-register-send-otp.yaml
wait_for_otp

# Phase 2: Register — verify OTP + onboarding → home
run_flow e2e/maestro/02-register-verify.yaml

# Phase 3–4: All modules + logout (single Maestro session)
run_flows modules-and-logout \
  e2e/maestro/03-home.yaml \
  e2e/maestro/04-recipes-tab.yaml \
  e2e/maestro/05-recipe-detail.yaml \
  e2e/maestro/06-saved-tab.yaml \
  e2e/maestro/07-pantry-tab.yaml \
  e2e/maestro/08-settings.yaml \
  e2e/maestro/09-logout.yaml

# Phase 5: Login — send OTP
unset QA_OTP
export QA_OTP_KNOWN_OLD="$(python3 scripts/fetch-otp.py 2>/dev/null || true)"
run_flow e2e/maestro/10-login-send-otp.yaml
wait_for_otp

# Phase 6: Login — verify OTP (same session as 10)
run_flow e2e/maestro/11-login-verify-session.yaml

echo ""
echo "✓ Full module QA finished"
echo "  Email tested: ${QA_EMAIL}"
echo "  Evidence: ${EVIDENCE_DIR}"
