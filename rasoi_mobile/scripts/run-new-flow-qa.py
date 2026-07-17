#!/usr/bin/env python3
"""QA the four new auth launch flows on a connected Android device."""
from __future__ import annotations

import importlib.util
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QA_DIR = ROOT / ".qa" / f"new-flow-qa-{datetime.now().strftime('%Y%m%d-%H%M%S')}"


def load_stability():
    path = ROOT / "scripts" / "run-stability-3x.py"
    spec = importlib.util.spec_from_file_location("stability_qa", path)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    sys.modules["stability_qa"] = mod
    spec.loader.exec_module(mod)
    mod.QA_DIR = QA_DIR
    return mod


def snapshot(s, label: str) -> None:
    QA_DIR.mkdir(parents=True, exist_ok=True)
    try:
        text = s.ui_text()
        (QA_DIR / f"{label}.txt").write_text(text)
    except Exception as exc:
        (QA_DIR / f"{label}.txt").write_text(f"dump failed: {exc}")


def screen_state(s) -> dict[str, bool]:
    text = s.ui_text()
    return {
        "login": bool(re.search(r"Welcome back|screen-login", text, re.I)),
        "register": bool(re.search(r"Create your account|screen-register", text, re.I)),
        "otp_register": bool(re.search(r"Verify your email", text, re.I)),
        "otp_login": bool(re.search(r"Check your email", text, re.I)),
        "legal": bool(re.search(r"Terms & Privacy|screen-legal-consent", text, re.I)),
        "onboarding": bool(re.search(r"screen-onboarding|dietary preference|What is your dietary", text, re.I)),
        "notifications": bool(re.search(r"notification|Maybe later|onboarding-skip-notify", text, re.I)),
        "location": bool(re.search(r"location|onboarding-skip-location", text, re.I)),
        "pantry": bool(re.search(r"screen-pantry|pantry-setup", text, re.I)),
        "trial": bool(re.search(r"trial|Rasoi Plus", text, re.I)),
        "home": bool(re.search(r"screen-home|Good Morning|Good Afternoon|Good Evening", text, re.I)),
    }


def wait_state(s, key: str, timeout: int = 30) -> bool:
    patterns = {
        "login": r"Welcome back|screen-login",
        "register": r"Create your account|screen-register",
        "otp_register": r"Verify your email",
        "otp_login": r"Check your email",
        "legal": r"Terms & Privacy|screen-legal-consent",
        "onboarding": r"screen-onboarding|dietary preference|What is your dietary",
        "notifications": r"notification|Maybe later|Turn on",
        "location": r"location|Where are you",
        "pantry": r"screen-pantry|What's at home|pantry-setup",
        "trial": r"trial|Start your",
        "home": r"screen-home|Good Morning|Good Afternoon|Good Evening|Good Night",
    }
    return s.wait_for(patterns[key], timeout)


def accept_legal(s) -> bool:
    if not wait_state(s, "legal", 20):
        return False
    s.tap_test_id("legal-consent-checkbox") or s.tap_text_contains("I have read and agree")
    time.sleep(0.5)
    s.tap_test_id("legal-consent-continue") or s.tap_text_contains("Continue")
    time.sleep(2)
    return True


def complete_onboarding(s) -> list[str]:
    """Returns ordered screens visited."""
    visited: list[str] = []
    s.dismiss_system_dialogs()

    if wait_state(s, "onboarding", 25):
        visited.append("veg/non-veg + cuisine")
        s.tap_test_id("onboarding-diet-veg") or s.tap_text_contains("PLANT-BASED")
        time.sleep(1)
        for _ in range(8):
            if s.tap_test_id("onboarding-cuisine-first") or s.tap_text_contains("Gujarati"):
                break
            s.adb("shell", "input", "swipe", "540", "1800", "540", "600", "300", check=False)
            time.sleep(0.4)
        time.sleep(0.5)
        for _ in range(12):
            root = s.dump_ui()
            for node in root.iter("node"):
                if "onboarding-diet-continue" in node.attrib.get("resource-id", ""):
                    if node.attrib.get("enabled", "true") == "true":
                        c = s.center_of(node)
                        if c:
                            s.tap_xy(*c)
                            break
            else:
                time.sleep(0.5)
                continue
            break
        time.sleep(2)

    if wait_state(s, "notifications", 15):
        visited.append("notification")
        s.tap_test_id("onboarding-skip-notify") or s.tap_text_contains("Maybe later") or s.tap_text_contains("Skip")
        time.sleep(2)

    if wait_state(s, "location", 15):
        visited.append("location")
        s.tap_test_id("onboarding-skip-location") or s.tap_text_contains("Maybe later") or s.tap_text_contains("Skip")
        time.sleep(2)

    s.dismiss_system_dialogs()
    return visited


