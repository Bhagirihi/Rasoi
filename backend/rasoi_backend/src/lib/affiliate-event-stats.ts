import { db } from '@/lib/db';
import type { AffiliateEventWithUser } from '@/lib/db/types';

export type AffiliateEventListItem = AffiliateEventWithUser;

export async function getAffiliateEventStats(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [totalCount, sponsorRailCount, groceryCount, foodCount, userRows] = await Promise.all([
    db.affiliateEvent.count({ where: { createdAt: { gte: since } } }),
    db.affiliateEvent.count({
      where: { createdAt: { gte: since }, context: 'sponsor_rail' },
    }),
    db.affiliateEvent.count({
      where: {
        createdAt: { gte: since },
        context: { in: ['grocery_checkout', 'brand_search', 'sponsor_rail'] },
      },
    }),
    db.affiliateEvent.count({
      where: { createdAt: { gte: since }, context: 'food_delivery' },
    }),
    db.affiliateEvent.findMany({
      where: { createdAt: { gte: since }, userId: { not: null } },
      select: { userId: true },
    }),
  ]);

  const uniqueUserCount = new Set(
    userRows.map((row) => row.userId).filter((id): id is string => Boolean(id)),
  ).size;

  return {
    totalCount,
    sponsorRailCount,
    groceryCount,
    foodCount,
    uniqueUserCount,
    days,
  };
}

export async function getAffiliateEventList(limit = 200): Promise<AffiliateEventWithUser[]> {
  return db.affiliateEvent.findMany({
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
  }) as Promise<AffiliateEventWithUser[]>;
}
