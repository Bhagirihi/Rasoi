import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = '@rasoi/device_id';

function createDeviceId(): string {
  return `rasoi_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function getOrCreateDeviceId(): Promise<string> {
  try {
    const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (existing?.trim()) return existing.trim();
  } catch {
    // fall through
  }

  const id = createDeviceId();
  try {
    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  } catch {
    // non-fatal
  }
  return id;
}
