import { optionalAuthApiFetch } from '@/utils/api';

export type RecipeSearchPayload = {
  query: string;
  sourceScreen?: string;
  resultCount?: number;
};

export async function logRecipeSearch(payload: RecipeSearchPayload): Promise<void> {
  const query = payload.query.trim();
  if (query.length < 2) return;

  try {
    await optionalAuthApiFetch<{ id: string }>('/api/recipe-searches', {
      method: 'POST',
      body: JSON.stringify({
        query,
        sourceScreen: payload.sourceScreen ?? 'home',
        resultCount: payload.resultCount,
      }),
    });
  } catch {
    // Search logging should never block browsing.
  }
}
