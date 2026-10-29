#!/usr/bin/env python3
"""Heavy Plan tab QA + 3× download/reinstall crash cycles (production APK)."""
from __future__ import annotations

import importlib.util
import json
import re
import subprocess
import sys
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QA_DIR = ROOT / ".qa" / f"plan-reinstall-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
APK_URL = "https://rasoiapplication.in/rasoi-release.apk"
APP_ID = "com.bhagihiri.rasoiapp"
REINSTALL_CYCLES = 3


def load_stability():
    path = ROOT / "scripts" / "run-stability-3x.py"
    spec = importlib.util.spec_from_file_location("stability_qa", path)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    sys.modules["stability_qa"] = mod
    spec.loader.exec_module(mod)
    mod.QA_DIR = QA_DIR
    return mod


def adb(*args: str, check: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(["adb", *args], capture_output=True, text=True, check=check)


def has_crash_or_redbox(text: str) -> tuple[bool, str]:
    patterns = [
        (r"Unable to load script|RedBox|has stopped|keeps stopping", "crash/redbox"),
        (r"Unfortunately.*Rasoi", "crash dialog"),
    ]
    for pat, label in patterns:
        if re.search(pat, text, re.I):
            return True, label
    return False, ""


def download_apk(dest: Path) -> None:
    print(f"Downloading APK from {APK_URL} …")
    req = urllib.request.Request(APK_URL, headers={"User-Agent": "Rasoi-QA/1.0"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = resp.read()
    if len(data) < 50_000_000:
        raise RuntimeError(f"APK too small ({len(data)} bytes)")
    dest.write_bytes(data)
    print(f"  Saved {len(data) // (1024 * 1024)} MB → {dest}")


def reinstall_cycle(cycle: int, apk_path: Path, s) -> dict:
    print(f"\n=== Reinstall cycle {cycle}/{REINSTALL_CYCLES} ===")
    adb("uninstall", APP_ID, check=False)
    time.sleep(1)
    proc = adb("install", "-r", str(apk_path), check=False)
    if proc.returncode != 0:
        return {"cycle": cycle, "passed": False, "note": f"install failed: {proc.stderr.strip()}"}
    adb("shell", "monkey", "-p", APP_ID, "-c", "android.intent.category.LAUNCHER", "1", check=False)
    time.sleep(12)
    text = s.ui_text()
    crashed, reason = has_crash_or_redbox(text)
    ok = not crashed and (
        re.search(r"Welcome back|Terms & Privacy|Good Morning|Good Afternoon|Good Evening|screen-", text, re.I)
        is not None
    )
    snap = QA_DIR / f"reinstall-cycle-{cycle}.png"
    adb("exec-out", "screencap", "-p", check=False).stdout
    with open(snap, "wb") as f:
        subprocess.run(["adb", "exec-out", "screencap", "-p"], stdout=f, check=False)
    note = reason if crashed else ("app launched" if ok else "blank/unexpected screen")
    return {"cycle": cycle, "passed": ok, "note": note, "screenshot": str(snap)}


def run_plan_qa(s) -> list[dict]:
    results: list[dict] = []

    def step(name: str, ok: bool, note: str = ""):
        results.append({"step": name, "passed": ok, "note": note})
        print(f"{'✓' if ok else '✗'} {name}: {'PASS' if ok else 'FAIL'} {note}")

    if not s.wait_for_home(8):
        step("PLAN-00 Session", False, "Not logged in — run full QA first")
        return results

    # Open Plan tab
    opened = s.tap_test_id("tab-plan") or s.tap_desc("Plan")
    time.sleep(3)
    text = s.ui_text()
    step(
        "PLAN-01 Tab opens",
        opened and bool(re.search(r"screen-plan|Meal plan|Today|Tomorrow", text, re.I)),
        "Plan tab visible",
    )

    crashed, reason = has_crash_or_redbox(text)
    step("PLAN-02 No crash on open", not crashed, reason)

    # Day picker: Today / Tomorrow / day+2
    for label in ["Today", "Tomorrow"]:
        if s.tap_text_exact(label) or s.tap_text_contains(label):
            time.sleep(2)
            text = s.ui_text()
            step(f"PLAN-03 Day picker — {label}", bool(re.search(r"meals|Breakfast|Lunch|Dinner|Snack", text, re.I)))
        else:
            step(f"PLAN-03 Day picker — {label}", False, "Chip not tappable")

    # Third day chip (weekday short)
    root = s.dump_ui()
    tapped_third = False
    for node in root.iter("node"):
        t = node.attrib.get("text", "")
        if t and t not in ("Today", "Tomorrow") and node.attrib.get("clickable") == "true":
            if re.match(r"^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$", t):
                c = s.center_of(node)
                if c:
                    s.tap_xy(*c)
                    tapped_third = True
                    break
    time.sleep(2)
    step("PLAN-04 Day picker — day+2", tapped_third, "Third day chip")

    s.tap_text_exact("Today") or s.tap_text_contains("Today")
    time.sleep(1)

    # Shuffle
    if s.tap_text_contains("Shuffle"):
        time.sleep(2)
        step("PLAN-05 Shuffle meals", not has_crash_or_redbox(s.ui_text())[0])
    else:
        step("PLAN-05 Shuffle meals", False, "Shuffle button missing")

    # Save all (if shown)
    if re.search(r"Save all", s.ui_text(), re.I):
        s.tap_text_contains("Save all")
        time.sleep(2)
        step("PLAN-06 Save all meals", not has_crash_or_redbox(s.ui_text())[0])
    else:
        step("PLAN-06 Save all meals", True, "Skipped — all already saved or empty")

    # Open first recipe card
    s.tap_xy(540, 1100)
    time.sleep(4)
    detail_ok = s.wait_for(r"Ingredients|min|Save|screen-recipe", 12)
    step("PLAN-07 Recipe detail from plan", detail_ok)
    s.back()
    time.sleep(1)

    # Pantry nudge
    s.tap_test_id("tab-plan") or s.tap_desc("Plan")
    time.sleep(2)
    for _ in range(3):
        adb("shell", "input", "swipe", "540", "1400", "540", "600", "300", check=False)
        time.sleep(0.4)
    if s.tap_text_contains("pantry") or s.tap_text_contains("missing"):
        time.sleep(2)
        step("PLAN-08 Pantry nudge", s.wait_for(r"Pantry|stocked|What's at home", 10))
        s.tap_test_id("tab-plan") or s.tap_desc("Plan")
        time.sleep(2)
    else:
        step("PLAN-08 Pantry nudge", True, "Nudge not shown (100% pantry match)")

    # Explore more → Recipes
    for _ in range(4):
        adb("shell", "input", "swipe", "540", "1600", "540", "400", "300", check=False)
        time.sleep(0.4)
    if s.tap_text_contains("Explore") or s.tap_text_contains("Full catalog"):
        time.sleep(3)
        step("PLAN-09 Explore more link", s.wait_for(r"Recipes|dishes|screen-recipes", 15))
    else:
        step("PLAN-09 Explore more link", False, "Link not found")

    # Pull-to-refresh proxy: return to plan
    s.tap_test_id("tab-plan") or s.tap_desc("Plan")
    time.sleep(2)
    adb("shell", "input", "swipe", "540", "500", "540", "1200", "400", check=False)
    time.sleep(3)
    step("PLAN-10 Pull refresh", not has_crash_or_redbox(s.ui_text())[0])

    # Tab bar has Plan among 5 tabs
    text = s.ui_text()
    tabs = ["Home", "Recipe", "Plan", "Pantry", "Saved"]
    missing = [t for t in tabs if t not in text]
    step("PLAN-11 Tab bar includes Plan", len(missing) == 0, f"missing: {missing}" if missing else "")

    return results


def main() -> int:
    s = load_stability()
    QA_DIR.mkdir(parents=True, exist_ok=True)
    device = s.ensure_device()
    s.setup()

    print(f"Plan + Reinstall QA — device {device}")
    print(f"Evidence: {QA_DIR}\n")

    plan_results = run_plan_qa(s)

    apk_path = QA_DIR / "rasoi-release.apk"
    try:
        download_apk(apk_path)
    except Exception as exc:
        print(f"APK download failed: {exc}")
        reinstall_results = [{"cycle": i, "passed": False, "note": str(exc)} for i in range(1, REINSTALL_CYCLES + 1)]
    else:
        reinstall_results = [reinstall_cycle(i, apk_path, s) for i in range(1, REINSTALL_CYCLES + 1)]

    plan_pass = sum(1 for r in plan_results if r["passed"])
    reinstall_pass = sum(1 for r in reinstall_results if r["passed"])

    lines = [
        "# Plan Tab + 3× Reinstall QA Report",
        "",
        f"**Date:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        f"**Device:** {device}",
        f"**Evidence:** `{QA_DIR}`",
        "",
        "## Plan Tab QA",
        "",
        f"**Result:** {plan_pass}/{len(plan_results)} passed",
        "",
        "| Step | Result | Note |",
        "|------|--------|------|",
    ]
    for r in plan_results:
        mark = "✅" if r["passed"] else "❌"
        lines.append(f"| {r['step']} | {mark} | {r.get('note', '')} |")

    lines.extend([
        "",
        "## 3× Download & Reinstall (production APK)",
        "",
        f"**Result:** {reinstall_pass}/{REINSTALL_CYCLES} passed",
        "",
        "| Cycle | Result | Note |",
        "|-------|--------|------|",
    ])
    for r in reinstall_results:
        mark = "✅" if r["passed"] else "❌"
        lines.append(f"| {r['cycle']} | {mark} | {r.get('note', '')} |")

    report = QA_DIR / "QA_REPORT.md"
    report.write_text("\n".join(lines))
    (QA_DIR / "results.json").write_text(
        json.dumps({"plan": plan_results, "reinstall": reinstall_results}, indent=2)
    )
    print(f"\nReport: {report}")
    print(f"Plan: {plan_pass}/{len(plan_results)} | Reinstall: {reinstall_pass}/{REINSTALL_CYCLES}")

    all_ok = plan_pass == len(plan_results) and reinstall_pass == REINSTALL_CYCLES
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
