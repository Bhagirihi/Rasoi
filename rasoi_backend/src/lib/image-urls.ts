/** Verified working Unsplash photo IDs (GET returns 200). */
export const WORKING_UNSPLASH_PHOTOS = [
  'photo-1585937421612-70a008356fbe',
  'photo-1631452180519-c014fe946bc7',
  'photo-1601050690597-df0568f70950',
  'photo-1565557623262-b51c2513a641',
  'photo-1563379091339-03b21ab4a4f8',
  'photo-1555939594-58d7cb561ad1',
  'photo-1546069901-ba9599a7e63c',
  'photo-1504674900247-0877df9cc836',
  'photo-1596797038530-2c107229654b',
  'photo-1525351484163-7529414344d8',
  'photo-1565299624946-b28f40a0ae38',
  'photo-1567620905732-2d1ec7ab7445',
  'photo-1512058564366-18510be2db19',
  'photo-1540189549336-e6e99c3679fe',
  'photo-1559847844-5315695dadae',
  'photo-1582878826629-29b7ad1cdc43',
] as const;

export function unsplashImageUrl(photoId: string, width = 800): string {
  return `https://images.unsplash.com/${photoId}?w=${width}&q=80`;
}

export function recipeImageUrl(index: number): string {
  const photoId = WORKING_UNSPLASH_PHOTOS[index % WORKING_UNSPLASH_PHOTOS.length];
  return unsplashImageUrl(photoId);
}

export function kitchenStyleHeroUrl(photoId: string): string {
  return unsplashImageUrl(photoId, 400);
}
