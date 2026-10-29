/** Set EXPO_PUBLIC_SCREENSHOT_MODE=1 when capturing App Store / Play Store screenshots. */
export const SCREENSHOT_MODE = process.env.EXPO_PUBLIC_SCREENSHOT_MODE === '1';

export const SCREENSHOT_DEMO = {
  userName: 'Priya',
  userPhone: '9876543210',
  dietChoice: 'Veg' as const,
  regionalCuisine: 'All India',
  favoriteCuisines: ['south', 'north'] as const,
  notificationsEnabled: true,
  pantryIngredients: [
    'Atta',
    'Rice',
    'Dal',
    'Namak',
    'Oil',
    'Haldi',
    'Paneer',
    'Tamatar',
    'Pyaaz',
    'Jeera',
  ],
  savedRecipeIds: ['1', '2', '4'],
};
