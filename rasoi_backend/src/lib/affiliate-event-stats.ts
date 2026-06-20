import { prisma } from '@/lib/prisma';

export type AffiliateEventListItem = Awaited<ReturnType<typeof getAffiliateEventList>>[number];

export async function getAffiliateEventStats(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [totalCount, sponsorRailCount, groceryCount, foodCount, uniqueUsers] = await Promise.all([
    prisma.affiliateEvent.count({ where: { createdAt: { gte: since } } }),
    prisma.affiliateEvent.count({
      where: { createdAt: { gte: since }, context: 'sponsor_rail' },
    }),
    prisma.affiliateEvent.count({
      where: {
        createdAt: { gte: since },
        context: { in: ['grocery_checkout', 'brand_search', 'sponsor_rail'] },
      },
    }),
    prisma.affiliateEvent.count({
      where: { createdAt: { gte: since }, context: 'food_delivery' },
    }),
    prisma.affiliateEvent.findMany({
      where: { createdAt: { gte: since }, userId: { not: null } },
      distinct: ['userId'],
      select: { userId: true },
    }),
  ]);

  return {
    totalCount,
    sponsorRailCount,
    groceryCount,
    foodCount,
    uniqueUserCount: uniqueUsers.length,
    days,
  };
}

export async function getAffiliateEventList(limit = 200) {
  return prisma.affiliateEvent.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          city: true,
          state: true,
        },
      },
    },
  });
}
