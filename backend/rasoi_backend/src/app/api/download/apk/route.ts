import { NextResponse } from 'next/server';

import { SITE_URL } from '@/lib/seo';

const FALLBACK_APK_URL = `${SITE_URL}/rasoi-release.apk`;

/** Redirect /api/download/apk → latest Expo EAS artifact, or Vercel-hosted APK. */
export async function GET() {
  const expoApkUrl = process.env.ANDROID_APK_EXPO_URL?.trim();

  if (expoApkUrl) {
    return NextResponse.redirect(expoApkUrl, 302);
  }

  return NextResponse.redirect(FALLBACK_APK_URL, 302);
}
