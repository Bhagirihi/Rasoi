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
import { router } from 'expo-router';

import {
  getDeliveryPartnerUi,
  getGroceryPartnerUi,
} from '@/constants/monetization';
import type { AffiliatePartner, FoodDeliveryPartner } from '@/constants/partners';
import { resolveGroceryPartnerId } from '@/constants/partners';
import { useAppContext } from '@/context/AppContext';
import { useShoppingSession } from '@/context/ShoppingSessionContext';
import { useAppDialog } from '@/context/AppDialogContext';
import {
  buildGroceryCheckoutQuery,
  buildPartnerUrls,
  loadPartnerLinks,
  type PartnerLinkResponse,
} from '@/services/partners';
import { logAffiliateEvent } from '@/services/affiliateEvents';
import {
  hasValidProfilePhone,
  PHONE_REQUIRED_FOR_DELIVERY_MESSAGE,
} from '@/utils/phoneGate';
import { openPartnerUrls } from '@/utils/openPartnerUrl';
import { PAYWALL_HREF } from '@/utils/routes';
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
    options?: {
      context?: string;
      recipeId?: string;
      recipeTitle?: string;
      shoppingItem?: string;
      sessionItems?: string[];
      sessionKind?: 'recipe' | 'pantry';
    },
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

function mergeGroceryPartner(link: PartnerLinkResponse): GroceryPartnerCard | null {
  if (link.category !== 'grocery' || !link.active) {
    return null;
  }
  const ui = getGroceryPartnerUi(link.partnerId);
  return {
    id: link.partnerId,
    label: link.label,
    delivery: ui.delivery,
    accent: ui.accent,
    textOnAccent: ui.textOnAccent,
  };
}

function mergeDeliveryPartner(link: PartnerLinkResponse): DeliveryPartnerCard | null {
  if (link.category !== 'delivery' || !link.active) {
    return null;
  }
  const ui = getDeliveryPartnerUi(link.partnerId);
  return {
    id: link.partnerId,
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

export function PartnersProvider({ children }: { children: ReactNode }) {
  const { userPhone, partnerAccess, recordPartnerShop } = useAppContext();
  const { registerPartnerCheckout } = useShoppingSession();
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

  const ensurePartnerAccess = useCallback(() => {
    if (partnerAccess.canCheckout) return true;
    showDialog({
      title: 'Partner checkout limit reached',
      message:
        'You have used your 2 free partner shops for this month. Upgrade to Rasoi Plus for unlimited grocery and delivery checkout.',
      buttons: [
        { text: 'Not now', style: 'cancel' },
        { text: 'View plans', onPress: () => router.push(PAYWALL_HREF) },
      ],
    });
    return false;
  }, [partnerAccess.canCheckout, showDialog]);

  const ensureDeliveryPhone = useCallback(() => {
    if (hasValidProfilePhone(userPhone)) return true;
    showDialog({
      title: 'Mobile number needed',
      message: PHONE_REQUIRED_FOR_DELIVERY_MESSAGE,
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
      options?: {
        context?: string;
        recipeId?: string;
        recipeTitle?: string;
        shoppingItem?: string;
        sessionItems?: string[];
        sessionKind?: 'recipe' | 'pantry';
      },
    ) => {
      if (items.length === 0 || !ensurePartnerAccess()) return;
      const searchQuery = buildGroceryCheckoutQuery(items);
      if (!searchQuery) return;
      const urls = buildPartnerUrls(partnerId, searchQuery, partnerLinks);
      if (!urls) return;
      void logAffiliateEvent({
        partner: partnerId,
        context: options?.context ?? 'grocery_checkout',
        recipeId: options?.recipeId,
        query: searchQuery,
      });
      const result = await openPartnerUrls(urls.deepLink, urls.webUrl);
      if (result === 'failed') {
        showDialog({
          title: 'Could not open partner',
          message: 'Try opening the web checkout in your browser.',
          buttons: [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open browser',
              onPress: () => {
                void openPartnerUrls('', urls.webUrl);
              },
            },
          ],
        });
        return;
      }
      await registerPartnerCheckout({
        kind: options?.sessionKind ?? (options?.recipeId ? 'recipe' : 'pantry'),
        recipeId: options?.recipeId,
        recipeTitle: options?.recipeTitle,
        shoppingItem: options?.shoppingItem ?? searchQuery,
        sessionItems: options?.sessionItems ?? items,
      });
      if (partnerAccess.freemiumMode) {
        await recordPartnerShop();
      }
    },
    [
      partnerLinks,
      ensurePartnerAccess,
      partnerAccess.freemiumMode,
      recordPartnerShop,
      registerPartnerCheckout,
      showDialog,
    ],
  );

  const openFoodDelivery = useCallback(
    async (
      partnerId: FoodDeliveryPartner,
      query: string,
      options?: { context?: string; recipeId?: string },
    ) => {
      const trimmed = query.trim();
      if (!trimmed || !ensurePartnerAccess() || !ensureDeliveryPhone()) return;
      const urls = buildPartnerUrls(partnerId, trimmed, partnerLinks);
      if (!urls) return;
      void logAffiliateEvent({
        partner: partnerId,
        context: options?.context ?? 'food_delivery',
        recipeId: options?.recipeId,
        query: trimmed,
      });
      const result = await openPartnerUrls(urls.deepLink, urls.webUrl);
      if (result === 'failed') {
        showDialog({
          title: 'Could not open partner',
          message: 'Try opening the web checkout in your browser.',
          buttons: [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open browser',
              onPress: () => {
                void openPartnerUrls('', urls.webUrl);
              },
            },
          ],
        });
        return;
      }
      if (partnerAccess.freemiumMode) {
        await recordPartnerShop();
      }
    },
    [
      partnerLinks,
      ensurePartnerAccess,
      ensureDeliveryPhone,
      partnerAccess.freemiumMode,
      recordPartnerShop,
      showDialog,
    ],
  );

  const openBrandSearch = useCallback(
    async (
      query: string,
      partnerId?: AffiliatePartner,
      options?: { context?: string },
    ) => {
      const resolved = resolveGroceryPartnerId(partnerId, groceryPartners);
      if (!resolved) return;
      await openGroceryCheckout(resolved, [query], {
        context: options?.context ?? 'brand_search',
      });
    },
    [groceryPartners, openGroceryCheckout],
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
