import { PANTRY_SECTIONS } from '@/lib/pantry-sections';
import { REGIONAL_CUISINES } from '@/lib/recipe-filters';
import { prisma } from '@/lib/prisma';

export type PantrySectionRecord = {
  id: string;
  title: string;
  items: string[];
  sortOrder: number;
  active: boolean;
};

const DEFAULT_PANTRY_SECTIONS: PantrySectionRecord[] = PANTRY_SECTIONS.map((section, index) => ({
  id: section.title.toLowerCase().replace(/\s+/g, '-'),
  title: section.title,
  items: [...section.items],
  sortOrder: (index + 1) * 10,
  active: true,
}));

const DEFAULT_REGIONAL_CUISINES = REGIONAL_CUISINES.map((label, index) => ({
  label,
  sortOrder: (index + 1) * 10,
  active: true,
}));

export async function ensureReferenceData() {
  for (const section of DEFAULT_PANTRY_SECTIONS) {
    await prisma.pantrySection.upsert({
      where: { id: section.id },
      update: {
        title: section.title,
        items: JSON.stringify(section.items),
        sortOrder: section.sortOrder,
        active: section.active,
      },
      create: {
        id: section.id,
        title: section.title,
        items: JSON.stringify(section.items),
        sortOrder: section.sortOrder,
        active: section.active,
      },
    });
  }

  for (const cuisine of DEFAULT_REGIONAL_CUISINES) {
    await prisma.regionalCuisineOption.upsert({
      where: { label: cuisine.label },
      update: {},
      create: cuisine,
    });
  }
}

export async function getActiveRegionalCuisines(): Promise<string[]> {
  await ensureReferenceData();
  const rows = await prisma.regionalCuisineOption.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }],
  });
  return rows.map((row) => row.label);
}

export async function getActivePantrySections(): Promise<PantrySectionRecord[]> {
  await ensureReferenceData();
  const rows = await prisma.pantrySection.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
  });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    items: JSON.parse(row.items) as string[],
    sortOrder: row.sortOrder,
    active: row.active,
  }));
}
