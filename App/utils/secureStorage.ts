import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Encrypted key-value storage for secrets (auth tokens, sessions).
 *
 * SecureStore values are size-limited on Android, so values are transparently
 * chunked. Reads also fall back to legacy AsyncStorage values once, migrating
 * them into SecureStore on first access — existing installs upgrade silently.
 *
 * Expo SecureStore only allows alphanumeric characters plus ".", "-", "_".
 * Logical keys like `@rasoi/auth_token` are sanitized before SecureStore I/O;
 * AsyncStorage legacy paths still use the original key.
 */

const CHUNK_SIZE = 1500;
const COUNT_SUFFIX = '.n';

/** Survives force-stop / process death better than WHEN_UNLOCKED on Android. */
const SECURE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

/** Map any storage key to a SecureStore-safe identifier. */
function secureKey(key: string): string {
  const sanitized = key.replace(/[^a-zA-Z0-9._-]/g, '_');
  return sanitized.length > 0 ? sanitized : 'rasoi_secure';
}

async function readChunks(key: string): Promise<string | null> {
  const sk = secureKey(key);
  const countRaw = await SecureStore.getItemAsync(sk + COUNT_SUFFIX, SECURE_OPTIONS);
  if (countRaw == null) return null;
  const count = Number(countRaw);
  if (!Number.isInteger(count) || count <= 0) return null;
  let out = '';
  for (let i = 0; i < count; i++) {
    const part = await SecureStore.getItemAsync(`${sk}.${i}`, SECURE_OPTIONS);
    if (part == null) return null;
    out += part;
  }
  return out;
}

async function writeChunks(key: string, value: string): Promise<void> {
  const sk = secureKey(key);
  const count = Math.max(1, Math.ceil(value.length / CHUNK_SIZE));
  // Write chunks first, count last: a crash mid-write leaves the old count
  // pointing at the old (still valid) chunks.
  for (let i = 0; i < count; i++) {
    await SecureStore.setItemAsync(
      `${sk}.${i}`,
      value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
      SECURE_OPTIONS,
    );
  }
  await SecureStore.setItemAsync(sk + COUNT_SUFFIX, String(count), SECURE_OPTIONS);
  // Remove stale chunks left by a previously longer value.
  for (let i = count; ; i++) {
    const stale = await SecureStore.getItemAsync(`${sk}.${i}`, SECURE_OPTIONS);
    if (stale == null) break;
    await SecureStore.deleteItemAsync(`${sk}.${i}`, SECURE_OPTIONS);
  }
}

async function clearChunks(key: string): Promise<void> {
  const sk = secureKey(key);
  const countRaw = await SecureStore.getItemAsync(sk + COUNT_SUFFIX, SECURE_OPTIONS);
  await SecureStore.deleteItemAsync(sk + COUNT_SUFFIX, SECURE_OPTIONS);
  await SecureStore.deleteItemAsync(sk, SECURE_OPTIONS);
  const count = Number(countRaw);
  if (Number.isInteger(count) && count > 0) {
    for (let i = 0; i < count + 8; i++) {
      await SecureStore.deleteItemAsync(`${sk}.${i}`, SECURE_OPTIONS);
    }
  }
}

export async function getSecureItem(key: string): Promise<string | null> {
  const secure = await readChunks(key);
  if (secure !== null) return secure;
  // One-time migration from the old unencrypted AsyncStorage location.
  const legacy = await AsyncStorage.getItem(key);
  if (legacy !== null) {
    await writeChunks(key, legacy);
    await AsyncStorage.removeItem(key);
    return legacy;
  }
  return null;
}

export async function setSecureItem(key: string, value: string): Promise<void> {
  await writeChunks(key, value);
}

export async function removeSecureItem(key: string): Promise<void> {
  await clearChunks(key);
  // Also clear any legacy unencrypted copy.
  await AsyncStorage.removeItem(key);
}
