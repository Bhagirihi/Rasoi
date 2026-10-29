import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { getAppConfig } from '@/lib/app-settings';
import { db } from '@/lib/db';
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

/** Client may start a trial or sync down to free — never grant paid without billing verification. */
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = planUpdateSchema.parse(body);

    if (input.planTier === 'paid') {
      return jsonError('Plan upgrades must go through Google Play or the billing provider', 403);
    }

    if (input.planTier === 'trial') {
      const config = await getAppConfig();
      if (!config.paymentsEnabled) {
        return jsonError('Trials are not available right now', 403);
      }
      if (user.hasUsedTrial || user.planTier === 'trial') {
        return jsonError('Trial already used', 403);
      }

      const updated = await db.user.update({
        where: { id: user.id },
        data: {
          planTier: 'trial',
          trialStartedAt: input.trialStartedAt ? new Date(input.trialStartedAt) : new Date(),
          hasUsedTrial: true,
        },
      });

      return jsonOk(serializeUser(updated).plan);
    }

    if (input.planTier === 'free') {
      if (user.planTier === 'paid') {
        return jsonError('Active subscriptions are managed through Google Play', 403);
      }

      const updated = await db.user.update({
        where: { id: user.id },
        data: { planTier: 'free' },
      });

      return jsonOk(serializeUser(updated).plan);
    }

    return jsonError('Invalid plan update', 400);
  } catch (error) {
    return handleApiError(error);
  }
}
