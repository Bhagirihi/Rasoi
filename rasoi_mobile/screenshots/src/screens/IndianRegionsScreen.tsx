import { JamvanuFrame } from '@/components/JamvanuFrame';
import { CuisineStatRow, RegionRecipeGrid, StoreContent } from '@/illustrations/StoreLayouts';
import { FOOD_IMAGES } from '@/theme';

export function IndianRegionsScreen() {
  return (
    <JamvanuFrame decor="recipes" headline={'1,200+\nRecipes'} tagline="Your favourite regional flavours in one app">
      <StoreContent>
        <CuisineStatRow />
        <RegionRecipeGrid
          items={[
            { image: FOOD_IMAGES.dal, title: 'Gujarati Dal Dhokli', region: 'Gujarati Home' },
            { image: FOOD_IMAGES.dosa, title: 'Masala Dosa', region: 'South Indian' },
            { image: FOOD_IMAGES.paneer, title: 'Paneer Butter Masala', region: 'Punjabi' },
            { image: FOOD_IMAGES.thali, title: 'Shukto', region: 'Bengali' },
          ]}
        />
      </StoreContent>
    </JamvanuFrame>
  );
}
