import JsonLd from '@/app/_components/JsonLd';
import MarketLanding from '@/app/_components/MarketLanding';
import { getPublishedRecipeCount } from '@/lib/home-stats';
import { getMarketConfig } from '@/lib/markets';
import { buildMarketMetadata, marketJsonLdBundle } from '@/lib/seo';

const market = getMarketConfig('AU');

export const metadata = buildMarketMetadata(market);
export const revalidate = 300;

export default async function AustraliaMarketPage() {
  const recipeCount = await getPublishedRecipeCount();

  return (
    <>
      <JsonLd data={marketJsonLdBundle('AU')} />
      <MarketLanding market={market} recipeCount={recipeCount} />
    </>
  );
}
