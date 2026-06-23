#!/usr/bin/env python3
"""QA: Explore as Guest + Delete guest account on a real Android device."""
from __future__ import annotations

import importlib.util
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QA_DIR = ROOT / ".qa" / f"guest-delete-{datetime.now().strftime('%Y%m%d-%H%M%S')}"


def load():
    spec = importlib.util.spec_from_file_location("qa", ROOT / "scripts" / "run-stability-3x.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules["qa"] = mod
    assert spec.loader
    spec.loader.exec_module(mod)
    mod.QA_DIR = QA_DIR
    return mod


def main() -> int:
    s = load()
    QA_DIR.mkdir(parents=True, exist_ok=True)
    device = s.ensure_device()
    s.setup()

    results: list[dict] = []

    def step(name: str, ok: bool, note: str = ""):
        results.append({"step": name, "passed": ok, "note": note})
        print(f"{'✓' if ok else '✗'} {name}: {'PASS' if ok else 'FAIL'} {note}")

    print(f"Guest + Delete QA — {device}")
    print(f"Evidence: {QA_DIR}\n")

    # TC-GUEST-001: Explore as Guest
    s.clear_app()
    s.launch_app()
    legal = s.flow_legal_to_login()
    step("TC-GUEST-001 Legal → login", legal)
    if not legal:
        _report(device, results)
        return 1

    guest = s.flow_guest_to_home()
    ui = s.check_ui_standards("home")
    home_ok = s.wait_for_home(10)
    step(
        "TC-GUEST-002 Explore as Guest → home",
        guest and home_ok and s.ui_passed(True, ui),
        f"UI {len([c for c in ui if c.ok])}/{len(ui)}",
    )

    # Walk main tabs as guest
    for tab_id, desc, screen in [
        ("tab-recipes", "Recipe", r"screen-recipes-tab|Recipes"),
        ("tab-pantry", "Pantry", r"Pantry|stocked"),
        ("tab-saved", "Saved", r"Saved|saved"),
        ("tab-settings", "Settings", r"Settings|Profile"),
    ]:
        s.tap_test_id(tab_id) or s.tap_desc(desc)
        import time
        time.sleep(2)
        ok = s.wait_for(screen, 12)
        step(f"TC-GUEST-003 {desc} tab", ok)

    s.tap_test_id("tab-home") or s.tap_desc("Home")
    import time
    time.sleep(2)

    # TC-GUEST-004: Delete guest account
    ok = s.flow_delete_guest_account()
    ui_login = s.check_ui_standards("login")
    step(
        "TC-GUEST-004 Delete guest account",
        ok and s.ui_passed(ok, ui_login),
        "Returns to login" if ok else "Delete flow incomplete",
    )

    _report(device, results)
    passed = sum(1 for r in results if r["passed"])
    print(f"\nResult: {passed}/{len(results)} passed")
    return 0 if passed == len(results) else 1


def _report(device: str, results: list[dict]) -> None:
    passed = sum(1 for r in results if r["passed"])
    lines = [
        "# Guest + Delete Account QA",
        "",
        f"**Date:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        f"**Device:** {device}",
        f"**Result:** {passed}/{len(results)} passed",
        "",
        "| Step | Result | Note |",
        "|------|--------|------|",
    ]
    for r in results:
        mark = "✅" if r["passed"] else "❌"
        lines.append(f"| {r['step']} | {mark} | {r.get('note', '')} |")
    (QA_DIR / "QA_REPORT.md").write_text("\n".join(lines))
    (QA_DIR / "results.json").write_text(json.dumps(results, indent=2))
    print(f"\nReport: {QA_DIR / 'QA_REPORT.md'}")


if __name__ == "__main__":
    sys.exit(main())
