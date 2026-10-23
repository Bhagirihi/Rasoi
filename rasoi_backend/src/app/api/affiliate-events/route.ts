import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { affiliateEventSchema } from '@/lib/validators';
import { enforceRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Anonymous endpoint: rate-limit by IP so bots can't poison affiliate analytics.
    const limited = enforceRateLimit(request, 'affiliate-events', 60, 60_000);
    if (!limited.ok) {
      return jsonError('Too many requests. Please try again shortly.', 429);
    }

    const body = await request.json();
    const input = affiliateEventSchema.parse(body);
    const user = await getUserFromRequest(request);

    const event = await db.affiliateEvent.create({
      data: {
        userId: user?.id,
        partner: input.partner,
        context: input.context,
        recipeId: input.recipeId,
        query: input.query,
      },
    });

    return jsonOk({ id: event.id }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
