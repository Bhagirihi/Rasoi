# QA_REPORT

- **Round:** {{QA_ROUND}}
- **Device:** {{DEVICE_MODEL}}
- **App entry:** Expo Go / dev build
- **API:** {{API_URL}}
- **Result:** PASS | FAIL | BLOCKED

## Summary

{{1-3 sentences}}

## Passed ({{N}})

- ...

## Issues

### 1. [Critical|Major|Minor|Cosmetic] {{title}}

- **Screen:** ...
- **Steps:** ...
- **Expected:** ...
- **Actual:** ...
- **Evidence:** `rasoi_mobile/.qa/{{file}}`
- **Suggested fix:** `rasoi_mobile/{{path}}` — ...

## Metrics

| Check | Status |
|-------|--------|
| adb device | OK / FAIL |
| tsc --noEmit | OK / FAIL |
| API recipes | OK / FAIL (count: N) |
| OTP login | OK / FAIL / SKIP |
| Home recipes | OK / FAIL |
| Recipe detail | OK / FAIL |
| Pantry | OK / FAIL |
| Saved | OK / FAIL |
| Settings | OK / FAIL |

## Parent actions

1. ...
2. ...

## Re-test focus (next round)

- ...
