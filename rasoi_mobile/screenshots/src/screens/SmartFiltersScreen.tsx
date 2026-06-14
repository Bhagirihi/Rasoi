import { JamvanuFrame } from '@/components/JamvanuFrame';
import { PartnerShowcase, StoreContent } from '@/illustrations/StoreLayouts';

export function SmartFiltersScreen() {
  return (
    <JamvanuFrame decor="partners" headline={'Shop. Order.\nEat.'} tagline="From recipe to ready meal — one app">
      <StoreContent>
        <PartnerShowcase />
      </StoreContent>
    </JamvanuFrame>
  );
}
