---
name: expo-mobile-qa
description: >-
  Run end-to-end UI QA on the Rasoi Expo mobile app on a real Android device via
  adb, report issues to the parent agent, fix them, and re-run QA until clean.
  Use when the user asks for mobile QA, device testing, UI testing on phone,
  Expo app QA, or automated login/OTP verification on a physical device.
---

# Expo Mobile QA (Real Device)

Orchestrate a **QA subagent → fix → re-QA loop** for `rasoi_mobile` on a physical Android device.

## When to use

- User asks to test the mobile app on a real device
- After auth, recipes, pantry, or UI changes
- To verify OTP login end-to-end (pair with **gmail** MCP)

## Architecture

```text
Parent agent (you)
  ├─ Launch QA subagent (Task tool, subagent_type=shell or generalPurpose)
  ├─ Subagent runs adb UI checks + captures evidence
  ├─ Subagent returns QA_REPORT markdown
  ├─ Parent fixes issues in codebase
  └─ Parent re-launches subagent until PASS or user stops
```

## Pre-flight (parent runs once)

```bash
# Device connected?
adb devices

# Backend reachable (production or local)
curl -s https://rasoiapp.vercel.app/api/recipes | head -c 200

# TypeScript clean
cd rasoi_mobile && npx tsc --noEmit

# Metro running on host (user or subagent starts it)
cd rasoi_mobile && npx expo start
```

Requirements:
- Android device with USB debugging **or** wireless adb
- Rasoi app open on device (Expo Go or dev build)
- `adb` on PATH

## Launch the QA subagent

Use the **Task** tool. Copy the prompt from [subagent-prompt.md](subagent-prompt.md) and fill in:

- `QA_ROUND` (1, 2, 3…)
- `FIXES_APPLIED` (summary of what parent fixed since last round, or "none")

Recommended: `subagent_type: "shell"` for adb-heavy work.

**Subagent must return** a report using [report-template.md](report-template.md).

## Parent fix loop

1. Read subagent `QA_REPORT`
2. Fix **Critical** and **Major** issues first (smallest correct diff)
3. If OTP/auth failed, verify Supabase + use **gmail** MCP `find_latest_otp`
4. Re-launch subagent with updated `FIXES_APPLIED`
5. Stop when `RESULT: PASS` or user says stop

Max rounds default: **3** (ask user before more).

## QA flows (in order)

Follow [qa-checklist.md](qa-checklist.md). Minimum smoke path:

1. App launches → Home or Login visible
2. Login: enter details → Send code → OTP screen
3. Gmail MCP: `find_latest_otp` → enter code → lands on Home
4. Home: recipe cards render (not empty unless filters justify it)
5. Open one recipe detail → image + title visible
6. Pantry tab loads
7. Saved tab loads
8. Settings tab loads

## Device helpers

Run from repo root:

```bash
# Screenshot + UI hierarchy dump
.cursor/skills/expo-mobile-qa/scripts/device-snapshot.sh qa-round-1-home

# Tap by screen coordinates (after inspecting dump)
adb shell input tap X Y

# Type text (escape spaces)
adb shell input text "hello"

# Press back
adb shell input keyevent 4
```

Evidence saved under `rasoi_mobile/.qa/` (gitignored).

## OTP during QA

1. Trigger "Send code" in app
2. Call gmail MCP: `find_latest_otp` with subject `Rasoi sign-in code`
3. Enter OTP via `adb shell input text` (digits only, no spaces)

## Issue severity

| Level | Examples |
|-------|----------|
| Critical | Crash, blank screen, cannot login, zero recipes when API has data |
| Major | Wrong copy, broken navigation, images fail, OTP never arrives |
| Minor | Alignment, spacing, typo, slow load |
| Cosmetic | Color nuance, icon size |

## Do not

- Commit `.qa/` screenshots or `.env` secrets
- Force-push or amend commits unless user asks
- Skip re-QA after claiming a fix

## Additional resources

- Flow checklist: [qa-checklist.md](qa-checklist.md)
- Subagent prompt: [subagent-prompt.md](subagent-prompt.md)
- Report format: [report-template.md](report-template.md)
