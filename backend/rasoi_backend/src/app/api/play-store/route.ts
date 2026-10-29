import { NextResponse } from 'next/server';

import { PLAY_STORE_LISTING_URL } from '@/lib/app-download';

/** Redirect /api/play-store → official Google Play listing. */
export async function GET() {
  return NextResponse.redirect(PLAY_STORE_LISTING_URL, 302);
}
