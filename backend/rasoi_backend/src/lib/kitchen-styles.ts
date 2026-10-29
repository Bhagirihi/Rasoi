import {
  DEFAULT_KITCHEN_STYLES,
  type KitchenStyleRecord,
} from '@/lib/kitchen-style-data';
import { db } from '@/lib/db';

export type { KitchenStyleRecord } from '@/lib/kitchen-style-data';

const ACTIVE_IDS_TTL_MS = 5 * 60 * 1000;
let stylesEnsured = false;
let activeKitchenStyleIdsCache: Set<string> | null = null;
let activeKitchenStyleIdsExpiresAt = 0;

export async function ensureKitchenStyles() {
  if (stylesEnsured) return;

  const existingCount = await db.kitchenStyle.count();
  if (existingCount >= DEFAULT_KITCHEN_STYLES.length) {
    stylesEnsured = true;
    return;
  }

  for (const style of DEFAULT_KITCHEN_STYLES) {
    await db.kitchenStyle.upsert({
      where: { id: style.id },
      update: {},
      create: style,
    });
  }

  stylesEnsured = true;
  activeKitchenStyleIdsCache = null;
}

async function getActiveKitchenStyleIds(): Promise<Set<string>> {
  const now = Date.now();
  if (activeKitchenStyleIdsCache && now < activeKitchenStyleIdsExpiresAt) {
    return activeKitchenStyleIdsCache;
  }

  await ensureKitchenStyles();

  const styles = await db.kitchenStyle.findMany({
    where: { active: true },
    select: { id: true },
  });

  activeKitchenStyleIdsCache = new Set(styles.map((style) => style.id));
  activeKitchenStyleIdsExpiresAt = now + ACTIVE_IDS_TTL_MS;
  return activeKitchenStyleIdsCache;
}

export async function getActiveKitchenStyles(): Promise<KitchenStyleRecord[]> {
  await ensureKitchenStyles();
  return db.kitchenStyle.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }],
  });
}

export async function getAllKitchenStyles(): Promise<KitchenStyleRecord[]> {
  await ensureKitchenStyles();
  return db.kitchenStyle.findMany({
    orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }],
  });
}

export async function validateFavoriteCuisines(ids: string[]) {
  if (ids.length === 0) return;

  const activeIds = await getActiveKitchenStyleIds();
  const invalid = ids.filter((id) => !activeIds.has(id));
  if (invalid.length > 0) {
    throw new Error(`Invalid or disabled kitchen styles: ${invalid.join(', ')}`);
  }
}
