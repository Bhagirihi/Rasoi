import {
  PANTRY_CUISINE_SECTIONS,
  PANTRY_DIET_SECTIONS,
  type PantryCatalogItem,
} from '@/constants/pantryCuisineCatalog';
import { PANTRY_ESSENTIAL_SECTIONS } from '@/constants/pantryEssentials';
import { DIET_CHOICE_LABELS, type DietChoice } from '@/constants/theme';
import type { PantrySection } from '@/services/reference';
import { getKitchenStyleLabel, type KitchenStyle } from '@/utils/kitchenStyles';
import { pantryDedupeKey } from '@/utils/pantryCanonical';

const JAIN_EXCLUDED_ITEM_IDS = new Set(['pyaaz', 'lahsun', 'aloo', 'eggs']);

export type PantryPreferenceSummary = {
  dietLabel: string;
  cuisineLabels: string[];
  headline: string;
};

export function itemAllowedForDiet(item: PantryCatalogItem, dietChoice: DietChoice): boolean {
  if (item.excludedDiets?.includes(dietChoice)) {
    return false;
  }
  if (dietChoice === 'Jain' && JAIN_EXCLUDED_ITEM_IDS.has(item.id)) {
    return false;
  }
  return true;
}

function filterSectionItems(
  items: PantryCatalogItem[],
  dietChoice: DietChoice,
  seenIds: Set<string>,
  seenDedupeKeys: Set<string>,
): string[] {
  const labels: string[] = [];
  for (const item of items) {
    if (!itemAllowedForDiet(item, dietChoice)) continue;
    if (seenIds.has(item.id)) continue;
    const dedupeKey = pantryDedupeKey(item.label);
    if (seenDedupeKeys.has(dedupeKey)) continue;
    seenIds.add(item.id);
    seenDedupeKeys.add(dedupeKey);
    labels.push(item.label);
  }
  return labels;
}

function buildPreferenceSummary(
  dietChoice: DietChoice,
  favoriteCuisines: string[],
  kitchenStyles: KitchenStyle[],
): PantryPreferenceSummary {
  const dietLabel = DIET_CHOICE_LABELS[dietChoice];
  const cuisineLabels = favoriteCuisines
    .map((id) => getKitchenStyleLabel(id, kitchenStyles))
    .filter((label, index, all) => label && all.indexOf(label) === index);

  const headline =
    cuisineLabels.length > 0
      ? `${dietLabel} · ${cuisineLabels.join(' · ')}`
      : dietLabel;

  return { dietLabel, cuisineLabels, headline };
}

export function getPersonalizedPantrySections(input: {
  dietChoice: DietChoice;
  favoriteCuisines: string[];
  kitchenStyles: KitchenStyle[];
}): { sections: PantrySection[]; preferenceSummary: PantryPreferenceSummary } {
  const { dietChoice, favoriteCuisines, kitchenStyles } = input;
  const seenIds = new Set<string>();
  const seenDedupeKeys = new Set<string>();
  const sections: PantrySection[] = [];

  for (const section of PANTRY_ESSENTIAL_SECTIONS) {
    const items = filterSectionItems(section.items, dietChoice, seenIds, seenDedupeKeys);
    if (items.length > 0) {
      sections.push({ title: section.title, items });
    }
  }

  if (dietChoice === 'Non-Veg') {
    for (const section of PANTRY_DIET_SECTIONS) {
      const items = filterSectionItems(section.items, dietChoice, seenIds, seenDedupeKeys);
      if (items.length > 0) {
        sections.push({ title: section.title, items });
      }
    }
  }

  const cuisineIds = new Set<string>(favoriteCuisines);
  if (dietChoice === 'Jain') {
    cuisineIds.add('jain');
  }

  const cuisineOrder = [
    ...favoriteCuisines,
    ...[...cuisineIds].filter((id) => !favoriteCuisines.includes(id)),
  ];

  for (const cuisineId of cuisineOrder) {
    const cuisineSection = PANTRY_CUISINE_SECTIONS.find((entry) => entry.cuisineId === cuisineId);
    if (!cuisineSection) continue;

    const items = filterSectionItems(cuisineSection.items, dietChoice, seenIds, seenDedupeKeys);
    if (items.length === 0) continue;

    sections.push({
      title: cuisineSection.title,
      items,
    });
  }

  return {
    sections,
    preferenceSummary: buildPreferenceSummary(dietChoice, favoriteCuisines, kitchenStyles),
  };
}
