import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { getOrBuildGroceryList, rebuildGroceryList } from '@/lib/grocery-list';
import { getWeekStart } from '@/lib/meal-planner';
import { plannerWeekSchema } from '@/lib/validators';

const WEEK_KEY = /^\d{4}-\d{2}-\d{2}$/;

function toListResponse(result: {
  list: { id: string; weekStart: string };
  planId: string | null;
  items: Array<{ id: string; name: string; section: string; checked: boolean }>;
}) {
  return {
    list: { id: result.list.id, weekStart: result.list.weekStart },
    planId: result.planId,
    items: result.items.map((item) => ({
      id: item.id,
      name: item.name,
      section: item.section,
      checked: item.checked,
    })),
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const { searchParams } = new URL(request.url);
    const raw = searchParams.get('weekStart') ?? '';
    if (!WEEK_KEY.test(raw)) return jsonError('weekStart must be YYYY-MM-DD', 400);

    let result = await getOrBuildGroceryList(user.id, getWeekStart(raw));
    // First visit for a week with a plan but no stored list: build it now
    // so the tab never shows an empty list for a planned week.
    if (result.items.length === 0 && result.planId) {
      result = await rebuildGroceryList(user.id, getWeekStart(raw));
    }
    return jsonOk(toListResponse(result));
  } catch (error) {
    return handleApiError(error);
  }
}

/** Rebuild the list from the current plan (checked state is preserved). */
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = plannerWeekSchema.parse(body);
    const result = await rebuildGroceryList(user.id, input.weekStart);
    return jsonOk(toListResponse(result));
  } catch (error) {
    return handleApiError(error);
  }
}
