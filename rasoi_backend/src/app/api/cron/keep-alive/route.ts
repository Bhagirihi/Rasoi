import { NextRequest } from 'next/server';

import { isAuthorizedCronRequest } from '@/lib/cron-auth';
import { jsonError, jsonOk } from '@/lib/api';
import { runSupabaseKeepAlive } from '@/lib/supabase-keep-alive';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return jsonError('Unauthorized', 401);
  }

  const result = await runSupabaseKeepAlive();

  if (!result.ok) {
    return jsonOk(result, 207);
  }

  return jsonOk(result);
}
