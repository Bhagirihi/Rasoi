# Rasoi — Android push notifications (FCM + Expo)

Remote meal pushes need **two things** on release APKs:

1. **EAS project ID** — embedded in the app (`EXPO_PUBLIC_EAS_PROJECT_ID`)
2. **`google-services.json`** — Firebase config for `com.rasoi.app`

Local 5 PM / 10 PM reminders work without these. **Server pushes (5 meal slots) do not.**

---

## One-time setup

### 1. Expo / EAS project

```bash
cd rasoi_mobile
npm run setup:push
```

Or manually:

```bash
npx eas login
npx eas init --id 01de1672-85ce-4ad7-83d7-7fc958fc5659   # @takeyshi/rasoi
```

This repo uses **dynamic** `app.config.ts`, so EAS cannot auto-write the project ID. It lives in:

- `app.json` → `expo.extra.eas.projectId`
- `.env` → `EXPO_PUBLIC_EAS_PROJECT_ID` (for release builds)

Copy the project ID into `.env` if missing:

```bash
EXPO_PUBLIC_EAS_PROJECT_ID=01de1672-85ce-4ad7-83d7-7fc958fc5659
```

Find it anytime: [expo.dev](https://expo.dev) → **@takeyshi/rasoi** → Project settings.

### 2. Firebase (google-services.json)

**Automated (after Firebase CLI login):**

```bash
npx firebase-tools login          # one-time, opens browser
npm run setup:firebase            # creates project + com.rasoi.app + downloads JSON
```

**Manual:**

1. [Firebase Console](https://console.firebase.google.com/) → **Add project** (or use existing)
2. **Add app** → Android → package name: **`com.rasoi.app`**
3. Download **`google-services.json`**
4. Save as `rasoi_mobile/google-services.json` (same folder as `app.json`)

### 3. FCM v1 credentials on Expo (server can send pushes)

```bash
npm run setup:fcm
```

This generates a Firebase service account key and uploads it to EAS for `com.rasoi.app`.

Manual alternative:

```bash
npx eas credentials
# Android → production → Google Service Account → FCM V1
```

### 4. Rebuild APK

```bash
npm run android:release-apk
```

Upload new APK to GitHub release / share with testers.

---

## Verify on device

1. Install new APK
2. Log in with OTP
3. Enable **notifications** in onboarding or Settings
4. Allow Android notification permission
5. Force-close and reopen app once

Check admin → Users → your row should show **1 device** push token.

Send test: Admin → user → **Send meal notification** → pick **Dinner**.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| No push token in admin | Missing `EXPO_PUBLIC_EAS_PROJECT_ID` or `google-services.json` — rebuild after setup |
| Token registers but push not received | Upload FCM v1 service account via `eas credentials` |
| Works in dev, not release | Release APK must be rebuilt after adding Firebase file |
| `getExpoPushToken` fails | Check Sentry for `push_token_failed` events |

---

## Meal push schedule (server)

| Slot | IST |
|------|-----|
| Breakfast | 8:00 AM |
| Lunch | 12:30 PM |
| Snack | 4:00 PM |
| Dinner | 7:00 PM |
| Late night | 10:00 PM |

Cron: GitHub Actions every 15 min → `/api/cron/meal-notifications`
