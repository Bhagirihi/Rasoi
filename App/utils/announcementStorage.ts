import AsyncStorage from '@react-native-async-storage/async-storage';

const seenKey = (campaignKey: string) => `@rasoi/announcement_seen_${campaignKey}`;

export async function wasAnnouncementSeen(campaignKey: string): Promise<boolean> {
  const stored = await AsyncStorage.getItem(seenKey(campaignKey));
  return stored === '1';
}

export async function markAnnouncementSeen(campaignKey: string): Promise<void> {
  await AsyncStorage.setItem(seenKey(campaignKey), '1');
}
