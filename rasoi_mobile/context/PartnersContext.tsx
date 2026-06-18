import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';
import { Linking } from 'react-native';
import { router } from 'expo-router';

import {
  DELIVERY_PARTNER_UI,
  GROCERY_PARTNER_UI,
} from '@/constants/monetization';
import type { AffiliatePartner, FoodDeliveryPartner } from '@/constants/partners';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import {
  buildGroceryCheckoutQuery,
  buildPartnerUrls,
  loadPartnerLinks,
  type PartnerLinkResponse,
} from '@/services/partners';
import { logAffiliateEvent } from '@/services/affiliateEvents';
import { hasValidProfilePhone, PHONE_REQUIRED_FOR_PARTNERS_MESSAGE } from '@/utils/phoneGate';
import { useRasoiRealtimeTables } from '@/utils/realtime';

export type GroceryPartnerCard = {
  id: AffiliatePartner;
  label: string;
  delivery: string;
  accent: string;
  textOnAccent: string;
};

export type DeliveryPartnerCard = {
  id: FoodDeliveryPartner;
  label: string;
  tagline: string;
  accent: string;
};

type PartnersContextValue = {
  loading: boolean;
  error: string | null;
  groceryPartners: GroceryPartnerCard[];
  deliveryPartners: DeliveryPartnerCard[];
  refreshPartners: () => Promise<void>;
  openGroceryCheckout: (
    partnerId: AffiliatePartner,
    items: string[],
    options?: { context?: string; recipeId?: string },
  ) => Promise<void>;
  openFoodDelivery: (
    partnerId: FoodDeliveryPartner,
    query: string,
    options?: { context?: string; recipeId?: string },
  ) => Promise<void>;
  openBrandSearch: (
    query: string,
    partnerId?: AffiliatePartner,
    options?: { context?: string },
  ) => Promise<void>;
};

const PartnersContext = createContext<PartnersContextValue | undefined>(undefined);

const GROCERY_IDS: AffiliatePartner[] = ['blinkit', 'zepto', 'instamart'];
const DELIVERY_IDS: FoodDeliveryPartner[] = ['zomato', 'swiggy'];

function mergeGroceryPartner(link: PartnerLinkResponse): GroceryPartnerCard | null {
  if (!GROCERY_IDS.includes(link.partnerId as AffiliatePartner) || !link.active) {
    return null;
  }
  const id = link.partnerId as AffiliatePartner;
  const ui = GROCERY_PARTNER_UI[id];
  return {
    id,
    label: link.label,
    delivery: ui.delivery,
    accent: ui.accent,
    textOnAccent: ui.textOnAccent,
  };
}

function mergeDeliveryPartner(link: PartnerLinkResponse): DeliveryPartnerCard | null {
  if (!DELIVERY_IDS.includes(link.partnerId as FoodDeliveryPartner) || !link.active) {
    return null;
  }
  const id = link.partnerId as FoodDeliveryPartner;
  const ui = DELIVERY_PARTNER_UI[id];
  return {
    id,
    label: link.label,
    tagline: ui.tagline,
    accent: ui.accent,
  };
}

function buildCards(links: PartnerLinkResponse[]) {
  const groceryPartners = links
    .map(mergeGroceryPartner)
    .filter((item): item is GroceryPartnerCard => item !== null);
  const deliveryPartners = links
    .map(mergeDeliveryPartner)
    .filter((item): item is DeliveryPartnerCard => item !== null);

  return { groceryPartners, deliveryPartners };
}

async function openPartnerUrls(deepLink: string, webUrl: string) {
  // Prefer verified https app links — placeholder custom schemes (blinkit://cart/…) fail silently.
  const url = deepLink.startsWith('http') ? deepLink : webUrl;
  try {
    await Linking.openURL(url);
  } catch {
    if (url !== webUrl) {
      await Linking.openURL(webUrl);
    }
  }
}

