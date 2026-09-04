import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { jsonOk, handleApiError } from '@/lib/api';
import { logRecipeSearch } from '@/lib/recipe-search-log';
import { recipeSearchSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = recipeSearchSchema.parse(body);
    const user = await getUserFromRequest(request);

    const id = await logRecipeSearch({
      userId: user?.id,
      query: input.query,
      sourceScreen: input.sourceScreen,
      resultCount: input.resultCount,
    });

    return jsonOk({ id }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
