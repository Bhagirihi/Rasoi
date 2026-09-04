import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { jsonOk, handleApiError } from '@/lib/api';
import { sponsorEventSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
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
