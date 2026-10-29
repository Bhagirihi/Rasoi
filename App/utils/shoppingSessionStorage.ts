import AsyncStorage from '@react-native-async-storage/async-storage';

export type ShoppingSessionKind = 'recipe' | 'pantry';

export type ShoppingSession = {
  kind: ShoppingSessionKind;
  recipeId?: string;
  recipeTitle?: string;
  orderedItems: string[];
  shoppedItems: string[];
  lastPartnerItem: string | null;
  lastPartnerOpenedAt: string | null;
  pendingReturnPrompt: boolean;
  updatedAt: string;
};

const STORAGE_KEY = 'rasoi_shopping_session_v1';
const SESSION_TTL_MS = 4 * 60 * 60 * 1000;
export const RETURN_PROMPT_WINDOW_MS = 45 * 60 * 1000;

function normalizeItemKey(name: string): string {
  return name.trim().toLowerCase();
}

export function remainingShoppingItems(session: ShoppingSession): string[] {
  const shopped = new Set(session.shoppedItems.map(normalizeItemKey));
  return session.orderedItems.filter((item) => !shopped.has(normalizeItemKey(item)));
}

export function nextShoppingItem(session: ShoppingSession): string | null {
  return remainingShoppingItems(session)[0] ?? null;
}

export function shouldPromptShoppingReturn(session: ShoppingSession): boolean {
  if (!session.pendingReturnPrompt || !session.lastPartnerItem || !session.lastPartnerOpenedAt) {
    return false;
  }
  const openedAt = new Date(session.lastPartnerOpenedAt).getTime();
  if (Number.isNaN(openedAt)) return false;
  return Date.now() - openedAt < RETURN_PROMPT_WINDOW_MS;
}

export async function loadShoppingSession(): Promise<ShoppingSession | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ShoppingSession;
    if (!parsed?.orderedItems?.length) return null;
    const updatedAt = new Date(parsed.updatedAt).getTime();
    if (Number.isNaN(updatedAt) || Date.now() - updatedAt > SESSION_TTL_MS) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function saveShoppingSession(session: ShoppingSession | null): Promise<void> {
  if (!session) {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return;
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}
