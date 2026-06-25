import { Linking } from 'react-native';

export type PartnerOpenResult = 'app' | 'web' | 'failed';

/** Opens partner app when installed, otherwise falls back to web checkout. */
export async function openPartnerUrls(
  deepLink: string,
  webUrl: string,
): Promise<PartnerOpenResult> {
  const trimmedDeep = deepLink.trim();
  const trimmedWeb = webUrl.trim();

  if (!trimmedDeep && !trimmedWeb) return 'failed';

  const isCustomScheme = trimmedDeep.length > 0 && !trimmedDeep.startsWith('http');

  if (isCustomScheme) {
    try {
      const canOpen = await Linking.canOpenURL(trimmedDeep);
      if (canOpen) {
        await Linking.openURL(trimmedDeep);
        return 'app';
      }
    } catch {
      // canOpenURL blocked or unavailable — try direct open below
    }

    try {
      await Linking.openURL(trimmedDeep);
      return 'app';
    } catch {
      // App not installed — fall through to web
    }
  } else if (trimmedDeep) {
    try {
      await Linking.openURL(trimmedDeep);
      return 'app';
    } catch {
      // Universal / app link failed — fall through to web
    }
  }

  if (trimmedWeb) {
    try {
      await Linking.openURL(trimmedWeb);
      return 'web';
    } catch {
      return 'failed';
    }
  }

  return 'failed';
}
