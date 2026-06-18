import { prisma } from '@/lib/prisma';

export type FeedbackListItem = Awaited<ReturnType<typeof getFeedbackList>>[number];

export async function getFeedbackStats() {
  const [pendingCount, issueCount, suggestionCount, totalCount] = await Promise.all([
    prisma.userFeedback.count({ where: { status: 'pending' } }),
    prisma.userFeedback.count({ where: { category: 'issue' } }),
    prisma.userFeedback.count({ where: { category: 'suggestion' } }),
    prisma.userFeedback.count(),
  ]);

  return {
    pendingCount,
    issueCount,
    suggestionCount,
    totalCount,
  };
}

export async function getFeedbackList(limit = 200) {
  return prisma.userFeedback.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });
}

export async function getRecentPendingFeedback(limit = 5) {
  return prisma.userFeedback.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });
}
