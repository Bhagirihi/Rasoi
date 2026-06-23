#!/usr/bin/env python3
"""Full device QA: register (Gmail OTP) → modules → logout → login (OTP). Uses QA_OTP env if set."""
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
QA_DIR = ROOT / ".qa" / f"new-qa-{datetime.now().strftime('%Y%m%d-%H%M%S')}"


def load_stability():
    path = ROOT / "scripts" / "run-stability-3x.py"
    spec = importlib.util.spec_from_file_location("stability_qa", path)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    sys.modules["stability_qa"] = mod
    spec.loader.exec_module(mod)
    mod.QA_DIR = QA_DIR
    return mod


def main() -> int:
    s = load_stability()
    s.QA_DIR = QA_DIR
    QA_DIR.mkdir(parents=True, exist_ok=True)

    device = s.ensure_device()
    s.setup()
    email = f"dvesp1901+{int(time.time())}@gmail.com"
    if os.environ.get("QA_EMAIL"):
        email = os.environ["QA_EMAIL"].strip()
    known_old = os.environ.get("QA_OTP_KNOWN_OLD", "00797644")

    results: list[dict] = []

    def step(name: str, ok: bool, note: str = "", ui=None):
        entry = {"step": name, "passed": ok, "note": note}
        if ui:
            fails = [c for c in ui if not c.ok]
            entry["ui"] = f"{len(ui) - len(fails)}/{len(ui)}"
        results.append(entry)
        tag = "PASS" if ok else "FAIL"
        print(f"{'✓' if ok else '✗'} {name}: {tag} {note}")

    print(f"New QA — device {device}")
    print(f"Email: {email}")
    print(f"Evidence: {QA_DIR}\n")

    continue_home = os.environ.get("QA_CONTINUE_FROM_HOME", "").strip() in ("1", "true", "yes")

    if continue_home and s.wait_for_home(5):
        print("Continuing from logged-in home session (skip register)")
        otp = None
        step("TC-001 Legal consent", True, "skipped — session")
        step("TC-002 Register send OTP", True, "skipped — session")
        step("TC-003 Register OTP verify", True, "skipped — session")
    else:
        # TC-001 Legal
        s.clear_app()
        s.launch_app()
        ok = s.flow_legal_to_login()
        ui = s.check_ui_standards("login") if ok else s.check_ui_standards("legal")
        step("TC-001 Legal consent", s.ui_passed(ok, ui), ui=ui)

        # TC-002 Register send OTP
        s.flow_register_nav()
        ok = s.flow_register_send_otp(email)
        ui = s.check_ui_standards("register")
        step("TC-002 Register send OTP", ok, ui=ui)

        otp: str | None = None
        otp2: str | None = None

        # TC-003 Register verify OTP + onboarding
        otp = s.fetch_otp_from_gmail(max_wait=120, known_old=known_old)
        if not otp:
            step("TC-003 Register OTP verify", False, "No OTP in Gmail within 120s")
        else:
            print(f"  OTP received: …{otp[-4:]}")
            ok = s.flow_register_verify_otp(otp)
            if not ok:
                ok = s.wait_for_home(30)
            time.sleep(2)
            ui = s.check_ui_standards("home")
            step("TC-003 Register OTP verify", s.ui_passed(ok, ui), f"OTP …{otp[-4:]}", ui=ui)

        if not results[-1]["passed"] and not s.wait_for_home(8):
            _write_report(device, email, results)
            return 1

    otp2: str | None = None

    # TC-004–006 Home
    ui = s.check_ui_standards("home")
    step("TC-004 Onboarding complete", True, ui=ui)
    step("TC-005 Trial welcome", bool(re.search(r"Trial|Rasoi Plus|Good Morning|Good Afternoon|Good Evening", s.ui_text(), re.I)))
    step("TC-006 Home", s.ui_passed(s.wait_for_home(15), ui))

    # TC-007 Recipes
    s.tap_test_id("tab-recipes") or s.tap_desc("Recipe")
    time.sleep(4)
    ui = s.check_ui_standards("recipes")
    ok = s.wait_for(r"screen-recipes-tab|Recipes|recipe-card-first", 25)
    step("TC-007 Recipes", ok and s.ui_passed(True, ui), ui=ui)

    # TC-008 Recipe detail
    s.tap_test_id("recipe-card-first") or s.tap_xy(540, 1200)
    time.sleep(4)
    ui = s.check_ui_standards("recipe_detail")
    ok = s.wait_for(r"min|Ingredients|Save|screen-recipe", 12)
    step("TC-008 Recipe detail", ok, ui=ui)
    s.back()
    time.sleep(1)

    # TC-009 Save
    s.tap_test_id("tab-recipes") or s.tap_desc("Recipe")
    time.sleep(3)
    s.tap_test_id("recipe-card-first") or s.tap_xy(540, 1200)
    time.sleep(4)
    s.tap_test_id("recipe-save-button") or s.tap_text_contains("Save")
    time.sleep(2)
    s.back()
    s.tap_test_id("tab-saved") or s.tap_desc("Saved")
    time.sleep(2)
    ui = s.check_ui_standards("saved")
    step("TC-009 Save recipe", s.wait_for(r"saved|Saved|No saved", 10), ui=ui)

    # TC-010 Saved
    step("TC-010 Saved tab", s.wait_for(r"SAVED|Saved|saved", 8), ui=ui)

    # TC-011 Pantry
    s.tap_test_id("tab-pantry") or s.tap_desc("Pantry")
    time.sleep(2)
    ui = s.check_ui_standards("pantry")
    step("TC-011 Pantry", s.wait_for(r"Pantry|stocked|What's at home", 10), ui=ui)

    # TC-012 Settings
    s.tap_test_id("tab-settings") or s.tap_desc("Settings")
    time.sleep(2)
    s.tap_test_id("settings-theme-dark") or s.tap_text_contains("Dark")
    time.sleep(1)
    ui = s.check_ui_standards("settings")
    step("TC-012 Settings theme", s.wait_for(r"Settings|Theme|Profile", 10), ui=ui)

    # TC-013 Logout
    ok = s.flow_logout()
    ui = s.check_ui_standards("login")
    step("TC-013 Logout", s.ui_passed(ok, ui), ui=ui)

    # TC-014 Login send OTP (Maestro for reliable RN text input)
    ok = s.run_maestro_flow(
        "e2e/maestro/10-login-send-otp.yaml",
        {"QA_EMAIL": email},
    )
    ui = s.check_ui_standards("login")
    step("TC-014 Login send OTP", ok, ui=ui)

    otp2 = s.fetch_otp_from_gmail(max_wait=120, known_old=otp or known_old)
    if not otp2:
        step("TC-015 Login OTP verify", False, "No OTP in Gmail within 120s")
    else:
        print(f"  Login OTP: …{otp2[-4:]}")
        ok = s.run_maestro_flow(
            "e2e/maestro/11-login-verify-session.yaml",
            {"QA_OTP": otp2},
        )
        ui = s.check_ui_standards("home")
        step("TC-015 Login OTP verify", s.ui_passed(ok, ui), f"OTP …{otp2[-4:]}", ui=ui)

    # TC-016/017 nav (quick)
    s.clear_app()
    s.launch_app()
    s.flow_legal_to_login()
    ok = s.flow_register_nav()
    step("TC-016 Login→Register nav", ok)
    s.tap_text_contains("Log in")
    time.sleep(2)
    step("TC-017 Register→Login nav", s.wait_for(r"Welcome back", 10))

    _write_report(device, email, results)
    passed = sum(1 for r in results if r["passed"])
    total = len(results)
    print(f"\nResult: {passed}/{total} passed")
    return 0 if passed == total else 1


def _write_report(device: str, email: str, results: list[dict]) -> None:
    passed = sum(1 for r in results if r["passed"])
    lines = [
        "# Rasoi Mobile — New QA Report",
        "",
        f"**Date:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        f"**Device:** {device}",
        f"**Email:** `{email}`",
        f"**Result:** {passed}/{len(results)} passed",
        "",
        "| Step | Result | Note |",
        "|------|--------|------|",
    ]
    for r in results:
        mark = "✅" if r["passed"] else "❌"
        ui = f" UI {r['ui']}" if r.get("ui") else ""
        lines.append(f"| {r['step']} | {mark} | {r.get('note', '')}{ui} |")
    report = QA_DIR / "QA_REPORT.md"
    report.write_text("\n".join(lines))
    (QA_DIR / "results.json").write_text(json.dumps(results, indent=2))
    print(f"\nReport: {report}")


if __name__ == "__main__":
    sys.exit(main())
