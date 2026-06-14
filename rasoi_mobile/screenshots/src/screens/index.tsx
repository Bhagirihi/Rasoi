import type { ReactElement } from 'react';

import type { ScreenId } from '@/theme';
import { CookShopOrderScreen } from '@/screens/CookShopOrderScreen';
import { FinalScreen } from '@/screens/FinalScreen';
import { HeroScreen } from '@/screens/HeroScreen';
import { IndianRegionsScreen } from '@/screens/IndianRegionsScreen';
import { PantryMatchScreen } from '@/screens/PantryMatchScreen';
import { PersonalizationScreen } from '@/screens/PersonalizationScreen';
import { SmartFiltersScreen } from '@/screens/SmartFiltersScreen';
import { TodaysPicksScreen } from '@/screens/TodaysPicksScreen';

const SCREENS: Record<ScreenId, () => ReactElement> = {
  hero: HeroScreen,
  'todays-picks': TodaysPicksScreen,
  'pantry-match': PantryMatchScreen,
  'indian-regions': IndianRegionsScreen,
  'smart-filters': SmartFiltersScreen,
  'cook-shop-order': CookShopOrderScreen,
  personalization: PersonalizationScreen,
  final: FinalScreen,
};

export function getScreen(id: ScreenId) {
  const Screen = SCREENS[id];
  return Screen ? <Screen /> : <HeroScreen />;
}

export function getScreenIdFromQuery(): ScreenId | 'gallery' {
  const params = new URLSearchParams(window.location.search);
  const screen = params.get('screen');
  if (screen === 'gallery' || !screen) return 'gallery';
  if (screen in SCREENS) return screen as ScreenId;
  return 'gallery';
}

export { SCREENS };
