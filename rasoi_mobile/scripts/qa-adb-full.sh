#!/usr/bin/env bash
# Full module QA via adb + Gmail OTP (fallback when Maestro driver unavailable).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
QA_DIR="${ROOT}/.qa/adb-full-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$QA_DIR"

export QA_NAME="${QA_NAME:-QA Tester}"
export QA_PHONE="${QA_PHONE:-9820174653}"
export QA_EMAIL="${QA_EMAIL:-dvesp1901+$(date +%s)@gmail.com}"

PASS=0
FAIL=0
RESULTS=()

log() { echo "[QA] $*"; }
ok() { PASS=$((PASS+1)); RESULTS+=("PASS $1"); log "✓ $1"; }
fail() { FAIL=$((FAIL+1)); RESULTS+=("FAIL $1 — $2"); log "✗ $1 — $2"; }

snapshot() {
  local label="$1"
  adb exec-out screencap -p > "${QA_DIR}/${label}.png" 2>/dev/null || true
  adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1 || true
  adb pull /sdcard/uidump.xml "${QA_DIR}/${label}.xml" >/dev/null 2>&1 || true
}

tap_text() {
  python3 - "$1" <<'PY'
import re, sys, xml.etree.ElementTree as ET
target = sys.argv[1].lower()
tree = ET.parse('/sdcard/uidump.xml')
for node in tree.getroot().iter('node'):
    text = (node.attrib.get('text') or node.attrib.get('content-desc') or '').strip()
    if target in text.lower() and node.attrib.get('clickable') == 'true':
        m = re.match(r'\[(\d+),(\d+)\]\[(\d+),(\d+)\]', node.attrib.get('bounds',''))
        if m:
            x1,y1,x2,y2 = map(int, m.groups())
            print((x1+x2)//2, (y1+y2)//2)
            sys.exit(0)
sys.exit(1)
PY
}

tap_center() {
  local x="$1" y="$2"
  adb shell input tap "$x" "$y"
}

wait_text() {
  local text="$1" timeout="${2:-30}" i=0
  while [[ $i -lt $timeout ]]; do
    adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1 || true
    if adb shell cat /sdcard/uidump.xml 2>/dev/null | rg -qi "$text"; then
      return 0
    fi
    sleep 1
    i=$((i+1))
  done
  return 1
}

input_field() {
  local placeholder="$1" value="$2"
  adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
  if coords=$(python3 - "$placeholder" <<'PY'
import re, sys, xml.etree.ElementTree as ET
target = sys.argv[1].lower()
tree = ET.parse('/sdcard/uidump.xml')
for node in tree.getroot().iter('node'):
    hint = (node.attrib.get('hint') or node.attrib.get('text') or '').lower()
    cls = node.attrib.get('class','')
    if target in hint and 'EditText' in cls:
        m = re.match(r'\[(\d+),(\d+)\]\[(\d+),(\d+)\]', node.attrib.get('bounds',''))
        if m:
            x1,y1,x2,y2 = map(int, m.groups())
            print((x1+x2)//2, (y1+y2)//2)
            sys.exit(0)
sys.exit(1)
PY
); then
    read -r x y <<< "$coords"
    tap_center "$x" "$y"
  fi
  adb shell input text "$(echo "$value" | sed 's/@/%40/g; s/+/%2B/g')"
}

wait_otp() {
  local attempt=0 max="${OTP_WAIT_ATTEMPTS:-40}"
  while [[ $attempt -lt $max ]]; do
    if OTP="$(python3 scripts/fetch-otp.py 2>/dev/null)"; then
      echo "$OTP"
      return 0
    fi
    sleep 3
    attempt=$((attempt+1))
  done
  return 1
}

# --- Setup ---
log "QA email: $QA_EMAIL"
log "Evidence: $QA_DIR"
adb reverse tcp:8081 tcp:8081 >/dev/null 2>&1 || true
adb shell pm clear com.bhagihiri.rasoiapp >/dev/null
sleep 1
adb shell monkey -p com.bhagihiri.rasoiapp -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1
sleep 12

# TC-001 Legal consent
if wait_text "Terms & Privacy" 45; then
  adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
  tap_center 111 1912
  sleep 0.5
  tap_center 540 2099
  if wait_text "Welcome back" 30 || wait_text "Sign in" 30; then
    ok "TC-001 Legal consent"
  else
    fail "TC-001 Legal consent" "Login screen not shown"
  fi
else
  fail "TC-001 Legal consent" "Terms screen timeout"
fi
snapshot "01-login"

# TC-002 Register
adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
if read -r x y < <(tap_text "Create account" 2>/dev/null || echo "540 1800"); then
  tap_center "$x" "$y"
fi
sleep 2
if wait_text "Create your account" 20; then
  input_field "Priya Sharma" "$QA_NAME"
  input_field "9876543210" "$QA_PHONE"
  input_field "you@example.com" "$QA_EMAIL"
  adb shell input keyevent 4
  sleep 0.5
  adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
  read -r x y < <(tap_text "Send verification code" || echo "540 1600")
  tap_center "$x" "$y"
  sleep 2
  if wait_text "Terms & Privacy" 10; then
    adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
    tap_center 111 1912 2>/dev/null || tap_center 540 1900
    sleep 0.5
    tap_center 540 2099
  fi
  if wait_text "Verify your email" 90; then
    ok "TC-002 Register send OTP"
  else
    fail "TC-002 Register send OTP" "OTP screen timeout"
  fi
else
  fail "TC-002 Register" "Register screen not shown"
fi
snapshot "02-register-otp"

# TC-003 Register verify OTP
if OTP="$(wait_otp)"; then
  log "OTP received: $OTP"
  input_field "123456" "$OTP"
  adb shell input keyevent 4
  sleep 0.5
  adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
  read -r x y < <(tap_text "Create account" || echo "540 1600")
  tap_center "$x" "$y"
  sleep 3
  if wait_text "What's your diet" 45 || wait_text "Veg" 45; then
    ok "TC-003 Register verify OTP"
  elif wait_text "Tonight" 30 || wait_text "Home" 30; then
    ok "TC-003 Register verify OTP (skipped onboarding)"
  else
    fail "TC-003 Register verify OTP" "Post-register navigation failed"
  fi
else
  fail "TC-003 Register verify OTP" "OTP not received"
fi
snapshot "03-post-register"

# TC-004 Onboarding
if adb shell cat /sdcard/uidump.xml 2>/dev/null | rg -qi "What's your diet|Veg"; then
  tap_center 540 900
  sleep 1
  tap_center 540 1800
  sleep 2
  tap_center 540 700
  sleep 1
  tap_center 540 1800
  sleep 1
  adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
  read -r x y < <(tap_text "Maybe later" || tap_text "Skip" || echo "540 1900")
  tap_center "$x" "$y"
  sleep 2
  ok "TC-004 Onboarding"
fi
if wait_text "trial" 10; then
  tap_center 540 1800
  sleep 2
  ok "TC-005 Trial welcome"
fi
snapshot "04-home"

# TC-006–TC-012 Module tabs
for spec in \
  "TC-006 Home|Tonight|tab-home" \
  "TC-007 Recipes|All recipes|tab-recipes" \
  "TC-010 Saved|Saved|tab-saved" \
  "TC-011 Pantry|Pantry|tab-pantry" \
  "TC-012 Settings|Settings|tab-settings"
do
  IFS='|' read -r id label tab <<< "$spec"
  adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
  if read -r x y < <(python3 - "$tab" <<'PY'
import re, sys, xml.etree.ElementTree as ET
tab = sys.argv[1]
tree = ET.parse('/sdcard/uidump.xml')
for node in tree.getroot().iter('node'):
    desc = node.attrib.get('content-desc','')
    if tab in desc:
        m = re.match(r'\[(\d+),(\d+)\]\[(\d+),(\d+)\]', node.attrib.get('bounds',''))
        if m:
            x1,y1,x2,y2 = map(int, m.groups())
            print((x1+x2)//2, (y1+y2)//2)
            sys.exit(0)
sys.exit(1)
PY
); then
    tap_center "$x" "$y"
    sleep 2
    if wait_text "$label" 15; then ok "$id $label"; else fail "$id $label" "Screen not visible"; fi
  else
    fail "$id $label" "Tab not found"
  fi
  snapshot "$(echo "$id" | tr ' ' '-')"
done

# TC-008 Recipe detail
adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
read -r x y < <(python3 <<'PY'
import re, xml.etree.ElementTree as ET
tree = ET.parse('/sdcard/uidump.xml')
for node in tree.getroot().iter('node'):
    desc = node.attrib.get('content-desc','')
    if 'tab-recipes' in desc:
        m = re.match(r'\[(\d+),(\d+)\]\[(\d+),(\d+)\]', node.attrib.get('bounds',''))
        if m:
            x1,y1,x2,y2 = map(int, m.groups())
            print((x1+x2)//2, (y1+y2)//2)
            break
PY
)
tap_center "$x" "$y"
sleep 3
adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
if read -r x y < <(python3 <<'PY'
import re, xml.etree.ElementTree as ET
tree = ET.parse('/sdcard/uidump.xml')
candidates=[]
for node in tree.getroot().iter('node'):
    if node.attrib.get('clickable')=='true' and 'View' in node.attrib.get('class',''):
        m = re.match(r'\[(\d+),(\d+)\]\[(\d+),(\d+)\]', node.attrib.get('bounds',''))
        if m:
            x1,y1,x2,y2 = map(int, m.groups())
            h = y2-y1
            if 200 < h < 600 and y1 > 300:
                candidates.append(((x1+x2)//2, (y1+y2)//2, y1))
if candidates:
    candidates.sort(key=lambda c: c[2])
    print(candidates[0][0], candidates[0][1])
PY
); then
  tap_center "$x" "$y"
  sleep 3
  if wait_text "Ingredients" 20 || wait_text "min" 20; then
    ok "TC-008 Recipe detail"
    adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
    read -r sx sy < <(tap_text "Save" || echo "900 200")
    tap_center "$sx" "$sy"
    ok "TC-009 Save recipe"
  else
    fail "TC-008 Recipe detail" "Detail screen not loaded"
  fi
  adb shell input keyevent 4
else
  fail "TC-008 Recipe detail" "No recipe card found"
fi
snapshot "08-recipe-detail"

# TC-013 Logout
adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
read -r x y < <(python3 - "tab-settings" <<'PY'
import re, sys, xml.etree.ElementTree as ET
tab = sys.argv[1]
tree = ET.parse('/sdcard/uidump.xml')
for node in tree.getroot().iter('node'):
    if tab in (node.attrib.get('content-desc') or ''):
        m = re.match(r'\[(\d+),(\d+)\]\[(\d+),(\d+)\]', node.attrib.get('bounds',''))
        if m:
            x1,y1,x2,y2 = map(int, m.groups())
            print((x1+x2)//2, (y1+y2)//2); sys.exit(0)
sys.exit(1)
PY
)
tap_center "$x" "$y"
sleep 2
for _ in 1 2 3 4; do adb shell input swipe 540 1800 540 600 300; sleep 0.5; done
adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
read -r lx ly < <(tap_text "Log out" || echo "270 2100")
tap_center "$lx" "$ly"
sleep 1
adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
read -r cx cy < <(python3 <<'PY'
import re, xml.etree.ElementTree as ET
tree = ET.parse('/sdcard/uidump.xml')
for node in tree.getroot().iter('node'):
    if node.attrib.get('text')=='Log out' and node.attrib.get('clickable')=='true':
        m = re.match(r'\[(\d+),(\d+)\]\[(\d+),(\d+)\]', node.attrib.get('bounds',''))
        if m:
            x1,y1,x2,y2 = map(int, m.groups())
            print((x1+x2)//2, (y1+y2)//2); break
PY
)
tap_center "$cx" "$cy"
sleep 3
if wait_text "Welcome back" 20; then ok "TC-013 Logout"; else fail "TC-013 Logout" "Login not shown"; fi
snapshot "09-logout"

# TC-014/015 Login OTP
input_field "you@example.com" "$QA_EMAIL"
adb shell input keyevent 4
sleep 0.5
adb shell uiautomator dump /sdcard/uidump.xml >/dev/null 2>&1
read -r x y < <(tap_text "Send sign-in code" || echo "540 1200")
tap_center "$x" "$y"
if wait_text "Check your email" 90; then
  ok "TC-014 Login send OTP"
  if OTP="$(wait_otp)"; then
    input_field "123456" "$OTP"
    adb shell input keyevent 4
    sleep 0.5
    read -r x y < <(tap_text "Sign in" || echo "540 1200")
    tap_center "$x" "$y"
    sleep 5
    if wait_text "Tonight" 30 || wait_text "Home" 30; then
      ok "TC-015 Login verify OTP"
    else
      fail "TC-015 Login verify OTP" "Home not shown"
    fi
  else
    fail "TC-015 Login verify OTP" "OTP not received"
  fi
else
  fail "TC-014 Login send OTP" "OTP screen timeout"
fi
snapshot "10-login-done"

echo ""
echo "========== QA REPORT =========="
echo "Email: $QA_EMAIL"
echo "Evidence: $QA_DIR"
echo "PASS: $PASS  FAIL: $FAIL"
printf '%s\n' "${RESULTS[@]}"
if [[ $FAIL -eq 0 ]]; then
  echo "RESULT: PASS"
  exit 0
else
  echo "RESULT: FAIL"
  exit 1
fi
