import { Platform } from 'react-native';

import { getAuthToken } from '@/utils/authToken';
import { getSupabaseSession } from '@/services/supabaseAuth';
import { addSentryBreadcrumb, captureException } from '@/utils/sentry';

function devApiDefault(): string {
  return 'http://192.168.1.27:3000';
}

/** Android emulator reaches the host via 10.0.2.2, not a LAN IP from .env. */
function isAndroidEmulator(): boolean {
  if (Platform.OS !== 'android') return false;

  const constants = Platform.constants as {
    Brand?: string;
    Model?: string;
    Fingerprint?: string;
    Manufacturer?: string;
  };

  const model = (constants.Model ?? '').toLowerCase();
  const fingerprint = (constants.Fingerprint ?? '').toLowerCase();
  const brand = (constants.Brand ?? '').toLowerCase();
  const manufacturer = (constants.Manufacturer ?? '').toLowerCase();

  if (model.includes('emulator') || model.includes('sdk_gphone') || model.includes('sdk_google')) {
    return true;
  }

  if (fingerprint.includes('generic') || fingerprint.includes('unknown')) {
    return true;
  }

  if (brand === 'google' && (model.includes('sdk') || manufacturer === 'google')) {
    return true;
  }

  // Expo Go on physical hardware often reports isDevice=false; do not treat that as emulator.
  return false;
}

function resolveDevApiUrl(configured?: string): string {
  const base = (configured?.trim() || devApiDefault()).replace(/\/$/, '');

  if (isAndroidEmulator()) {
    try {
      const parsed = new URL(base);
      parsed.hostname = '10.0.2.2';
      return parsed.origin;
    } catch {
      return 'http://10.0.2.2:3000';
    }
  }

  return base;
}

const PROD_API_URL = 'https://rasoiapplication.in';

/** Legacy deploy hostnames still baked into older APK builds. */
const LEGACY_API_HOSTS = new Set(['rasoiapp.vercel.app', 'www.rasoiapp.vercel.app']);

function normalizeProductionApiUrl(raw: string): string {
  const trimmed = raw.replace(/\/$/, '');
  try {
    const parsed = new URL(trimmed);
    if (LEGACY_API_HOSTS.has(parsed.hostname)) {
      return PROD_API_URL;
    }
    return parsed.origin;
  } catch {
    return PROD_API_URL;
  }
}

export function getApiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (__DEV__) {
    return normalizeProductionApiUrl(resolveDevApiUrl(configured));
  }

  return normalizeProductionApiUrl(configured ?? PROD_API_URL);
}

/** User-facing copy — never expose internal URLs or hostnames. */
export function formatUserFacingApiError(error: unknown, fallback = 'Something went wrong'): string {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (
    lower.includes('network request failed') ||
    lower.includes('failed to fetch') ||
    lower.includes('network error') ||
    lower.includes('internet connection') ||
    lower.includes('timeout') ||
    lower.includes('timed out') ||
    lower.includes('enotfound') ||
    lower.includes('econnrefused')
  ) {
    return 'No internet connection. Check your network and try again.';
  }

  if (lower.includes('non-json') || lower.includes('html — is the backend deployed')) {
    return 'Rasoi servers are temporarily unavailable. Please try again in a moment.';
  }

  if (lower.includes('unauthorized') || lower.includes('not authenticated')) {
    return 'Your session expired. Please sign in again.';
  }

  // Strip accidental URL suffixes from older builds.
  const withoutUrl = message.replace(/\s*\(https?:\/\/[^\s)]+\)\s*$/, '').trim();
  if (withoutUrl.length > 0 && !withoutUrl.startsWith('http')) {
    return withoutUrl;
  }

  return fallback;
}

export type ApiEnvelope<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export type ApiFetchOptions = {
  /** Abort the request after this many milliseconds (shows a friendly timeout error). */
  timeoutMs?: number;
};

let apiWarmPromise: Promise<void> | null = null;

/** Wake the backend while the user reads the OTP email (reduces cold-start delay on verify). */
export function warmApiConnection(): void {
  if (apiWarmPromise) return;

  const url = `${getApiBaseUrl()}/api/recipes`;
  apiWarmPromise = fetch(url, { headers: { Accept: 'application/json' } })
    .then(() => undefined)
    .catch(() => undefined);
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  options?: ApiFetchOptions,
): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;

  const controller = options?.timeoutMs ? new AbortController() : null;
  const timeoutId =
    controller && options?.timeoutMs
      ? setTimeout(() => controller.abort(), options.timeoutMs)
      : null;

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller?.signal ?? init?.signal,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    });

    const raw = await response.text();
    let payload: ApiEnvelope<T>;

    try {
      payload = JSON.parse(raw) as ApiEnvelope<T>;
    } catch {
      const snippet = raw.trim().slice(0, 80).replace(/\s+/g, ' ');
      throw new Error(
        response.ok
          ? `Server returned non-JSON from ${path}`
          : `API error ${response.status} on ${path}${snippet.startsWith('<!') ? ' (HTML — is the backend deployed?)' : ''}`,
      );
    }

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error ?? `Request failed (${response.status})`);
    }

    if (payload.data === undefined) {
      throw new Error('API returned no data');
    }

    return payload.data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Check your connection and try again.');
    }

    const isNonCriticalPath =
      path.includes('/api/sponsor-events') ||
      path.includes('/api/affiliate-events') ||
      path.includes('/api/recipe-searches') ||
      path.includes('/api/users/me/location');

    if (!isNonCriticalPath) {
      captureException(error, {
        url,
        method: init?.method ?? 'GET',
      });
      if (error instanceof Error) {
        addSentryBreadcrumb('API request failed', 'api', {
          url,
          method: init?.method ?? 'GET',
          message: error.message,
        });
      }
    }
    throw error;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

async function getRequestAuthorization(): Promise<string | null> {
  const session = await getSupabaseSession();
  if (session?.access_token) {
    return `Bearer ${session.access_token}`;
  }

  const token = await getAuthToken();
  return token ? `Bearer ${token}` : null;
}

export async function authApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const authorization = await getRequestAuthorization();
  if (!authorization) {
    throw new Error('Not authenticated');
  }

  return apiFetch<T>(path, {
    ...init,
    headers: {
      Authorization: authorization,
      ...init?.headers,
    },
  });
}

export async function optionalAuthApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const authorization = await getRequestAuthorization();
  return apiFetch<T>(path, {
    ...init,
    headers: authorization
      ? {
          Authorization: authorization,
          ...init?.headers,
        }
      : init?.headers,
  });
}
