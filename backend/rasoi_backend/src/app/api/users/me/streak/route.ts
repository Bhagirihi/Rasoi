import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { getCookingStreak, resolveTimezone } from '@/lib/cooking-streak';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const streak = await getCookingStreak(user.id, resolveTimezone(user.timezone));
    return jsonOk({ streak });
  } catch (error) {
    return handleApiError(error);
  }
}
