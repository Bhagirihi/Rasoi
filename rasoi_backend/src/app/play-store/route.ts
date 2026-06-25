import { NextResponse } from 'next/server';

import { PLAY_STORE_LISTING_URL } from '@/lib/app-download';

/** Short vanity URL: rasoiapplication.in/play-store → Google Play. */
export async function GET() {
  return NextResponse.redirect(PLAY_STORE_LISTING_URL, 302);
}
