import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';

import { useAppContext } from '@/context/AppContext';
import { ingredientKey, pantryHasIngredient } from '@/utils/recipeIngredients';
import {
  loadShoppingSession,
  remainingShoppingItems,
  saveShoppingSession,
  shouldPromptShoppingReturn,
  type ShoppingSession,
  type ShoppingSessionKind,
} from '@/utils/shoppingSessionStorage';

type StartSessionInput = {
  kind: ShoppingSessionKind;
  recipeId?: string;
  recipeTitle?: string;
  orderedItems: string[];
};

type PartnerCheckoutMeta = {
  kind: ShoppingSessionKind;
  recipeId?: string;
  recipeTitle?: string;
  shoppingItem: string;
  sessionItems: string[];
};

type ReturnPromptState = {
  item: string;
  recipeTitle?: string;
};

type CompletedShopPrompt = {
  recipeId: string;
  recipeTitle?: string;
};

type ShoppingSessionContextValue = {
  session: ShoppingSession | null;
  returnPrompt: ReturnPromptState | null;
  /** Set when the last missing item is shopped — drives the “start cooking” CTA. */
  completedShopPrompt: CompletedShopPrompt | null;
  shoppedCount: number;
  totalCount: number;
  startSession: (input: StartSessionInput) => Promise<void>;
  registerPartnerCheckout: (meta: PartnerCheckoutMeta) => Promise<void>;
  confirmAddLastItem: () => Promise<void>;
  dismissReturnPrompt: () => Promise<void>;
  finishShopping: () => Promise<void>;
  clearCompletedShopPrompt: () => void;
  getSessionProgress: (recipeId?: string) => { shopped: number; total: number } | null;
  getNextShoppingItem: (recipeId?: string) => string | null;
};

const ShoppingSessionContext = createContext<ShoppingSessionContextValue | undefined>(undefined);

function mergeSession(
  existing: ShoppingSession | null,
  input: StartSessionInput,
): ShoppingSession {
  const now = new Date().toISOString();
  const sameRecipe =
    input.kind === 'recipe' &&
    existing?.kind === 'recipe' &&
    existing.recipeId &&
    input.recipeId &&
    existing.recipeId === input.recipeId;

  const preservedShopped =
    sameRecipe && existing
      ? existing.shoppedItems.filter((item) =>
          input.orderedItems.some((name) => ingredientKey(name) === ingredientKey(item)),
        )
      : [];

  return {
    kind: input.kind,
    recipeId: input.recipeId,
    recipeTitle: input.recipeTitle,
    orderedItems: input.orderedItems,
    shoppedItems: preservedShopped,
    lastPartnerItem: sameRecipe ? existing?.lastPartnerItem ?? null : null,
    lastPartnerOpenedAt: sameRecipe ? existing?.lastPartnerOpenedAt ?? null : null,
    pendingReturnPrompt: sameRecipe ? Boolean(existing?.pendingReturnPrompt) : false,
    updatedAt: now,
  };
}

