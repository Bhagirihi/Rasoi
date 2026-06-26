import { unstable_cache } from 'next/cache';

import { db } from '@/lib/db';
import type {
  HomeAnnouncement,
  HomeAnnouncementAudience,
  HomeAnnouncementPresentation,
  User,
} from '@/lib/db/types';

export type HomeAnnouncementResponse = {
  campaignKey: string;
  title: string;
  body: string;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaLink: string | null;
  presentation: HomeAnnouncementPresentation;
};

function parseSemverParts(version: string): number[] {
  return version
    .trim()
    .split('.')
    .map((part) => {
      const parsed = Number.parseInt(part.replace(/[^0-9].*$/, ''), 10);
      return Number.isFinite(parsed) ? parsed : 0;
    });
}

export function compareSemver(left: string, right: string): number {
  const a = parseSemverParts(left);
  const b = parseSemverParts(right);
  const length = Math.max(a.length, b.length);

  for (let index = 0; index < length; index += 1) {
    const delta = (a[index] ?? 0) - (b[index] ?? 0);
    if (delta !== 0) return delta;
  }

  return 0;
}

export function meetsMinAppVersion(appVersion: string | null | undefined, minAppVersion: string | null): boolean {
  if (!minAppVersion?.trim()) return true;
  if (!appVersion?.trim()) return false;
  return compareSemver(appVersion, minAppVersion) >= 0;
}

function isWithinSchedule(row: HomeAnnouncement, now = new Date()): boolean {
  if (row.startsAt && row.startsAt.getTime() > now.getTime()) return false;
  if (row.endsAt && row.endsAt.getTime() < now.getTime()) return false;
  return true;
}

export function matchesAnnouncementAudience(
  audience: HomeAnnouncementAudience,
  user: User | null,
): boolean {
  switch (audience) {
    case 'all':
      return true;
    case 'guest':
      return Boolean(user?.isGuest);
    case 'logged_in':
      return Boolean(user && !user.isGuest);
    case 'free':
      return Boolean(user && user.planTier === 'free');
    case 'paid':
      return Boolean(user && user.planTier === 'paid');
    default:
      return false;
  }
}

export function serializeHomeAnnouncement(row: HomeAnnouncement): HomeAnnouncementResponse {
  return {
    campaignKey: row.campaignKey,
    title: row.title,
    body: row.body,
    imageUrl: row.imageUrl,
    ctaLabel: row.ctaLabel,
    ctaLink: row.ctaLink,
    presentation: row.presentation,
  };
}

async function readEnabledAnnouncements(): Promise<HomeAnnouncement[]> {
  return db.homeAnnouncement.findMany({
    where: { enabled: true },
    orderBy: [{ sortOrder: 'desc' }, { createdAt: 'desc' }],
  });
}

const getEnabledAnnouncements = unstable_cache(readEnabledAnnouncements, ['home-announcements'], {
  revalidate: 60,
  tags: ['home-announcements'],
});

export async function getActiveHomeAnnouncement(
  user: User | null,
  appVersion: string | null | undefined,
): Promise<HomeAnnouncementResponse | null> {
  const now = new Date();
  const rows = await getEnabledAnnouncements();

  for (const row of rows) {
    if (!isWithinSchedule(row, now)) continue;
    if (!meetsMinAppVersion(appVersion, row.minAppVersion)) continue;
    if (!matchesAnnouncementAudience(row.audience, user)) continue;
    return serializeHomeAnnouncement(row);
  }

  return null;
}

export async function revalidateHomeAnnouncementsCache(): Promise<void> {
  try {
    const { revalidateTag } = await import('next/cache');
    revalidateTag('home-announcements', 'max');
  } catch {
    // Scripts / CLI run outside Next.js request context.
  }
}
