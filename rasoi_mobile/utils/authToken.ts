import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@rasoi/auth_token';

/** In-memory cache avoids repeated AsyncStorage reads on every API call. */
let tokenCache: string | null | undefined;

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
}

export async function clearAuthToken(): Promise<void> {
  tokenCache = null;
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}
