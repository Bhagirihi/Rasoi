import { existsSync } from 'fs';
import type { ExpoConfig } from 'expo/config';

import appJson from './app.json';
import {
  ADMOB_ANDROID_APP_ID,
  ADMOB_IOS_APP_ID,
} from './constants/admobAppIds.js';

const base = appJson.expo as ExpoConfig;

const easProjectId =
  process.env.EXPO_PUBLIC_EAS_PROJECT_ID?.trim() ||
  process.env.EAS_PROJECT_ID?.trim() ||
  (typeof base.extra === 'object' && base.extra && 'eas' in base.extra
    ? (base.extra as { eas?: { projectId?: string } }).eas?.projectId?.trim()
    : '') ||
  '';

const googleServicesPath = './google-services.json';
const easGoogleServicesPath = process.env.GOOGLE_SERVICES_JSON?.trim();
const hasGoogleServices =
  existsSync(googleServicesPath) ||
  (easGoogleServicesPath ? existsSync(easGoogleServicesPath) : false);

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

function withAdMobPlugin(plugins: ExpoConfig['plugins']): ExpoConfig['plugins'] {
  if (!plugins) return plugins;
  return plugins.map((plugin) => {
    if (Array.isArray(plugin) && plugin[0] === 'react-native-google-mobile-ads') {
      return [
        plugin[0],
        {
          ...(typeof plugin[1] === 'object' && plugin[1] ? plugin[1] : {}),
          androidAppId: ADMOB_ANDROID_APP_ID,
          iosAppId: ADMOB_IOS_APP_ID,
        },
      ] as typeof plugin;
    }
    return plugin;
  });
}

function withFirebasePlugins(plugins: ExpoConfig['plugins']): ExpoConfig['plugins'] {
  const existing = plugins ?? [];
  const pluginId = (entry: NonNullable<ExpoConfig['plugins']>[number]) =>
    Array.isArray(entry) ? entry[0] : entry;

  if (!hasGoogleServices || existing.some((entry) => pluginId(entry) === '@react-native-firebase/app')) {
    return existing;
  }

  return [
    ...existing,
    '@react-native-firebase/app',
    '@react-native-firebase/crashlytics',
    [
      '@react-native-firebase/analytics',
      {
        ios: {
          withoutAdIdSupport: true,
        },
      },
    ],
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
          forceStaticLinking: ['RNFBApp', 'RNFBAnalytics', 'RNFBCrashlytics'],
        },
      },
    ],
  ];
}

export default (): ExpoConfig => ({
  ...base,
  plugins: withFirebasePlugins(withAdMobPlugin(base.plugins)),
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
