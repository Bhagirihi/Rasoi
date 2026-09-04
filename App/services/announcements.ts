import { optionalAuthApiFetch, getApiBaseUrl } from '@/utils/api';
import {
  getAppVersionLabel,
  type HomeAnnouncement,
} from '@/utils/announcements';

type ActiveAnnouncementResponse = {
  announcement: HomeAnnouncement | null;
};

const CACHE_TTL_MS = 10 * 60 * 1000;

let cachedAnnouncement: HomeAnnouncement | null | undefined;
let cachedAt = 0;
let inflight: Promise<HomeAnnouncement | null> | null = null;

export function clearActiveAnnouncementCache(): void {
  cachedAnnouncement = undefined;
  cachedAt = 0;
  inflight = null;
}

export async function fetchActiveAnnouncement(force = false): Promise<HomeAnnouncement | null> {
  const now = Date.now();
  if (!force && cachedAnnouncement !== undefined && now - cachedAt < CACHE_TTL_MS) {
    return cachedAnnouncement;
  }

  if (!force && inflight) {
    return inflight;
  }

  inflight = (async () => {
    try {
      const appVersion = encodeURIComponent(getAppVersionLabel());
      const data = await optionalAuthApiFetch<ActiveAnnouncementResponse>(
        `/api/announcements/active?appVersion=${appVersion}`,
      );
      cachedAnnouncement = data.announcement ?? null;
      cachedAt = Date.now();
      return cachedAnnouncement;
    } catch (error) {
      if (__DEV__) {
        console.warn(
          '[announcements] fetch failed',
          getApiBaseUrl(),
          error instanceof Error ? error.message : error,
        );
      }
      return cachedAnnouncement ?? null;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}
