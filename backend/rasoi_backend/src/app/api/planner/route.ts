import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { generateWeekPlan, getWeekPlanWithRecipes, getWeekStart } from '@/lib/meal-planner';
import { plannerWeekSchema } from '@/lib/validators';

const WEEK_KEY = /^\d{4}-\d{2}-\d{2}$/;

function toPlanResponse(plan: { id: string; weekStart: string; status: string }, items: unknown) {
  return { plan: { id: plan.id, weekStart: plan.weekStart, status: plan.status }, items };
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const { searchParams } = new URL(request.url);
    const raw = searchParams.get('weekStart') ?? '';
    if (!WEEK_KEY.test(raw)) return jsonError('weekStart must be YYYY-MM-DD', 400);

    const { plan, items } = await getWeekPlanWithRecipes(user.id, getWeekStart(raw));
    return jsonOk(toPlanResponse(plan, items));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = plannerWeekSchema.parse(body);
    const { plan, items } = await generateWeekPlan(user.id, input.weekStart);
    return jsonOk(toPlanResponse(plan, items));
  } catch (error) {
    return handleApiError(error);
  }
}
