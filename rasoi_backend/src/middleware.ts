import { type NextRequest, NextResponse } from 'next/server';

import { buildCorsHeaders } from '@/lib/cors';
import {
  geoCountryToMarketId,
  MARKET_COOKIE,
  MARKET_PATHS,
  marketIdFromCookie,
} from '@/lib/markets';
import { updateSession } from '@/utils/supabase/middleware';

const CRAWLER_UA =
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot/i;

function isCrawler(userAgent: string | null): boolean {
  return CRAWLER_UA.test(userAgent ?? '');
}

function resolveGeoMarket(request: NextRequest) {
  const country = request.headers.get('x-vercel-ip-country') ?? undefined;
  return geoCountryToMarketId(country);
}

function applyGeoMarketRedirect(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (pathname !== '/') return null;

  const cookieMarket = marketIdFromCookie(request.cookies.get(MARKET_COOKIE)?.value);
  if (cookieMarket && cookieMarket !== 'IN') {
    const target = MARKET_PATHS[cookieMarket];
    return NextResponse.redirect(new URL(target, request.url), 302);
  }

  if (cookieMarket === 'IN') return null;

  if (isCrawler(request.headers.get('user-agent'))) return null;

  const geoMarket = resolveGeoMarket(request);
  if (geoMarket && geoMarket !== 'IN') {
    return NextResponse.redirect(new URL(MARKET_PATHS[geoMarket], request.url), 302);
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api');
  const isAdmin = pathname.startsWith('/admin');
  const origin = request.headers.get('origin');

  if (isApi) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: buildCorsHeaders(origin) });
    }

    const response = NextResponse.next();
    for (const [key, value] of Object.entries(buildCorsHeaders(origin))) {
      response.headers.set(key, value);
    }
    return response;
  }

  if (isAdmin) {
    return NextResponse.next();
  }

  const geoRedirect = applyGeoMarketRedirect(request);
  if (geoRedirect) return geoRedirect;

  return updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