def skip_pantry_and_trial(s) -> None:
    if wait_state(s, "trial", 8):
        s.tap_test_id("trial-continue") or s.tap_text_contains("Continue")
        time.sleep(2)
    if wait_state(s, "pantry", 15):
        s.tap_test_id("pantry-setup-skip") or s.tap_text_contains("Skip")
        time.sleep(2)


def main() -> int:
    s = load_stability()
    s.QA_DIR = QA_DIR
    QA_DIR.mkdir(parents=True, exist_ok=True)

    device = s.ensure_device()
    s.setup()
    email = os.environ.get("QA_EMAIL", f"dvesp1901+flow{int(time.time())}@gmail.com")
    known_old = os.environ.get("QA_OTP_KNOWN_OLD", "00797644")

    report: dict = {
        "device": device,
        "email": email,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "paths": {},
    }

    print(f"New Flow QA — device {device}")
    print(f"Evidence: {QA_DIR}\n")

    # --- Path 4 precursor: cold launch should hit Login (new flow) ---
    print("=== Cold launch check ===")
    s.clear_app()
    s.launch_app()
    time.sleep(6)
    s.dismiss_system_dialogs()
    state = screen_state(s)
    snapshot(s, "cold-launch")
    cold_login = state["login"]
    report["cold_launch"] = {
        "login_first": cold_login,
        "state": state,
    }
    print(f"  Login first: {cold_login}")

    # --- Path 3: Login screen (guest entry removed) ---
    print("\n=== Path 3: Login (no guest) ===")
    p3 = {"steps": [], "passed": False}
    s.clear_app()
    s.launch_app()
    time.sleep(5)
    s.dismiss_system_dialogs()
    steps_ok = True

    if not wait_state(s, "login", 30):
        p3["steps"].append({"step": "Launch → Login", "ok": False, "note": "Login screen not shown"})
        steps_ok = False
    else:
        p3["steps"].append({"step": "Launch → Login", "ok": True})

    if steps_ok:
        text = s.ui_text()
        no_guest = "Explore as Guest" not in text and "Continue as guest" not in text
        p3["steps"].append({"step": "Guest buttons absent on Login", "ok": no_guest})
        s.tap_text_contains("Create account") or s.tap_test_id("login-go-register")
        time.sleep(2)
        reg_text = s.ui_text()
        no_guest_register = "Explore as Guest" not in reg_text
        p3["steps"].append({"step": "Guest buttons absent on Register", "ok": no_guest_register})
        p3["passed"] = all(x["ok"] for x in p3["steps"])
    snapshot(s, "path3-login-no-guest")
    report["paths"]["login_no_guest"] = p3

    # --- Path 1: Register ---
    print("\n=== Path 1: Register ===")
    p1 = {"steps": [], "passed": False}
    s.clear_app()
    s.launch_app()
    time.sleep(5)
    s.dismiss_system_dialogs()

    login_ok = wait_state(s, "login", 30)
    p1["steps"].append({"step": "Launch → Login", "ok": login_ok})
    if login_ok:
        s.flow_register_nav()
        reg_ok = wait_state(s, "register", 15)
        p1["steps"].append({"step": "Login → Register", "ok": reg_ok})
        if reg_ok:
            send_ok = s.flow_register_send_otp(email)
            p1["steps"].append({"step": "Register → OTP sent", "ok": send_ok})
            otp = s.fetch_otp_from_gmail(max_wait=120, known_old=known_old)
            if not otp:
                p1["steps"].append({"step": "OTP received", "ok": False, "note": "Gmail timeout"})
            else:
                p1["steps"].append({"step": "OTP received", "ok": True, "note": f"…{otp[-4:]}"})
                if wait_state(s, "otp_register", 15):
                    s.enter_otp_code(otp, "register-otp-input")
                    s.tap_test_id("register-verify-otp") or s.tap_text_contains("Create account")
                    time.sleep(3)
                legal_ok = wait_state(s, "legal", 30)
                p1["steps"].append({"step": "OTP → T&C", "ok": legal_ok})
                if legal_ok:
                    accept_legal(s)
                onboard = complete_onboarding(s)
                p1["steps"].append({
                    "step": "T&C → Veg/Nonveg → Gujarati → Notification → Location",
                    "ok": len(onboard) >= 1,
                    "note": " → ".join(onboard),
                })
                skip_pantry_and_trial(s)
                home_ok = wait_state(s, "home", 45)
                p1["steps"].append({"step": "→ Dashboard", "ok": home_ok})
    p1["passed"] = bool(p1["steps"]) and all(x["ok"] for x in p1["steps"])
    snapshot(s, "path1-register")
    report["paths"]["register"] = p1

    # --- Path 2: Login (returning user) ---
    print("\n=== Path 2: Login ===")
    p2 = {"steps": [], "passed": False}
    logout_ok = s.flow_logout()
    p2["steps"].append({"step": "Logout → Login", "ok": logout_ok})
    if logout_ok:
        send_ok = s.flow_login_send_otp(email)
        p2["steps"].append({"step": "Login → OTP sent", "ok": send_ok})
        otp2 = s.fetch_otp_from_gmail(max_wait=120, known_old=otp if "otp" in dir() else known_old)
        if not otp2:
            p2["steps"].append({"step": "OTP received", "ok": False})
        else:
            p2["steps"].append({"step": "OTP received", "ok": True, "note": f"…{otp2[-4:]}"})
            verify_ok = s.flow_login_verify_otp(otp2)
            p2["steps"].append({"step": "OTP → Dashboard (permissions if missing)", "ok": verify_ok})
    p2["passed"] = bool(p2["steps"]) and all(x["ok"] for x in p2["steps"])
    snapshot(s, "path2-login")
    report["paths"]["login"] = p2

    # --- Path 4: Returning user (already logged in) ---
    print("\n=== Path 4: Returning user ===")
    p4 = {"steps": [], "passed": False}
    if not wait_state(s, "home", 10):
        skip_pantry_and_trial(s)
    home_before = wait_state(s, "home", 20)
    p4["steps"].append({"step": "Precondition: logged in on Dashboard", "ok": home_before})
    if home_before:
        s.adb("shell", "am", "force-stop", "com.bhagihiri.rasoiapp", check=False)
        time.sleep(1)
        s.launch_app()
        time.sleep(6)
        s.dismiss_system_dialogs()
        state4 = screen_state(s)
        no_login = not state4["login"]
        reached_home = state4["home"] or wait_state(s, "home", 30)
        p4["steps"].append({
            "step": "Relaunch → skip Login",
            "ok": no_login,
            "note": "login visible" if state4["login"] else "login skipped",
        })
        p4["steps"].append({"step": "→ Dashboard (or permissions if missing)", "ok": reached_home})
    p4["passed"] = bool(p4["steps"]) and all(x["ok"] for x in p4["steps"])
    snapshot(s, "path4-returning")
    report["paths"]["returning"] = p4

    # Write report
    (QA_DIR / "results.json").write_text(json.dumps(report, indent=2))
    lines = [
        "# New Flow QA Report",
        "",
        f"**Device:** {device}",
        f"**Email:** `{email}`",
        f"**Cold launch Login first:** {cold_login}",
        "",
    ]
    for name, path in report["paths"].items():
        status = "PASS" if path.get("passed") else "FAIL"
        lines.append(f"## {name.title()} — {status}")
        for step in path.get("steps", []):
            mark = "✅" if step["ok"] else "❌"
            note = f" ({step['note']})" if step.get("note") else ""
            lines.append(f"- {mark} {step['step']}{note}")
        lines.append("")
    (QA_DIR / "QA_REPORT.md").write_text("\n".join(lines))
    print(f"\nReport: {QA_DIR / 'QA_REPORT.md'}")

    all_pass = all(p.get("passed") for p in report["paths"].values())
    return 0 if all_pass else 1


if __name__ == "__main__":
    sys.exit(main())
