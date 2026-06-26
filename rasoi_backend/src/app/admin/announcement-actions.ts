'use server';

import { revalidatePath } from 'next/cache';

import { getAdminFromCookies } from '@/lib/auth';
import { createRowId, db } from '@/lib/db';
import { revalidateHomeAnnouncementsCache } from '@/lib/home-announcements';
import { homeAnnouncementCreateSchema, homeAnnouncementUpdateSchema } from '@/lib/validators';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

function parseOptionalDate(value?: string) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function createHomeAnnouncementAction(raw: unknown) {
  await requireAdminSession();
  const input = homeAnnouncementCreateSchema.parse(raw);

  await db.homeAnnouncement.create({
    data: {
      id: createRowId(),
      campaignKey: input.campaignKey,
      enabled: input.enabled,
      title: input.title,
      body: input.body,
      imageUrl: input.imageUrl ?? null,
      ctaLabel: input.ctaLabel ?? null,
      ctaLink: input.ctaLink ?? null,
      presentation: input.presentation,
      startsAt: parseOptionalDate(input.startsAt),
      endsAt: parseOptionalDate(input.endsAt),
      minAppVersion: input.minAppVersion ?? null,
      audience: input.audience,
      sortOrder: input.sortOrder,
    },
  });

  await revalidateHomeAnnouncementsCache();
  revalidatePath('/admin/announcements');
}

export async function updateHomeAnnouncementAction(id: string, raw: unknown) {
  await requireAdminSession();
  const input = homeAnnouncementUpdateSchema.parse(raw);

  await db.homeAnnouncement.update({
    where: { id },
    data: {
      ...(input.campaignKey ? { campaignKey: input.campaignKey } : {}),
      enabled: input.enabled,
      title: input.title,
      body: input.body,
      imageUrl: input.imageUrl ?? null,
      ctaLabel: input.ctaLabel ?? null,
      ctaLink: input.ctaLink ?? null,
      presentation: input.presentation,
      startsAt: parseOptionalDate(input.startsAt),
      endsAt: parseOptionalDate(input.endsAt),
      minAppVersion: input.minAppVersion ?? null,
      audience: input.audience,
      sortOrder: input.sortOrder,
    },
  });

  await revalidateHomeAnnouncementsCache();
  revalidatePath('/admin/announcements');
}

export async function setHomeAnnouncementEnabledAction(id: string, enabled: boolean) {
  await requireAdminSession();
  await db.homeAnnouncement.update({
    where: { id },
    data: { enabled },
  });
  await revalidateHomeAnnouncementsCache();
  revalidatePath('/admin/announcements');
  revalidatePath('/admin');
}

export async function deleteHomeAnnouncementAction(id: string) {
  await requireAdminSession();
  await db.homeAnnouncement.delete({ where: { id } });
  await revalidateHomeAnnouncementsCache();
  revalidatePath('/admin/announcements');
}
