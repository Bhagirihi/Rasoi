import { NeumoFrame } from '@/components/NeumoFrame';
import { DinnerAlternateRow, DinnerFeaturedCard } from '@/illustrations/StoreLayouts';
import { FOOD_IMAGES } from '@/theme';

export function TodaysPicksScreen() {
  return (
    <NeumoFrame headline={'Dinner,\nDecided.'} tagline="Know what to cook in seconds" float="star">
      <DinnerFeaturedCard
        image={FOOD_IMAGES.paneer}
        title="Paneer Butter Masala"
        meta="25 min · Main · Ready-to-cook"
      />
      <DinnerAlternateRow
        items={[
          { image: FOOD_IMAGES.dosa, title: 'Masala Dosa', meta: 'Under 20 min' },
          { image: FOOD_IMAGES.dal, title: 'Dal Tadka', meta: '25 min' },
        ]}
      />
    </NeumoFrame>
  );
}
