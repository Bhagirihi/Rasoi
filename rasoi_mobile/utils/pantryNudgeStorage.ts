import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  formatDayKey,
  type PantryNudgeWindow,
} from '@/utils/pantryNudgeWindows';

const STORAGE_KEY = '@rasoi/pantry_nudge_shown';

type StoredPantryNudge = {
  date: string;
  windows: PantryNudgeWindow[];
};

async function readStored(): Promise<StoredPantryNudge> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: formatDayKey(), windows: [] };
    const parsed = JSON.parse(raw) as StoredPantryNudge;
    if (!parsed?.date || !Array.isArray(parsed.windows)) {
      return { date: formatDayKey(), windows: [] };
    }
    return parsed;
  } catch {
    return { date: formatDayKey(), windows: [] };
  }
}

export async function wasPantryNudgeShownForWindow(
  window: PantryNudgeWindow,
): Promise<boolean> {
  const today = formatDayKey();
  const stored = await readStored();
  if (stored.date !== today) return false;
  return stored.windows.includes(window);
}

export async function markPantryNudgeShownForWindow(
  window: PantryNudgeWindow,
): Promise<void> {
  const today = formatDayKey();
  const stored = await readStored();
  const windows =
    stored.date === today
      ? Array.from(new Set([...stored.windows, window]))
      : [window];

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ date: today, windows } satisfies StoredPantryNudge),
  );
}
