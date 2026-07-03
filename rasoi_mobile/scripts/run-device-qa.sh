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
    ${QA_NAME:+-e "QA_NAME=${QA_NAME}"} \
    ${QA_PHONE:+-e "QA_PHONE=${QA_PHONE}"} \
    ${QA_EMAIL:+-e "QA_EMAIL=${QA_EMAIL}"} \
    ${QA_OTP:+-e "QA_OTP=${QA_OTP}"} \
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
  auth)
    unset QA_OTP
    export QA_NAME="${QA_NAME:-QA Tester}"
    export QA_PHONE="${QA_PHONE:-9820174653}"
    export QA_EMAIL="${QA_EMAIL:-dvesp1901+$(date +%s)@gmail.com}"
    run_flow e2e/maestro/01-register-send-otp.yaml
    unset QA_OTP
    echo "Waiting for register OTP…"
    for i in $(seq 1 40); do
      if QA_OTP="$(python3 scripts/fetch-otp.py 2>/dev/null)"; then
        export QA_OTP
        break
      fi
      sleep 3
    done
    [[ -n "${QA_OTP:-}" ]] || { echo "❌ Register OTP not received"; exit 1; }
    run_flow e2e/maestro/02-register-verify.yaml
    run_flow e2e/maestro/09-logout.yaml
    run_flow e2e/maestro/10-login-send-otp.yaml
    unset QA_OTP
    echo "Waiting for login OTP…"
    for i in $(seq 1 40); do
      if QA_OTP="$(python3 scripts/fetch-otp.py 2>/dev/null)"; then
        export QA_OTP
        break
      fi
      sleep 3
    done
    [[ -n "${QA_OTP:-}" ]] || { echo "❌ Login OTP not received"; exit 1; }
    run_flow e2e/maestro/11-login-verify.yaml
    ;;
  modules)
    run_flow e2e/maestro/03-home.yaml
    run_flow e2e/maestro/04-recipes-tab.yaml
    run_flow e2e/maestro/05-recipe-detail.yaml
    run_flow e2e/maestro/06-saved-tab.yaml
    run_flow e2e/maestro/07-pantry-tab.yaml
    run_flow e2e/maestro/08-settings.yaml
    ;;
  all)
    run_flow e2e/maestro/01-guest-smoke.yaml
    run_flow e2e/maestro/03-home.yaml
    run_flow e2e/maestro/04-recipes-tab.yaml
    run_flow e2e/maestro/05-recipe-detail.yaml
    run_flow e2e/maestro/08-settings.yaml
    ;;
  full)
    bash scripts/run-full-device-qa.sh
    exit 0
    ;;
  *)
    echo "Usage: $0 [smoke|auth|modules|all|full]" >&2
    exit 1
    ;;
esac

echo ""
echo "Evidence: $EVIDENCE_DIR"
echo "App ID: $APP_ID"
ok "Device QA suite '$SUITE' finished"
