import { existsSync } from 'fs';
import type { ExpoConfig } from 'expo/config';

import appJson from './app.json';

const base = appJson.expo as ExpoConfig;

const easProjectId =
  process.env.EXPO_PUBLIC_EAS_PROJECT_ID?.trim() ||
  process.env.EAS_PROJECT_ID?.trim() ||
  (typeof base.extra === 'object' && base.extra && 'eas' in base.extra
    ? (base.extra as { eas?: { projectId?: string } }).eas?.projectId?.trim()
    : '') ||
  '';

const googleServicesPath = './google-services.json';
const hasGoogleServices = existsSync(googleServicesPath);

if (!easProjectId) {
  console.warn(
    '[rasoi] EXPO_PUBLIC_EAS_PROJECT_ID is not set — Expo push tokens will fail on release builds. Run: npm run setup:push',
  );
}

if (!hasGoogleServices) {
  console.warn(
    '[rasoi] google-services.json missing — Android FCM push will not work until Firebase is configured. See docs/PUSH_SETUP.md',
  );
}

export default (): ExpoConfig => ({
  ...base,
  extra: {
    ...base.extra,
    eas: {
      ...(typeof base.extra === 'object' && base.extra && 'eas' in base.extra
        ? (base.extra as { eas?: Record<string, string> }).eas
        : {}),
      ...(easProjectId ? { projectId: easProjectId } : {}),
    },
  },
  android: {
    ...base.android,
    ...(hasGoogleServices ? { googleServicesFile: googleServicesPath } : {}),
  },
});
