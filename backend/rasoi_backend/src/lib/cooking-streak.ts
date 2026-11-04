import { db } from '@/lib/db';
import { getLocalTimeParts } from '@/lib/meal-time';

export interface CookingStreak {
  /** Consecutive cooked days ending today, or yesterday if today has no cook yet. */
  current: number;
  cookedToday: boolean;
  lastCookedDay: string | null;
}

/** User timezone, defaulting to Asia/Kolkata like the meal-notification code. */
export function resolveTimezone(timezone: string | null | undefined): string {
  const tz = timezone?.trim();
  return tz || 'Asia/Kolkata';
}

function prevDayKey(dayKey: string): string {
  const [year, month, day] = dayKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

/**
 * Record that the user cooked on a day. Idempotent: re-cooking (or the
 * auto-log from finishing cook mode plus the "I cooked this" button) on the
 * same day upserts the same (userId, dayKey) row.
 *
 * This is deliberately separate from UserRecipeCooked, which upserts per
 * user+recipe: cooking the same recipe on consecutive days would collapse
 * into one row there and undercount the streak.
 */
export async function recordCookDay(userId: string, dayKey: string): Promise<void> {
  await db.cookDay.upsert({
    where: { userId_dayKey: { userId, dayKey } },
    create: { userId, dayKey, cookedAt: new Date() },
    update: { cookedAt: new Date() },
  });
}

export async function getCookingStreak(
  userId: string,
  timezone: string,
  now = new Date(),
): Promise<CookingStreak> {
  const rows = await db.cookDay.findMany({
    where: { userId },
    orderBy: { dayKey: 'desc' },
    take: 500,
  });

  const days = new Set(rows.map((row) => row.dayKey));
  const { dayKey: today } = getLocalTimeParts(timezone, now);
  const cookedToday = days.has(today);

  // A day with no cook yet breaks the chain, but "today" hasn't happened
  // yet in the morning — so count back from yesterday when today is empty.
  let cursor = cookedToday ? today : prevDayKey(today);
  if (!days.has(cursor)) {
    return { current: 0, cookedToday, lastCookedDay: rows[0]?.dayKey ?? null };
  }

  let current = 0;
  while (days.has(cursor)) {
    current += 1;
    cursor = prevDayKey(cursor);
  }

  return { current, cookedToday, lastCookedDay: rows[0]?.dayKey ?? null };
}
