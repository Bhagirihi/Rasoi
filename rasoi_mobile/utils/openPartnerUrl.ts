import { Linking } from 'react-native';

export type PartnerOpenResult = 'app' | 'web' | 'failed';

/**
 * Allowlist for partner deep-link schemes. URLs come from server-cached
 * partner data, so a compromised backend response must not be able to open
 * arbitrary schemes (intent://, etc.) or phishing URLs.
 */
const ALLOWED_CUSTOM_SCHEMES = new Set(['zomato', 'swiggy', 'blinkit', 'zepto']);

function schemeOf(url: string): string | null {
  const match = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.exec(url);
  return match ? match[0].slice(0, -1).toLowerCase() : null;
}

function isAllowedUrl(url: string): boolean {
  const scheme = schemeOf(url);
  if (!scheme) return false;
  if (scheme === 'https') return true;
  if (scheme === 'http') return true;
  return ALLOWED_CUSTOM_SCHEMES.has(scheme);
}

/** Opens partner app when installed, otherwise falls back to web checkout. */
export async function openPartnerUrls(
  deepLink: string,
  webUrl: string,
): Promise<PartnerOpenResult> {
  const trimmedDeep = deepLink.trim();
  const trimmedWeb = webUrl.trim();

  if (!trimmedDeep && !trimmedWeb) return 'failed';

  // Reject anything outside the allowlist before touching Linking.
  const safeDeep = trimmedDeep && isAllowedUrl(trimmedDeep) ? trimmedDeep : '';
  const safeWeb = trimmedWeb && isAllowedUrl(trimmedWeb) ? trimmedWeb : '';
  if (!safeDeep && !safeWeb) return 'failed';

  const isCustomScheme = safeDeep.length > 0 && !safeDeep.startsWith('http');

  if (isCustomScheme) {
    try {
      const canOpen = await Linking.canOpenURL(safeDeep);
      if (canOpen) {
        await Linking.openURL(safeDeep);
        return 'app';
      }
    } catch {
      // canOpenURL blocked or unavailable — try direct open below
    }

    try {
      await Linking.openURL(safeDeep);
      return 'app';
    } catch {
      // App not installed — fall through to web
    }
  } else if (safeDeep) {
    try {
      await Linking.openURL(safeDeep);
      return 'app';
    } catch {
      // Universal / app link failed — fall through to web
    }
  }

  if (safeWeb) {
    try {
      await Linking.openURL(safeWeb);
      return 'web';
    } catch {
      return 'failed';
    }
  }

  return 'failed';
}