export function ShoppingSessionProvider({ children }: { children: ReactNode }) {
  const { pantryIngredients, togglePantryIngredient } = useAppContext();
  const [session, setSession] = useState<ShoppingSession | null>(null);
  const [returnPrompt, setReturnPrompt] = useState<ReturnPromptState | null>(null);
  const [completedShopPrompt, setCompletedShopPrompt] = useState<CompletedShopPrompt | null>(
    null,
  );
  const awaitingReturnRef = useRef(false);
  const sessionRef = useRef<ShoppingSession | null>(null);

  sessionRef.current = session;

  useEffect(() => {
    void loadShoppingSession().then((stored) => {
      if (stored) setSession(stored);
    });
  }, []);

  const persistSession = useCallback(async (next: ShoppingSession | null) => {
    sessionRef.current = next;
    setSession(next);
    await saveShoppingSession(next);
  }, []);

  const maybeShowReturnPrompt = useCallback((current: ShoppingSession | null) => {
    if (!current || !shouldPromptShoppingReturn(current) || !current.lastPartnerItem) return;
    setReturnPrompt({
      item: current.lastPartnerItem,
      recipeTitle: current.recipeTitle,
    });
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active' || !awaitingReturnRef.current) return;
      awaitingReturnRef.current = false;
      maybeShowReturnPrompt(sessionRef.current);
    });
    return () => subscription.remove();
  }, [maybeShowReturnPrompt]);

  const startSession = useCallback(
    async (input: StartSessionInput) => {
      const filtered = input.orderedItems.filter(
        (name) => name.trim() && !pantryHasIngredient(pantryIngredients, name),
      );
      if (filtered.length === 0) {
        await persistSession(null);
        return;
      }
      const next = mergeSession(sessionRef.current, { ...input, orderedItems: filtered });
      await persistSession(next);
    },
    [pantryIngredients, persistSession],
  );

  const registerPartnerCheckout = useCallback(
    async (meta: PartnerCheckoutMeta) => {
      const base =
        sessionRef.current ??
        mergeSession(null, {
          kind: meta.kind,
          recipeId: meta.recipeId,
          recipeTitle: meta.recipeTitle,
          orderedItems: meta.sessionItems,
        });

      const next: ShoppingSession = {
        ...base,
        kind: meta.kind,
        recipeId: meta.recipeId ?? base.recipeId,
        recipeTitle: meta.recipeTitle ?? base.recipeTitle,
        orderedItems:
          meta.sessionItems.length > 0 ? meta.sessionItems : base.orderedItems,
        lastPartnerItem: meta.shoppingItem,
        lastPartnerOpenedAt: new Date().toISOString(),
        pendingReturnPrompt: true,
        updatedAt: new Date().toISOString(),
      };

      awaitingReturnRef.current = true;
      await persistSession(next);
    },
    [persistSession],
  );

  const markItemShopped = useCallback(
    async (item: string, clearPrompt: boolean) => {
      const current = sessionRef.current;
      if (!current) return;

      const key = ingredientKey(item);
      const shoppedItems = current.shoppedItems.some((name) => ingredientKey(name) === key)
        ? current.shoppedItems
        : [...current.shoppedItems, item];

      const next: ShoppingSession = {
        ...current,
        shoppedItems,
        pendingReturnPrompt: clearPrompt ? false : current.pendingReturnPrompt,
        updatedAt: new Date().toISOString(),
      };

      if (remainingShoppingItems(next).length === 0) {
        if (next.kind === 'recipe' && next.recipeId) {
          setCompletedShopPrompt({
            recipeId: next.recipeId,
            recipeTitle: next.recipeTitle,
          });
        }
        await persistSession(null);
        return;
      }
      await persistSession(next);
    },
    [persistSession],
  );

  const confirmAddLastItem = useCallback(async () => {
    if (!returnPrompt) return;
    if (!pantryHasIngredient(pantryIngredients, returnPrompt.item)) {
      togglePantryIngredient(returnPrompt.item);
    }
    await markItemShopped(returnPrompt.item, true);
    setReturnPrompt(null);
  }, [markItemShopped, pantryIngredients, returnPrompt, togglePantryIngredient]);

  const dismissReturnPrompt = useCallback(async () => {
    const current = sessionRef.current;
    if (!current) {
      setReturnPrompt(null);
      return;
    }
    await persistSession({
      ...current,
      pendingReturnPrompt: false,
      updatedAt: new Date().toISOString(),
    });
    setReturnPrompt(null);
  }, [persistSession]);

  const finishShopping = useCallback(async () => {
    setReturnPrompt(null);
    awaitingReturnRef.current = false;
    await persistSession(null);
  }, [persistSession]);

  const clearCompletedShopPrompt = useCallback(() => {
    setCompletedShopPrompt(null);
  }, []);

  const shoppedCount = session?.shoppedItems.length ?? 0;
  const totalCount = session?.orderedItems.length ?? 0;

  const getSessionProgress = useCallback(
    (recipeId?: string) => {
      if (!session) return null;
      if (session.kind === 'recipe' && recipeId && session.recipeId !== recipeId) return null;
      return { shopped: session.shoppedItems.length, total: session.orderedItems.length };
    },
    [session],
  );

  const getNextShoppingItem = useCallback(
    (recipeId?: string) => {
      if (!session) return null;
      if (session.kind === 'recipe' && recipeId && session.recipeId !== recipeId) return null;
      for (const item of remainingShoppingItems(session)) {
        if (!pantryHasIngredient(pantryIngredients, item)) return item;
      }
      return null;
    },
    [pantryIngredients, session],
  );

  const value = useMemo<ShoppingSessionContextValue>(
    () => ({
      session,
      returnPrompt,
      completedShopPrompt,
      shoppedCount,
      totalCount,
      startSession,
      registerPartnerCheckout,
      confirmAddLastItem,
      dismissReturnPrompt,
      finishShopping,
      clearCompletedShopPrompt,
      getSessionProgress,
      getNextShoppingItem,
    }),
    [
      session,
      returnPrompt,
      completedShopPrompt,
      shoppedCount,
      totalCount,
      startSession,
      registerPartnerCheckout,
      confirmAddLastItem,
      dismissReturnPrompt,
      finishShopping,
      clearCompletedShopPrompt,
      getSessionProgress,
      getNextShoppingItem,
    ],
  );

  return (
    <ShoppingSessionContext.Provider value={value}>{children}</ShoppingSessionContext.Provider>
  );
}

export function useShoppingSession(): ShoppingSessionContextValue {
  const context = useContext(ShoppingSessionContext);
  if (!context) {
    throw new Error('useShoppingSession must be used within ShoppingSessionProvider');
  }
  return context;
}
