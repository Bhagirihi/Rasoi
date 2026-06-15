# Device UI Test Cases (Maestro)

Automated flows linked to `QA_CROSSCHECK.md` navigation and auth cases.

## Automated (Maestro)

| ID | Flow | Steps | Expected | Maestro |
|----|------|-------|----------|---------|
| TC-DEV-01 | Guest smoke | `clearState` → onboarding (Veg → cuisine → skip notify) → guest → tabs | Home, Pantry, Saved, Settings visible | `01-guest-smoke.yaml` |
| TC-DEV-02 | Tab navigation | Tap each bottom tab | Correct `screen-*` testID visible | `01-guest-smoke.yaml` |
| TC-DEV-03 | Recipe detail | Tap `recipe-card-first` on Home | `screen-recipe` visible; back returns | `02-recipe-detail.yaml` |
| TC-DEV-04 | Theme toggle | Settings → Dark → Light | Settings remains usable | `03-settings-theme.yaml` |

Maps to manual cases:

- **TC-AUTH-04** — Explore as Guest
- **TC-REC-01** — Home loads recipes (card visible)
- **TC-REC-02** — Tap recipe card → detail
- **TC-UI-01** — Tabs layout
- **TC-UI-02** — Dark/light appearance (new)

## Manual only (not automated)

| ID | Reason |
|----|--------|
| TC-AUTH-02/03 | OTP + Supabase + Gmail — use `.cursor/skills/expo-mobile-qa` adb workflow |
| TC-PART-02 | External deep links (Blinkit/Zomato) |
| TC-USER-05 | Paid upgrade requires payment provider |
| TC-REC-05 | Realtime admin edit |

## Running

```bash
npm run qa:preflight   # checks only
npm run qa:smoke       # TC-DEV-01 + TC-DEV-02
npm run qa:device      # all TC-DEV-* flows
```
