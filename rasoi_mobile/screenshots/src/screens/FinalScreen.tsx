import { JamvanuFrame } from '@/components/JamvanuFrame';
import { RecipesGridShowcase, StoreContent } from '@/illustrations/StoreLayouts';

export function FinalScreen() {
  return (
    <JamvanuFrame decor="final" headline={'Cook Smarter\nWith Rasoi'} tagline="Step-by-step recipes that actually work">
      <StoreContent>
        <RecipesGridShowcase />
      </StoreContent>
    </JamvanuFrame>
  );
}
