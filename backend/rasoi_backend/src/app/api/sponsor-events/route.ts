import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { sponsorEventSchema } from '@/lib/validators';
import { enforceRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Anonymous endpoint: rate-limit by IP so bots can't spam fake sponsor events.
    const limited = enforceRateLimit(request, 'sponsor-events', 60, 60_000);
    if (!limited.ok) {
      return jsonError('Too many requests. Please try again shortly.', 429);
    }

    const body = await request.json();
    const input = sponsorEventSchema.parse(body);
    const user = await getUserFromRequest(request);

    const event = await db.sponsorEvent.create({
      data: {
        userId: user?.id,
        eventType: input.eventType,
        brandName: input.brandName,
        placement: input.placement,
        sponsorId: input.sponsorId,
        partner: input.partner,
        query: input.query,
        city: input.city ?? user?.city ?? undefined,
      },
    });

    return jsonOk({ id: event.id }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
