import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { jsonOk, handleApiError } from '@/lib/api';
import { affiliateEventSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = affiliateEventSchema.parse(body);
    const user = await getUserFromRequest(request);

    const event = await prisma.affiliateEvent.create({
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
