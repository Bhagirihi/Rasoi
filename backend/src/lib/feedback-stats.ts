import { db } from '@/lib/db';
import type { UserFeedbackWithUser } from '@/lib/db/types';

export type FeedbackListItem = UserFeedbackWithUser;

export async function getFeedbackStats() {
  const [pendingCount, issueCount, suggestionCount, totalCount] = await Promise.all([
    db.userFeedback.count({ where: { status: 'pending' } }),
    db.userFeedback.count({ where: { category: 'issue' } }),
    db.userFeedback.count({ where: { category: 'suggestion' } }),
    db.userFeedback.count(),
  ]);

  return {
    pendingCount,
    issueCount,
    suggestionCount,
    totalCount,
  };
}

export async function getFeedbackList(limit = 200): Promise<UserFeedbackWithUser[]> {
  return db.userFeedback.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  }) as Promise<UserFeedbackWithUser[]>;
}

export async function getRecentPendingFeedback(limit = 5): Promise<UserFeedbackWithUser[]> {
  return db.userFeedback.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: { name: true, email: true, phone: true },
      },
    },
  }) as Promise<UserFeedbackWithUser[]>;
}
