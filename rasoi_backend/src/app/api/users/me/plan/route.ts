import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { planUpdateSchema } from '@/lib/validators';
import { serializeUser } from '@/lib/serializers';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    return jsonOk(serializeUser(user).plan);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = planUpdateSchema.parse(body);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        planTier: input.planTier,
        trialStartedAt: input.trialStartedAt ? new Date(input.trialStartedAt) : undefined,
        hasUsedTrial: input.hasUsedTrial,
      },
    });

    return jsonOk(serializeUser(updated).plan);
  } catch (error) {
    return handleApiError(error);
  }
}
