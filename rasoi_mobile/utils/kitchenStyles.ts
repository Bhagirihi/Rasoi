export type KitchenStyle = {
  id: string;
  label: string;
  tagline: string;
  mood: string;
  region: string;
  heroImage: string;
};

export function getKitchenStyleLabel(id: string, styles: KitchenStyle[]): string {
  return styles.find((style) => style.id === id)?.label ?? id;
}

export function cuisinesToRegion(favoriteCuisines: string[], styles: KitchenStyle[]): string {
  if (favoriteCuisines.length === 0) return 'All India';
  if (favoriteCuisines.length > 1) return 'All India';

  const regionMap = Object.fromEntries(styles.map((style) => [style.id, style.region]));
  return regionMap[favoriteCuisines[0]] ?? 'All India';
}
