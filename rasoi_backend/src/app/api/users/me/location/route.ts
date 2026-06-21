import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { userLocationSchema } from '@/lib/validators';
import { serializeUser } from '@/lib/serializers';

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = userLocationSchema.parse(body);

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        city: input.city,
        state: input.state ?? null,
        latitude: input.latitude,
        longitude: input.longitude,
        locationUpdatedAt: new Date(),
      },
    });

    return jsonOk(serializeUser(updated));
  } catch (error) {
    return handleApiError(error);
  }
}
