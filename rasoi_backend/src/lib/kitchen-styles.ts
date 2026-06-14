import {
  DEFAULT_KITCHEN_STYLES,
  type KitchenStyleRecord,
} from '@/lib/kitchen-style-data';
import { prisma } from '@/lib/prisma';

export type { KitchenStyleRecord } from '@/lib/kitchen-style-data';

export async function ensureKitchenStyles() {
  for (const style of DEFAULT_KITCHEN_STYLES) {
    await prisma.kitchenStyle.upsert({
      where: { id: style.id },
      update: {},
      create: style,
    });
  }
}

export async function getActiveKitchenStyles(): Promise<KitchenStyleRecord[]> {
  await ensureKitchenStyles();
  return prisma.kitchenStyle.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }],
  });
}

export async function getAllKitchenStyles(): Promise<KitchenStyleRecord[]> {
  await ensureKitchenStyles();
  return prisma.kitchenStyle.findMany({
    orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }],
  });
}

export async function validateFavoriteCuisines(ids: string[]) {
  const activeIds = new Set((await getActiveKitchenStyles()).map((style) => style.id));
  const invalid = ids.filter((id) => !activeIds.has(id));
  if (invalid.length > 0) {
    throw new Error(`Invalid or disabled kitchen styles: ${invalid.join(', ')}`);
  }
}
