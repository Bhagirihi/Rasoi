import JsonLd from '@/app/_components/JsonLd';
import MarketLanding from '@/app/_components/MarketLanding';
import { getMarketConfig } from '@/lib/markets';
import { buildMarketMetadata, marketJsonLdBundle } from '@/lib/seo';

const market = getMarketConfig('IN');

export const metadata = buildMarketMetadata(market);
export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <JsonLd data={marketJsonLdBundle('IN')} />
      <MarketLanding market={market} />
    </>
  );
}
