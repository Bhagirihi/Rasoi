import type { Href } from 'expo-router';
import * as Linking from 'expo-linking';

import { getAppVersionLabel } from '@/utils/appVersion';

export type HomeAnnouncementPresentation = 'modal' | 'banner' | 'both';

export type HomeAnnouncement = {
  campaignKey: string;
  title: string;
  body: string;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaLink: string | null;
  presentation: HomeAnnouncementPresentation;
};

export { getAppVersionLabel };

export function announcementShowsModal(presentation: HomeAnnouncementPresentation): boolean {
  return presentation === 'modal' || presentation === 'both';
}

export function announcementShowsBanner(presentation: HomeAnnouncementPresentation): boolean {
  return presentation === 'banner' || presentation === 'both';
}

export function resolveAnnouncementHref(link: string): Href | null {
  const trimmed = link.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return null;
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return path as Href;
}

export async function openAnnouncementCta(
  link: string,
  navigate: (href: Href) => void,
): Promise<void> {
  const trimmed = link.trim();
  if (!trimmed) return;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    await Linking.openURL(trimmed);
    return;
  }

  const href = resolveAnnouncementHref(trimmed);
  if (href) navigate(href);
}
