# Rasoi Mobile — Device UI QA

Automated end-to-end UI tests run on a **real Android device** via [Maestro](https://maestro.mobile.dev/) and `adb`.

## Prerequisites

1. **Android device** with USB debugging (or wireless adb)
2. **Dev build installed** (`com.bhagihiri.rasoiapp`) — Expo Go is not supported (different app id)
3. **Maestro CLI**:
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   export PATH="$PATH:$HOME/.maestro/bin"
   ```
4. **Backend reachable** (production or local) for recipe loading

## Quick start

```bash
cd rasoi_mobile

# Build & install debug APK on device (first time)
npm run android

# Preflight: device, Maestro, app installed
npm run qa:preflight

# Smoke: onboarding → guest → all tabs
npm run qa:smoke

# Full suite: smoke + recipe detail + theme toggle
npm run qa:device
```

## Test flows

| Flow | File | What it covers |
|------|------|----------------|
| Guest smoke | `e2e/maestro/01-guest-smoke.yaml` | Fresh install, onboarding, guest login, tab navigation |
| Recipe detail | `e2e/maestro/02-recipe-detail.yaml` | Open first recipe card, verify detail screen |
| Settings theme | `e2e/maestro/03-settings-theme.yaml` | Dark/light mode toggle |

Mapped manual cases: see [test-cases.md](./test-cases.md).

## Stable test IDs

Defined in `constants/testIds.ts` and wired to screens, tabs, and key buttons. Maestro selects by `id:` (maps to React Native `testID`).

## Evidence

JUnit XML and run metadata are saved under `rasoi_mobile/.qa/` (gitignored).

For adb screenshots and UI dumps without Maestro, use:

```bash
.cursor/skills/expo-mobile-qa/scripts/device-snapshot.sh round-1-home
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `App not installed` | `npm run android` on connected device |
| Onboarding timeout | Ensure reference API loads (network); increase timeout in YAML |
| `recipe-card-first` not found | Wait for recipes API; check `GET /api/recipes` |
| Maestro not found | Install Maestro and add `~/.maestro/bin` to PATH |

Override app id: `RASOI_APP_ID=com.bhagihiri.rasoiapp npm run qa:smoke`
