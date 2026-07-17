export type KitchenStyle = {
  id: string;
  label: string;
  tagline: string;
  mood: string;
  region: string;
  heroImage: string;
};

const DIET_STYLE_IDS = new Set(['jain', 'vegetarian']);

export function isSelectableKitchenStyle(style: KitchenStyle): boolean {
  return !DIET_STYLE_IDS.has(style.id.toLowerCase());
}

export function getSelectableKitchenStyles(styles: KitchenStyle[]): KitchenStyle[] {
  return styles.filter(isSelectableKitchenStyle);
}

export function getKitchenStyleLabel(id: string, styles: KitchenStyle[]): string {
  return styles.find((style) => style.id === id)?.label ?? id;
}

export function cuisinesToRegion(favoriteCuisines: string[], styles: KitchenStyle[]): string {
  if (favoriteCuisines.length === 0) return 'All India';
  if (favoriteCuisines.length > 1) return 'All India';

  const regionMap = Object.fromEntries(styles.map((style) => [style.id, style.region]));
  return regionMap[favoriteCuisines[0]] ?? 'All India';
}
