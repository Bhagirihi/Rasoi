import { apiFetch } from '@/utils/api';
import { getRasoiDb, isDirectSupabaseCatalogEnabled } from '@/utils/rasoiDb';
import {
  buildDeliveryPartnerSearchUrls,
  buildPartnerUrl,
  DEFAULT_PARTNER_LINKS,
} from '@/constants/partners';

export type PartnerLinkResponse = {
  partnerId: string;
  label: string;
  category: 'grocery' | 'delivery';
  deepLinkUrl: string;
  webUrl: string;
  active: boolean;
  updatedAt?: string;
};

const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedLinks: PartnerLinkResponse[] | null = null;
let cachedAt = 0;
let loadPromise: Promise<PartnerLinkResponse[]> | null = null;

async function loadPartnerLinksFromSupabase(): Promise<PartnerLinkResponse[]> {
  const { data, error } = await getRasoiDb()
    .from('PartnerLink')
    .select('partnerId, label, category, deepLinkUrl, webUrl, active, updatedAt')
    .eq('region', 'IN')
    .eq('active', true)
    .order('partnerId', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((link) => ({
    partnerId: link.partnerId,
    label: link.label,
    category: link.category as PartnerLinkResponse['category'],
    deepLinkUrl: link.deepLinkUrl,
    webUrl: link.webUrl,
    active: link.active,
    updatedAt: link.updatedAt,
  }));
}

export async function loadPartnerLinks(force = false): Promise<PartnerLinkResponse[]> {
  if (
    cachedLinks &&
    !force &&
    Date.now() - cachedAt < CACHE_TTL_MS
  ) {
    return cachedLinks;
  }

  if (loadPromise && !force) {
    return loadPromise;
  }

  loadPromise = (async () => {
    if (isDirectSupabaseCatalogEnabled()) {
      try {
        cachedLinks = await loadPartnerLinksFromSupabase();
        cachedAt = Date.now();
        return cachedLinks;
      } catch (error) {
        console.warn('[partners] Supabase read failed, falling back to API', error);
      }
    }

    const links = await apiFetch<PartnerLinkResponse[]>('/api/partners?region=IN');
    cachedLinks = links.filter((link) => link.active);
    cachedAt = Date.now();
    return cachedLinks;
  })()
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
  partnerId: string,
  query: string,
  links: PartnerLinkResponse[],
) {
  const deliveryUrls = buildDeliveryPartnerSearchUrls(partnerId, query);
  if (deliveryUrls) {
    return deliveryUrls;
  }

  const link =
    links.find((item) => item.partnerId === partnerId && item.active) ??
    DEFAULT_PARTNER_LINKS.find((item) => item.partnerId === partnerId);

  if (!link) return null;

  return {
    deepLink: buildPartnerUrl(link.deepLinkUrl, query),
    webUrl: buildPartnerUrl(link.webUrl, query),
  };
}

export { buildGroceryCheckoutQuery, pickGroceryCheckoutItem } from '@/constants/partners';
