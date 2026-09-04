import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

const ANDROID_PACKAGE =
  Constants.expoConfig?.android?.package ?? 'com.bhagihiri.rasoiapp';

const IOS_APP_STORE_ID = process.env.EXPO_PUBLIC_IOS_APP_STORE_ID?.trim() ?? '';

export function getPlayStoreListingUrl(): string {
  return `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
}

export function getAppStoreListingUrl(): string {
  if (IOS_APP_STORE_ID) {
    return `https://apps.apple.com/app/id${IOS_APP_STORE_ID}`;
  }
  return 'https://apps.apple.com/search?term=Rasoi%20recipe%20app';
}

export function getStoreListingUrl(): string {
  return Platform.OS === 'ios' ? getAppStoreListingUrl() : getPlayStoreListingUrl();
}

export async function isNativeStoreReviewAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  try {
    const StoreReview = await import('expo-store-review');
    return StoreReview.isAvailableAsync();
  } catch {
    return false;
  }
}

/** Opens the platform in-app review sheet, or falls back to the public store listing. */
export async function submitAppStoreRating(): Promise<'native' | 'store' | 'unavailable'> {
  if (Platform.OS === 'web') {
    return 'unavailable';
  }

  try {
    const StoreReview = await import('expo-store-review');
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
      return 'native';
    }
  } catch {
    // Fall through to store listing.
  }

  const url = getStoreListingUrl();
  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    return 'unavailable';
  }

  await Linking.openURL(url);
  return 'store';
}
