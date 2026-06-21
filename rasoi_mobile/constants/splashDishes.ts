import { UNSPLASH, unsplashPhotoUrl } from '@/constants/unsplashPhotos';

/** Curated Indian dish photos for splash / loading screens. */
export type SplashDish = {
  uri: string;
  label: string;
};

export const SPLASH_DISHES: SplashDish[] = [
  { uri: unsplashPhotoUrl(UNSPLASH.biryani, 400, 75), label: 'Biryani' },
  { uri: unsplashPhotoUrl(UNSPLASH.dal, 400, 75), label: 'Dal & rice' },
  { uri: unsplashPhotoUrl(UNSPLASH.paratha, 400, 75), label: 'Paratha' },
  { uri: unsplashPhotoUrl(UNSPLASH.dosa, 400, 75), label: 'Dosa' },
  { uri: unsplashPhotoUrl(UNSPLASH.thali, 400, 75), label: 'Thali' },
  { uri: unsplashPhotoUrl(UNSPLASH.curry, 400, 75), label: 'Curry' },
];
