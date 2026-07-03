import { NextResponse } from 'next/server';

import { PLAY_STORE_SEO_PATH } from '@/lib/app-download';
import { absoluteUrl } from '@/lib/seo';

/** Legacy keyword URL → canonical Play Store SEO page. */
export async function GET() {
  return NextResponse.redirect(absoluteUrl(PLAY_STORE_SEO_PATH), 301);
}
