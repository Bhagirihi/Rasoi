# Rotate FCM / Firebase Admin key (required)

`App/fcm-service-account.json` contained a live private key and was **removed from the tree**.

Treat that key as **compromised** until you rotate it in Google Cloud / Firebase.

## Do this now

1. Open [Google Cloud Console → IAM → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) for project `rasoi-app-prod` (or your current Firebase project).
2. Find the Firebase Admin / FCM service account used for push.
3. **Keys → Add key** (JSON) for a new key, then **delete / disable the old key** that lived in this repo.
4. Save the new JSON **only** as a local file (never commit):

```bash
cp fcm-service-account.json.example fcm-service-account.json
# paste the new key contents into fcm-service-account.json
```

5. Upload to EAS secrets for production builds (do not commit):

```bash
# Example — adjust to your upload script / EAS secret name
npx eas secret:create --scope project --name FCM_SERVICE_ACCOUNT_JSON --type string --value "$(cat fcm-service-account.json)"
```

6. Confirm `fcm-service-account.json` is listed in `App/.gitignore`.

## Verify

- Local file exists for backend/cron that needs Admin SDK.
- `git status` does **not** show `fcm-service-account.json` as staged.
- Old key is disabled in Cloud Console.
