/** Verified Unsplash photo IDs (images.unsplash.com returns 200). */
export const UNSPLASH = {
  biryani: 'photo-1563379091339-03b21ab4a4f8',
  dal: 'photo-1585937421612-70a008356fbe',
  paratha: 'photo-1631452180519-c014fe946bc7',
  dosa: 'photo-1525351484163-7529414344d8',
  thali: 'photo-1546069901-ba9599a7e63c',
  curry: 'photo-1596797038530-2c107229654b',
  streetFood: 'photo-1555939594-58d7cb561ad1',
  punjabi: 'photo-1601050690597-df0568f70950',
  rajasthani: 'photo-1565557623262-b51c2513a641',
  fish: 'photo-1519708227418-c8fd9a32b7a2',
  noodles: 'photo-1617093727343-374698b1b08d',
  kashmiri: 'photo-1504674900247-0877df9cc836',
  breakfast: 'photo-1559847844-5315695dadae',
  pulao: 'photo-1582878826629-29b7ad1cdc43',
  tikka: 'photo-1567620905732-2d1ec7ab7445',
  maharashtrian: 'photo-1512058564366-18510be2db19',
  salad: 'photo-1540189549336-e6e99c3679fe',
  pizza: 'photo-1565299624946-b28f40a0ae38',
} as const;

export function unsplashPhotoUrl(photoId: string, width = 800, quality = 80): string {
  return `https://images.unsplash.com/${photoId}?w=${width}&q=${quality}`;
}
