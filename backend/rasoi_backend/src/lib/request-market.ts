import { cookies, headers } from 'next/headers';

import {
  geoCountryToMarketId,
  MARKET_COOKIE,
  marketIdFromCookie,
  type MarketId,
} from '@/lib/markets';

/**
 * Resolve the visitor's market for a server-rendered page. Cookie wins
 * (same precedence as the middleware geo redirect), then the Vercel geo
 * header, then India (the default market). Used to hide India-only features
 * — "Shop missing ingredients" / partner checkout — from visitors outside
 * India. Do not import this from middleware (next/headers is not available
 * in the Edge runtime).
 */
export async function resolveRequestMarketId(): Promise<MarketId> {
  const cookieStore = await cookies();
  const cookieMarket = marketIdFromCookie(cookieStore.get(MARKET_COOKIE)?.value);
  if (cookieMarket) return cookieMarket;

  const headerList = await headers();
  const geoMarket = geoCountryToMarketId(
    headerList.get('x-vercel-ip-country') ?? undefined,
  );
  if (geoMarket) return geoMarket;

  return 'IN';
}
