# Firebase — link AdMob + Google Play

Firebase project: **[rasoi-app-prod](https://console.firebase.google.com/u/0/project/rasoi-app-prod/overview)**  
Primary Google account: **devsp1901@gmail.com**

These links are done in **Google consoles** (not in app code). MCP/API cannot create them — follow this checklist once per environment.

---

## IDs (must match everywhere)

| Service | Value |
|---------|--------|
| Firebase project | `rasoi-app-prod` |
| Firebase Android app ID | `1:304365765846:android:85492c6a6786f4cec27577` |
| Package name | `com.bhagihiri.rasoiapp` |
| AdMob publisher | `pub-4173581536398147` |
| AdMob Android app ID | `ca-app-pub-4173581536398147~9898362276` |
| Play developer | Bhagihiri Applications |
| Play app | Rasoi App · `com.bhagihiri.rasoiapp` |

---

## 0. Enable Google Analytics (required for AdMob metrics + Play insights)

1. Open [Firebase → Integrations](https://console.firebase.google.com/u/0/project/rasoi-app-prod/settings/integrations)
2. Under **Google Analytics** → **Link** (or **Manage** if already linked)
3. Create or select a GA4 property (e.g. **Rasoi App**)
4. Confirm Analytics appears in the left nav after ~24h for full dashboards

Without this, AdMob “User metrics” and Firebase ↔ Play reporting stay limited.

---

## Phone verification (signup SMS OTP)

Used during **Create account** to verify the user's mobile via Firebase Authentication.

1. [Firebase Console → Authentication → Sign-in method](https://console.firebase.google.com/u/0/project/rasoi-app-prod/authentication/providers) → enable **Phone**
2. Ensure **Play App Signing SHA-1** and **debug SHA-1** are in [Project settings → Your apps → Android](https://console.firebase.google.com/u/0/project/rasoi-app-prod/settings/general) (same as FCM)
3. **Blaze plan** recommended for production SMS volume
4. **QA / Maestro:** optional [test phone number](https://console.firebase.google.com/u/0/project/rasoi-app-prod/authentication/providers) if re-enabling SMS later. Device QA defaults: `QA_PHONE=9374766500`, `QA_EMAIL=dvesp1901+{timestamp}@gmail.com` (plus-addressing lands in dvesp1901@gmail.com).
5. **Local skip (no SMS):** `EXPO_PUBLIC_SKIP_PHONE_VERIFY=1` in `.env.development` — skips SMS and goes straight to email OTP

Requires a **native rebuild** after adding `@react-native-firebase/auth` (`npm run android:release-apk`).

---

## 1. Link AdMob ↔ Firebase

**Done in AdMob**, not Firebase. See [AdMob + Firebase quickstart](https://firebase.google.com/docs/admob/android/quick-start).

### Account access

- **Firebase** owner: `devsp1901@gmail.com`
- **AdMob** publisher today: `my.website.email2@gmail.com` (`pub-4173581536398147`)

Use **one** Google account that can open **both** consoles, or grant cross-access:

- [AdMob → Account → User management](https://admob.google.com/v2/settings/user-management) → invite `devsp1901@gmail.com` as **Admin**, **or**
- [Firebase → Project settings → Users and permissions](https://console.firebase.google.com/u/0/project/rasoi-app-prod/settings/iam) → invite `my.website.email2@gmail.com` as **Editor** / **Firebase Admin**

### Steps (AdMob console)

1. Sign in to [AdMob](https://admob.google.com/) with an account that has **Admin** on the publisher
2. **Apps** → select **Rasoi** Android app (`ca-app-pub-4173581536398147~9898362276`)
3. **App settings** → enable **User metrics** ([help](https://support.google.com/admob/answer/9263723))
4. **Link to Firebase** → choose:
   - Project: **rasoi-app-prod**
   - App: **Rasoi Android** · `com.bhagihiri.rasoiapp`
5. Package name must match **exactly** — no typos

### Verify

- AdMob app page shows **Linked to Firebase**
- [Firebase → Integrations → AdMob](https://console.firebase.google.com/u/0/project/rasoi-app-prod/settings/integrations) shows linked app
- Release APK installed → AdMob **User metrics** card gets data within 24–48h

App-side requirements (already in repo): `google-services.json`, AdMob app ID in manifest, `@react-native-firebase/analytics`, `react-native-google-mobile-ads`.

---

## 2. Link Google Play ↔ Firebase

**Done in Firebase** (or Play Console → Linked services). See [Link Play to Firebase](https://support.google.com/firebase/answer/6392038).

### Prerequisites

- App **created** in [Play Console](https://play.google.com/console) with package `com.bhagihiri.rasoiapp`
- At least one release on **internal / closed / open testing** or production
- Same Google account (or linked access) with:
  - **Owner** or **Admin** on Play developer account
  - **Owner** or **Firebase Admin** on `rasoi-app-prod`

### Steps (Firebase console — recommended)

1. Open [Firebase → Integrations → Google Play](https://console.firebase.google.com/u/0/project/rasoi-app-prod/settings/integrations)
2. Click **Link** on the **Google Play** card
3. Select Play developer **Bhagihiri Applications**
4. Confirm app **com.bhagihiri.rasoiapp**

### Alternative (Play Console)

1. [Play Console](https://play.google.com/console) → **Setup → Linked services → Firebase**
2. Link to project **rasoi-app-prod**

### After linking

- Add **production** signing SHA-1/SHA-256 to Firebase (Play App Signing):
  - Firebase → Project settings → Your apps → Rasoi Android → **Add fingerprint**
  - Copy SHA from Play Console → **Setup → App integrity → App signing key certificate**
- Crashlytics, Analytics, and Remote Config can target Play release tracks

Currently Firebase only has **debug** keystore SHA registered — add Play **app signing** SHA for production builds.

---

## 3. Quick verification script

```bash
cd rasoi_mobile
bash scripts/firebase-linking-checklist.sh
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| “No permission to link” | Use Owner/Admin on both sides; accept Firebase ToS as linking user |
| AdMob can’t see Firebase project | Grant Firebase access to the AdMob Google account |
| Play link missing | App must exist in Play with exact package name; not draft-only |
| No Analytics data | Enable GA in Integrations; ship release APK with Analytics SDK |
| AdMob metrics empty | Enable User metrics; wait 24–48h after real users on release build |

---

## Related docs

- [PUSH_SETUP.md](./PUSH_SETUP.md) — FCM + `google-services.json`
- [store/play-console/SETUP.md](../store/play-console/SETUP.md) — Play listing + subscriptions
- [Firebase AdMob guide](https://firebase.google.com/docs/admob/android/quick-start)
