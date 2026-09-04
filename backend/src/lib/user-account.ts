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

  await db.user.delete({ where: { id: userId } });
  return true;
}
