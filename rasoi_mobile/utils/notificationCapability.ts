import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

export function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

/** Expo push tokens for server-sent meal picks — unavailable in Expo Go on Android (SDK 53+). */
export function isRemotePushAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  if (Platform.OS === 'android' && isExpoGo()) return false;
  return true;
}
