import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Encrypted key-value storage for secrets (auth tokens, sessions).
 *
 * SecureStore values are size-limited on Android, so values are transparently
 * chunked. Reads also fall back to legacy AsyncStorage values once, migrating
 * them into SecureStore on first access — existing installs upgrade silently.
 */

const CHUNK_SIZE = 1500;
const COUNT_SUFFIX = '.n';

async function readChunks(key: string): Promise<string | null> {
  const countRaw = await SecureStore.getItemAsync(key + COUNT_SUFFIX);
  if (countRaw == null) return null;
  const count = Number(countRaw);
  if (!Number.isInteger(count) || count <= 0) return null;
  let out = '';
  for (let i = 0; i < count; i++) {
    const part = await SecureStore.getItemAsync(`${key}.${i}`);
    if (part == null) return null;
    out += part;
  }
  return out;
}

async function writeChunks(key: string, value: string): Promise<void> {
  const count = Math.max(1, Math.ceil(value.length / CHUNK_SIZE));
  // Write chunks first, count last: a crash mid-write leaves the old count
  // pointing at the old (still valid) chunks.
  for (let i = 0; i < count; i++) {
    await SecureStore.setItemAsync(
      `${key}.${i}`,
      value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
    );
  }
  await SecureStore.setItemAsync(key + COUNT_SUFFIX, String(count));
  // Remove stale chunks left by a previously longer value.
  for (let i = count; ; i++) {
    const stale = await SecureStore.getItemAsync(`${key}.${i}`);
    if (stale == null) break;
    await SecureStore.deleteItemAsync(`${key}.${i}`);
  }
}

async function clearChunks(key: string): Promise<void> {
  const countRaw = await SecureStore.getItemAsync(key + COUNT_SUFFIX);
  await SecureStore.deleteItemAsync(key + COUNT_SUFFIX);
  await SecureStore.deleteItemAsync(key);
  const count = Number(countRaw);
  if (Number.isInteger(count) && count > 0) {
    for (let i = 0; i < count + 8; i++) {
      await SecureStore.deleteItemAsync(`${key}.${i}`);
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

