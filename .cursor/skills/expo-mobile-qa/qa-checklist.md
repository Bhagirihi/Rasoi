# Rasoi Mobile QA Checklist

Run top-to-bottom on a real Android device. Mark each step PASS / FAIL / SKIP.

## A. Environment

- [ ] `adb devices` shows one device `device` (not `unauthorized`)
- [ ] Expo Metro is running (`rasoi_mobile`)
- [ ] `GET /api/recipes` returns JSON with recipes (production or configured API)
- [ ] `npx tsc --noEmit` in `rasoi_mobile` passes

## B. Cold start / routing

- [ ] App opens without redbox crash
- [ ] Splash/loading resolves within 10s
- [ ] Correct route: onboarding (fresh), login (no session), or home (logged in)

## C. Onboarding (fresh install only)

- [ ] Swipe/next through onboarding cards
- [ ] Diet preference selectable
- [ ] Regional / cuisine preferences selectable
- [ ] Reaches login screen

## D. Login + OTP

- [ ] Name, phone, email fields accept input
- [ ] Validation errors show for bad email/phone
- [ ] "Send code" succeeds (no error toast)
- [ ] OTP step appears
- [ ] Gmail MCP returns 8-digit code (`find_latest_otp`)
- [ ] Verify succeeds → Home or trial welcome
- [ ] Invalid OTP shows error (optional spot-check)

## E. Home (Recipes)

- [ ] Recipe cards visible (count > 0 when API has data)
- [ ] Images load (not broken placeholder for majority)
- [ ] Kitchen style / filter chips work
- [ ] Empty state only when filters genuinely empty
- [ ] Tap card → recipe detail opens

## F. Recipe detail

- [ ] Title, image, ingredients section visible
- [ ] Back navigation works
- [ ] Save/bookmark toggles (if shown)

## G. Pantry

- [ ] Tab opens without crash
- [ ] Add/remove pantry item works
- [ ] Returning to Home reflects pantry filter (if enabled)

## H. Saved

- [ ] Tab opens
- [ ] Saved recipes list consistent with bookmarks

## I. Settings

- [ ] Profile info visible
- [ ] Edit preferences opens
- [ ] Logout works → returns to login

## J. Non-functional

- [ ] No persistent error banners on happy path
- [ ] Tab bar labels readable, not clipped
- [ ] Safe area respected (notch/status bar)

## K. Regression targets (from past bugs)

- [ ] Android emulator/API uses correct host (`10.0.2.2` on emulator, LAN IP on device)
- [ ] Realtime channel does not block recipe load
- [ ] Pantry + regional filters do not zero out all results incorrectly
