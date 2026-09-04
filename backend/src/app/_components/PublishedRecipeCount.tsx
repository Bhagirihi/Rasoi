import type { MarketId } from '@/lib/markets';
import { MARKETING_RECIPE_COUNT } from '@/lib/home-stats';

type PublishedRecipeCountProps = {
  marketId: MarketId;
};

export default function PublishedRecipeCount({ marketId }: PublishedRecipeCountProps) {
  return (
    <p className="mt-12 text-sm text-landing-muted">
      <span className="font-semibold text-landing-ink">
        {MARKETING_RECIPE_COUNT.toLocaleString('en-IN')}+ curated recipes
      </span>
      {marketId === 'IN'
        ? ' across North, South, East, West & Central India'
        : ' — Gujarati, Punjabi, South Indian, Bengali & 12 more cuisines'}
    </p>
  );
}
