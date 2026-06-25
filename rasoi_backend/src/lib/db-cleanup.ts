import { queryPg } from '@/lib/db/pg';

/** Guests with no activity in this window are eligible for deletion. */
export const GUEST_INACTIVE_DAYS = 30;

/** Recommendation cache/history rows older than this are deleted. */
export const RECOMMENDATION_RETENTION_DAYS = 14;

export type DbCleanupResult = {
  ok: boolean;
  staleGuestsDeleted: number;
  recommendationCacheDeleted: number;
  recommendationHistoryDeleted: number;
  guestInactiveDays: number;
  recommendationRetentionDays: number;
  errors: string[];
};

function daysIntervalParam(days: number): string {
  return `${days} days`;
}

async function deleteStaleGuestUsers(inactiveDays: number): Promise<number> {
  const interval = daysIntervalParam(inactiveDays);
  const rows = await queryPg<{ id: string }>(
    `
      WITH stale AS (
        SELECT u.id
        FROM rasoi."User" u
        WHERE u."isGuest" = true
          AND u."createdAt" < NOW() - $1::interval
          AND COALESCE(u."updatedAt", u."createdAt") < NOW() - $1::interval
          AND NOT EXISTS (
            SELECT 1 FROM rasoi."PushToken" pt
            WHERE pt."userId" = u.id
              AND GREATEST(pt."updatedAt", pt."createdAt") >= NOW() - $1::interval
          )
          AND NOT EXISTS (
            SELECT 1 FROM rasoi."UserRecipeView" v
            WHERE v."userId" = u.id AND v."viewedAt" >= NOW() - $1::interval
          )
          AND NOT EXISTS (
            SELECT 1 FROM rasoi."UserRecipeCooked" c
            WHERE c."userId" = u.id AND c."cookedAt" >= NOW() - $1::interval
          )
          AND NOT EXISTS (
            SELECT 1 FROM rasoi."MealNotificationLog" m
            WHERE m."userId" = u.id AND m."sentAt" >= NOW() - $1::interval
          )
          AND NOT EXISTS (
            SELECT 1 FROM rasoi."UserRecommendationHistory" h
            WHERE h."userId" = u.id AND h."shownAt" >= NOW() - $1::interval
          )
          AND NOT EXISTS (
            SELECT 1 FROM rasoi."AffiliateEvent" a
            WHERE a."userId" = u.id AND a."createdAt" >= NOW() - $1::interval
          )
          AND NOT EXISTS (
            SELECT 1 FROM rasoi."SponsorEvent" s
            WHERE s."userId" = u.id AND s."createdAt" >= NOW() - $1::interval
          )
          AND NOT EXISTS (
            SELECT 1 FROM rasoi."UserFeedback" f
            WHERE f."userId" = u.id AND f."createdAt" >= NOW() - $1::interval
          )
      )
      DELETE FROM rasoi."User" u
      WHERE u.id IN (SELECT id FROM stale)
      RETURNING u.id
    `,
    [interval],
  );

  return rows.length;
}

async function deleteStaleRecommendationCache(retentionDays: number): Promise<number> {
  const interval = daysIntervalParam(retentionDays);
  const rows = await queryPg<{ id: string }>(
    `
      DELETE FROM rasoi."UserRecommendationCache"
      WHERE "generatedAt" < NOW() - $1::interval
      RETURNING id
    `,
    [interval],
  );

  return rows.length;
}

async function deleteStaleRecommendationHistory(retentionDays: number): Promise<number> {
  const interval = daysIntervalParam(retentionDays);
  const rows = await queryPg<{ id: string }>(
    `
      DELETE FROM rasoi."UserRecommendationHistory"
      WHERE "shownAt" < NOW() - $1::interval
      RETURNING id
    `,
    [interval],
  );

  return rows.length;
}

export async function runDbCleanup(): Promise<DbCleanupResult> {
  const errors: string[] = [];
  let staleGuestsDeleted = 0;
  let recommendationCacheDeleted = 0;
  let recommendationHistoryDeleted = 0;

  try {
    staleGuestsDeleted = await deleteStaleGuestUsers(GUEST_INACTIVE_DAYS);
  } catch (error) {
    errors.push(
      `guest cleanup: ${error instanceof Error ? error.message : 'unknown error'}`,
    );
  }

  try {
    recommendationCacheDeleted = await deleteStaleRecommendationCache(
      RECOMMENDATION_RETENTION_DAYS,
    );
  } catch (error) {
    errors.push(
      `recommendation cache cleanup: ${error instanceof Error ? error.message : 'unknown error'}`,
    );
  }

  try {
    recommendationHistoryDeleted = await deleteStaleRecommendationHistory(
      RECOMMENDATION_RETENTION_DAYS,
    );
  } catch (error) {
    errors.push(
      `recommendation history cleanup: ${error instanceof Error ? error.message : 'unknown error'}`,
    );
  }

  return {
    ok: errors.length === 0,
    staleGuestsDeleted,
    recommendationCacheDeleted,
    recommendationHistoryDeleted,
    guestInactiveDays: GUEST_INACTIVE_DAYS,
    recommendationRetentionDays: RECOMMENDATION_RETENTION_DAYS,
    errors,
  };
}
