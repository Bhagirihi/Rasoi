import { db } from '@/lib/db';
import type { UserWithRelations } from '@/lib/db/types';
import { createSupabaseAdmin } from '@/lib/supabase-admin';
import { serializeUser } from '@/lib/serializers';

export async function exportUserData(userId: string) {
  const user = (await db.user.findUnique({
    where: { id: userId },
    include: {
      pushTokens: true,
      affiliateEvents: { orderBy: { createdAt: 'desc' }, take: 100 },
      sponsorEvents: { orderBy: { createdAt: 'desc' }, take: 100 },
      mealNotificationLogs: { orderBy: { sentAt: 'desc' }, take: 50 },
      feedback: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  })) as UserWithRelations | null;

  if (!user) return null;

  const pushTokens = user.pushTokens ?? [];

  return {
    exportedAt: new Date().toISOString(),
    profile: serializeUser(user),
    pushTokens: pushTokens.map((row) => ({
      platform: row.platform,
      active: row.active,
      createdAt: row.createdAt.toISOString(),
    })),
    affiliateEvents: user.affiliateEvents ?? [],
    sponsorEvents: user.sponsorEvents ?? [],
    mealNotificationLogs: user.mealNotificationLogs ?? [],
    feedback: user.feedback ?? [],
  };
}

export async function deleteUserAccount(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return false;

  if (user.supabaseUserId) {
    try {
      const supabase = createSupabaseAdmin();
      await supabase.auth.admin.deleteUser(user.supabaseUserId);
    } catch (error) {
      console.error('[deleteUserAccount] supabase delete failed', {
        userId: userId.slice(0, 8),
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Explicit child deletes: don't rely on FK ON DELETE CASCADE — the schema is
  // maintained by hand with no migration runner, so cascade behavior on prod
  // is unverified. Deleting children first is safe either way.
  await Promise.all([
    db.pushToken.deleteMany({ where: { userId } }),
    db.affiliateEvent.deleteMany({ where: { userId } }),
    db.sponsorEvent.deleteMany({ where: { userId } }),
    db.mealNotificationLog.deleteMany({ where: { userId } }),
    db.userFeedback.deleteMany({ where: { userId } }),
    db.promoRedemption.deleteMany({ where: { userId } }),
    db.userRecommendationCache.deleteMany({ where: { userId } }),
    db.userRecommendationHistory.deleteMany({ where: { userId } }),
    db.userRecipeView.deleteMany({ where: { userId } }),
    db.userRecipeCooked.deleteMany({ where: { userId } }),
  ]);

  await db.user.delete({ where: { id: userId } });
  return true;
}
