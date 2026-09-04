import { NextRequest } from 'next/server';

import { jsonOk, handleApiError } from '@/lib/api';
import { getUserFromRequest } from '@/lib/auth';
import { getActiveHomeAnnouncement } from '@/lib/home-announcements';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appVersion = searchParams.get('appVersion')?.trim() || null;
    const user = await getUserFromRequest(request);
    const announcement = await getActiveHomeAnnouncement(user, appVersion);

    return jsonOk({ announcement });
  } catch (error) {
    return handleApiError(error);
  }
}
