import AsyncStorage from '@react-native-async-storage/async-storage';

import type { UserProfileResponse } from '@/types/api';

const CACHE_KEY = '@rasoi/cached_user_profile';

export async function saveCachedUserProfile(user: UserProfileResponse): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(user));
}

export async function loadCachedUserProfile(): Promise<UserProfileResponse | null> {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserProfileResponse;
  } catch {
    await AsyncStorage.removeItem(CACHE_KEY);
    return null;
  }
}

export async function clearCachedUserProfile(): Promise<void> {
  await AsyncStorage.removeItem(CACHE_KEY);
}
