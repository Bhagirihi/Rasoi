import { JamvanuFrame } from '@/components/JamvanuFrame';
import { NotificationShowcase, StoreContent } from '@/illustrations/StoreLayouts';

export function CookShopOrderScreen() {
  return (
    <JamvanuFrame decor="notifications" headline={'5 Daily\nMeal Picks'} tagline="Breakfast to late-night — personalised for you">
      <StoreContent>
        <NotificationShowcase />
      </StoreContent>
    </JamvanuFrame>
  );
}
