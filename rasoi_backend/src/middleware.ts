import { type NextRequest, NextResponse } from 'next/server';

import { API_CORS_HEADERS } from '@/lib/cors';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api');
  const isAdmin = pathname.startsWith('/admin');

  if (isApi) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: API_CORS_HEADERS });
    }

    const response = NextResponse.next();
    for (const [key, value] of Object.entries(API_CORS_HEADERS)) {
      response.headers.set(key, value);
    }
    return response;
  }

  // Rasoi admin uses JWT cookie auth — not Supabase Auth session cookies.
  if (isAdmin) {
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
