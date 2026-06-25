import { NextRequest } from 'next/server';

import { jsonError, jsonOk } from '@/lib/api';
import { isAuthorizedCronRequest } from '@/lib/cron-auth';
import { runDbCleanup } from '@/lib/db-cleanup';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return jsonError('Unauthorized', 401);
  }

  const result = await runDbCleanup();

  if (!result.ok) {
    return jsonOk(result, 207);
  }

  return jsonOk(result);
}