export function PartnersProvider({ children }: { children: ReactNode }) {
  const { userPhone } = useAppContext();
  const { showDialog } = useAppDialog();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnerLinks, setPartnerLinks] = useState<PartnerLinkResponse[]>([]);
  const [groceryPartners, setGroceryPartners] = useState<GroceryPartnerCard[]>([]);
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartnerCard[]>([]);

  const refreshPartners = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const links = await loadPartnerLinks(true);
      const cards = buildCards(links);
      setPartnerLinks(links);
      setGroceryPartners(cards.groceryPartners);
      setDeliveryPartners(cards.deliveryPartners);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : 'Could not load partner links from the server';
      setError(message);
      setPartnerLinks([]);
      setGroceryPartners([]);
      setDeliveryPartners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshPartners();
  }, [refreshPartners]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void refreshPartners();
      }
    });

    return () => subscription.remove();
  }, [refreshPartners]);

  useRasoiRealtimeTables(['PartnerLink'], () => {
    void refreshPartners();
  }, 'partners');

  const ensurePartnerPhone = useCallback(() => {
    if (hasValidProfilePhone(userPhone)) return true;
    showDialog({
      title: 'Mobile number needed',
      message: PHONE_REQUIRED_FOR_PARTNERS_MESSAGE,
      buttons: [
        { text: 'Not now', style: 'cancel' },
        {
          text: 'Add in Settings',
          onPress: () => router.push('/(tabs)/settings/edit-profile'),
        },
      ],
    });
    return false;
  }, [showDialog, userPhone]);

  const openGroceryCheckout = useCallback(
    async (
      partnerId: AffiliatePartner,
      items: string[],
      options?: { context?: string; recipeId?: string },
    ) => {
      if (items.length === 0 || !ensurePartnerPhone()) return;
      const searchQuery = buildGroceryCheckoutQuery(items);
      const urls = buildPartnerUrls(partnerId, searchQuery, partnerLinks);
      if (!urls) return;
      void logAffiliateEvent({
        partner: partnerId,
        context: options?.context ?? 'grocery_checkout',
        recipeId: options?.recipeId,
        query: items.map((item) => item.trim()).filter(Boolean).join(', '),
      });
      await openPartnerUrls(urls.deepLink, urls.webUrl);
    },
    [partnerLinks, ensurePartnerPhone],
  );

  const openFoodDelivery = useCallback(
    async (
      partnerId: FoodDeliveryPartner,
      query: string,
      options?: { context?: string; recipeId?: string },
    ) => {
      const trimmed = query.trim();
      if (!trimmed || !ensurePartnerPhone()) return;
      const urls = buildPartnerUrls(partnerId, trimmed, partnerLinks);
      if (!urls) return;
      void logAffiliateEvent({
        partner: partnerId,
        context: options?.context ?? 'food_delivery',
        recipeId: options?.recipeId,
        query: trimmed,
      });
      await openPartnerUrls(urls.deepLink, urls.webUrl);
    },
    [partnerLinks, ensurePartnerPhone],
  );

  const openBrandSearch = useCallback(
    async (
      query: string,
      partnerId: AffiliatePartner = 'blinkit',
      options?: { context?: string },
    ) => {
      await openGroceryCheckout(partnerId, [query], {
        context: options?.context ?? 'brand_search',
      });
    },
    [openGroceryCheckout],
  );

  const value = useMemo<PartnersContextValue>(
    () => ({
      loading,
      error,
      groceryPartners,
      deliveryPartners,
      refreshPartners,
      openGroceryCheckout,
      openFoodDelivery,
      openBrandSearch,
    }),
    [
      loading,
      error,
      groceryPartners,
      deliveryPartners,
      refreshPartners,
      openGroceryCheckout,
      openFoodDelivery,
      openBrandSearch,
    ],
  );

  return <PartnersContext.Provider value={value}>{children}</PartnersContext.Provider>;
}

export function usePartners(): PartnersContextValue {
  const context = useContext(PartnersContext);
  if (!context) {
    throw new Error('usePartners must be used within PartnersProvider');
  }
  return context;
}
