import { NextRequest } from 'next/server';

import { isAuthorizedCronRequest } from '@/lib/cron-auth';
import { jsonError, jsonOk } from '@/lib/api';
import { runMealNotifications } from '@/lib/meal-notifications';
import { MEAL_SLOTS, type MealSlot } from '@/lib/meal-time';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function parseForceSlot(value: string | null): MealSlot | undefined {
  if (!value) return undefined;
  return MEAL_SLOTS.includes(value as MealSlot) ? (value as MealSlot) : undefined;
}

/**
 * Hourly cron: sends personalized meal push notifications (breakfast, lunch, snack, dinner, late-night)
 * to users with notificationsEnabled + active Expo push tokens.
 *
 * Production schedule: Supabase pg_cron — 5 daily jobs (`rasoi-push-*`), 2 hr before meal anchors.
 * Backup: GitHub Actions `.github/workflows/meal-notifications.yml` (manual dispatch only).
 * Vercel Hobby only supports daily crons, so meal pushes are not in vercel.json.
 *
 * Query (manual / staging):
 *   ?forceSlot=dinner — send dinner pick regardless of clock
 *   ?userId=...       — limit to one user
 *   ?dryRun=true      — pick recipes without sending push
 */
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return jsonError('Unauthorized', 401);
  }

  const { searchParams } = new URL(request.url);
  const forceSlot = parseForceSlot(searchParams.get('forceSlot'));
  const userId = searchParams.get('userId')?.trim() || undefined;
  const dryRun = searchParams.get('dryRun') === 'true';

  if (forceSlot === undefined && searchParams.get('forceSlot')) {
    return jsonError(`Invalid forceSlot. Use one of: ${MEAL_SLOTS.join(', ')}`, 400);
  }

  const result = await runMealNotifications({
    forceSlot,
    userId,
    dryRun,
  });

  return jsonOk(result, result.ok ? 200 : 207);
}
