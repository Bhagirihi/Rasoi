import AsyncStorage from '@react-native-async-storage/async-storage';

type ShuffleKind = 'home' | 'plan';

const KEYS: Record<ShuffleKind, string> = {
  home: '@rasoi/shuffle_quota_home',
  plan: '@rasoi/shuffle_quota_plan',
};

type ShuffleQuotaRecord = {
  dateKey: string;
  count: number;
};

function todayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

async function readRecord(kind: ShuffleKind): Promise<ShuffleQuotaRecord> {
  const raw = await AsyncStorage.getItem(KEYS[kind]);
  if (!raw) return { dateKey: '', count: 0 };
  try {
    const parsed = JSON.parse(raw) as ShuffleQuotaRecord;
    if (typeof parsed.dateKey === 'string' && typeof parsed.count === 'number') {
      return parsed;
    }
  } catch {
    // ignore corrupt storage
  }
  return { dateKey: '', count: 0 };
}

async function writeRecord(kind: ShuffleKind, record: ShuffleQuotaRecord): Promise<void> {
  await AsyncStorage.setItem(KEYS[kind], JSON.stringify(record));
}

export async function getShuffleUsage(
  kind: ShuffleKind,
  now = new Date(),
): Promise<number> {
  const record = await readRecord(kind);
  const key = todayKey(now);
  return record.dateKey === key ? record.count : 0;
}

export async function canUseShuffle(
  kind: ShuffleKind,
  dailyLimit: number | null,
  now = new Date(),
): Promise<{ allowed: boolean; remaining: number | null; used: number }> {
  if (dailyLimit === null) {
    return { allowed: true, remaining: null, used: 0 };
  }
  if (dailyLimit <= 0) {
    return { allowed: false, remaining: 0, used: 0 };
  }

  const used = await getShuffleUsage(kind, now);
  const remaining = Math.max(0, dailyLimit - used);
  return { allowed: remaining > 0, remaining, used };
}

export async function recordShuffle(kind: ShuffleKind, now = new Date()): Promise<void> {
  const key = todayKey(now);
  const record = await readRecord(kind);
  const count = record.dateKey === key ? record.count + 1 : 1;
  await writeRecord(kind, { dateKey: key, count });
}
