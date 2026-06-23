# Rasoi Mobile — Device UI Test Cases

Full module coverage on a **real Android device** with Gmail OTP auth (`dvesp1901+{timestamp}@gmail.com`).

## Test matrix

| ID | Module | Steps | Expected | Maestro |
|----|--------|-------|----------|---------|
| TC-001 | Legal consent | Fresh install → accept terms | `screen-login` visible | `_bootstrap.yaml` |
| TC-002 | Register — details | Name, phone, email → Send code → accept terms modal | OTP step visible | `01-register-send-otp.yaml` |
| TC-003 | Register — OTP | Enter Gmail OTP → Create account | Onboarding or trial/home | `02-register-verify.yaml` |
| TC-004 | Onboarding | Veg diet → cuisine → skip notify | Reaches tabs or trial welcome | `02-register-verify.yaml` |
| TC-005 | Trial welcome | Tap continue (if shown) | `screen-home` visible | `02-register-verify.yaml` |
| TC-006 | Home | Open Home tab | Recipe content loads, `screen-home` | `03-home.yaml` |
| TC-007 | Recipes | Open Recipes tab | `screen-recipes-tab`, first card visible | `04-recipes-tab.yaml` |
| TC-008 | Recipe detail | Tap first recipe card | `screen-recipe`, title + image | `05-recipe-detail.yaml` |
| TC-009 | Save recipe | Tap Save on detail → open Saved tab | Recipe appears in saved list | `05-recipe-detail.yaml` |
| TC-010 | Saved | Open Saved tab | `screen-saved` loads | `06-saved-tab.yaml` |
| TC-011 | Pantry | Open Pantry tab | `screen-pantry` loads | `07-pantry-tab.yaml` |
| TC-012 | Settings | Open Settings → theme toggle | Light/dark switch works | `08-settings.yaml` |
| TC-013 | Logout | Settings → Log out → confirm | Returns to `screen-login` | `09-logout.yaml` |
| TC-014 | Login — email | Enter registered email → Send code | OTP step visible | `10-login-send-otp.yaml` |
| TC-015 | Login — OTP | Enter Gmail OTP → Sign in | `screen-home` visible | `11-login-verify.yaml` |
| TC-016 | Login navigation | From login → Create account link | `screen-register` visible | `01-register-send-otp.yaml` |
| TC-017 | Register navigation | From register → Log in link | `screen-login` visible | Manual / partial |

## Auth test email

```
dvesp1901+{unix_timestamp}@gmail.com
```

Generated automatically by `scripts/run-full-device-qa.sh`. OTP fetched via Gmail IMAP (`scripts/fetch-otp.py`).

## Running

```bash
cd rasoi_mobile

# Build & install debug APK (first time or after native changes)
npm run android

# Preflight checks
npm run qa:preflight

# Full module QA (register → all tabs → logout → login)
npm run qa:full

# Individual suites
npm run qa:smoke      # TC-001 + guest tab navigation (legacy)
npm run qa:auth       # TC-002–TC-015 register + login OTP flows
npm run qa:modules    # TC-006–TC-012 (requires logged-in session)
```

## Evidence

JUnit XML and screenshots saved under `rasoi_mobile/.qa/` (gitignored).

## Severity guide

| Level | Examples |
|-------|----------|
| Critical | Crash, blank screen, cannot login/register, zero recipes when API has data |
| Major | OTP never arrives, broken navigation, images fail to load |
| Minor | Alignment, slow load, copy typo |

## Stability requirement

Each test case must pass **3 consecutive runs** on a real device (`npm run qa:stability`).

## UI standard rules (automated checks)

| Rule | Description |
|------|-------------|
| No crash/redbox | No Metro redbox or crash dialog |
| Tab bar complete | All 5 tabs when on main screens |
| Touch targets | Tab items ≥48px height |
| Safe area | No tappable controls under status bar |
| Screen content | Module-specific headings/data visible |
