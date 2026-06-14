import { Platform } from 'react-native';

import { getAuthToken } from '@/utils/authToken';

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

const PROD_API_URL = 'https://rasoiapp.vercel.app';

export function getApiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (__DEV__) {
    return resolveDevApiUrl(configured);
  }

  return (configured ?? PROD_API_URL).replace(/\/$/, '');
}

export type ApiEnvelope<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error ?? `Request failed (${response.status})`);
  }

  if (payload.data === undefined) {
    throw new Error('API returned no data');
  }

  return payload.data;
}

export async function authApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  return apiFetch<T>(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });
}

export async function optionalAuthApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAuthToken();
  return apiFetch<T>(path, {
    ...init,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          ...init?.headers,
        }
      : init?.headers,
  });
}
