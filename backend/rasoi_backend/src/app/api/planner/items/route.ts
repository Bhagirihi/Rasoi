import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { addPlanItem, setPlanItemStatus } from '@/lib/meal-planner';
import { plannerItemSchema, plannerItemStatusSchema } from '@/lib/validators';

/** Add (or swap) the recipe for one day/slot. Upsert by plan+date+slot. */
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = plannerItemSchema.parse(body);
    const item = await addPlanItem({ userId: user.id, ...input });
    return jsonOk({ item });
  } catch (error) {
    return handleApiError(error);
  }
}

/** Mark an item cooked / skipped / planned / removed. */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = plannerItemStatusSchema.parse(body);
    const item = await setPlanItemStatus(user.id, input.id, input.status);
    return jsonOk({ item });
  } catch (error) {
    return handleApiError(error);
  }
}
