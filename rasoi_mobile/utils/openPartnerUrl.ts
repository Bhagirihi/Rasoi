import { Linking } from 'react-native';

/** Opens partner app when installed, otherwise falls back to web checkout. */
export async function openPartnerUrls(deepLink: string, webUrl: string): Promise<void> {
  const trimmedDeep = deepLink.trim();
  const trimmedWeb = webUrl.trim();

  if (!trimmedDeep && !trimmedWeb) return;

  const isCustomScheme = trimmedDeep.length > 0 && !trimmedDeep.startsWith('http');

  if (isCustomScheme) {
    try {
      const canOpen = await Linking.canOpenURL(trimmedDeep);
      if (canOpen) {
        await Linking.openURL(trimmedDeep);
        return;
      }
    } catch {
      // canOpenURL blocked or unavailable — try direct open below
    }

    try {
      await Linking.openURL(trimmedDeep);
      return;
    } catch {
      // App not installed — fall through to web
    }
  } else if (trimmedDeep) {
    try {
      await Linking.openURL(trimmedDeep);
      return;
    } catch {
      // Universal / app link failed — fall through to web
    }
  }

  if (trimmedWeb) {
    await Linking.openURL(trimmedWeb);
  }
}
