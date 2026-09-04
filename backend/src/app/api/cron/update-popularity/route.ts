import { NextRequest } from 'next/server';

import { isAuthorizedCronRequest } from '@/lib/cron-auth';
import { jsonError, jsonOk } from '@/lib/api';
import { updateRecipePopularityScores } from '@/lib/recipe-popularity';

export const dynamic = 'force-dynamic';

/** Daily cron: refresh recipe popularityScore from views/cooks (last 90 days). */
export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return jsonError('Unauthorized', 401);
  }

  const result = await updateRecipePopularityScores();
  return jsonOk({ ok: true, ...result });
}
