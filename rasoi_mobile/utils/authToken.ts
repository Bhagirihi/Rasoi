import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@rasoi/auth_token';
const RASOI_USER_ID_KEY = '@rasoi/user_id';
const LOGGED_OUT_KEY = '@rasoi/user_logged_out';

/** In-memory cache avoids repeated AsyncStorage reads on every API call. */
let tokenCache: string | null | undefined;
let rasoiUserIdCache: string | null | undefined;

export async function getAuthToken(): Promise<string | null> {
  if (tokenCache !== undefined) {
    return tokenCache;
  }
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  tokenCache = token;
  return token;
}

export async function saveAuthToken(token: string): Promise<void> {
  tokenCache = token;
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  await AsyncStorage.removeItem(LOGGED_OUT_KEY);
}

/** Persist token without blocking the auth critical path (memory cache is updated first). */
export function persistAuthToken(token: string): void {
  tokenCache = token;
  void AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  void AsyncStorage.removeItem(LOGGED_OUT_KEY);
}

export async function clearAuthToken(): Promise<void> {
  tokenCache = null;
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}

export function saveRasoiUserId(userId: string): void {
  rasoiUserIdCache = userId;
  void AsyncStorage.setItem(RASOI_USER_ID_KEY, userId);
}

export async function getRasoiUserId(): Promise<string | null> {
  if (rasoiUserIdCache !== undefined) {
    return rasoiUserIdCache;
  }
  const userId = await AsyncStorage.getItem(RASOI_USER_ID_KEY);
  rasoiUserIdCache = userId;
  return userId;
}

export async function clearRasoiUserId(): Promise<void> {
  rasoiUserIdCache = null;
  await AsyncStorage.removeItem(RASOI_USER_ID_KEY);
}

/** Set when the user explicitly logs out — blocks Supabase session auto-restore on next launch. */
export async function markUserLoggedOut(): Promise<void> {
  await AsyncStorage.setItem(LOGGED_OUT_KEY, 'true');
}

export async function clearUserLoggedOut(): Promise<void> {
  await AsyncStorage.removeItem(LOGGED_OUT_KEY);
}

export async function isUserLoggedOut(): Promise<boolean> {
  return (await AsyncStorage.getItem(LOGGED_OUT_KEY)) === 'true';
}
