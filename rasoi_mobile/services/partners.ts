import { apiFetch } from '@/utils/api';
import { buildPartnerUrl, type PartnerId } from '@/constants/partners';

export type PartnerLinkResponse = {
  partnerId: PartnerId;
  label: string;
  category: 'grocery' | 'delivery';
  deepLinkUrl: string;
  webUrl: string;
  active: boolean;
  updatedAt?: string;
};

let cachedLinks: PartnerLinkResponse[] | null = null;
let loadPromise: Promise<PartnerLinkResponse[]> | null = null;

export async function loadPartnerLinks(force = false): Promise<PartnerLinkResponse[]> {
  if (cachedLinks && !force) {
    return cachedLinks;
  }

  if (loadPromise && !force) {
    return loadPromise;
  }

  loadPromise = apiFetch<PartnerLinkResponse[]>('/api/partners')
    .then((links) => {
      cachedLinks = links.filter((link) => link.active);
      return cachedLinks;
    })
    .catch((error) => {
      if (cachedLinks) {
        return cachedLinks;
      }
      throw error instanceof Error ? error : new Error('Could not load partner links from the server');
    })
    .finally(() => {
      loadPromise = null;
    });

  return loadPromise;
}

export function getCachedPartnerLinks(): PartnerLinkResponse[] {
  return cachedLinks ?? [];
}

export function buildPartnerUrls(
  partnerId: PartnerId,
  query: string,
  links: PartnerLinkResponse[],
) {
  const link = links.find((item) => item.partnerId === partnerId && item.active);
  if (!link) return null;

  return {
    deepLink: buildPartnerUrl(link.deepLinkUrl, query),
    webUrl: buildPartnerUrl(link.webUrl, query),
  };
}

export { buildGroceryCheckoutQuery } from '@/constants/partners';