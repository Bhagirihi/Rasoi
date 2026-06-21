import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { pushTokenSchema } from '@/lib/validators';

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = pushTokenSchema.parse(body);

    const record = await db.pushToken.upsert({
      where: {
        userId_expoPushToken: {
          userId: user.id,
          expoPushToken: input.expoPushToken,
        },
      },
      create: {
        userId: user.id,
        expoPushToken: input.expoPushToken,
        platform: input.platform,
        active: input.active,
      },
      update: {
        platform: input.platform,
        active: input.active,
      },
    });

    return jsonOk({
      id: record.id,
      expoPushToken: record.expoPushToken,
      platform: record.platform,
      active: record.active,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json().catch(() => ({}));
    const parsed = pushTokenSchema.partial({ active: true }).safeParse(body);

    if (parsed.success && parsed.data.expoPushToken) {
      await db.pushToken.updateMany({
        where: {
          userId: user.id,
          expoPushToken: parsed.data.expoPushToken,
        },
        data: { active: false },
      });
    } else {
      await db.pushToken.updateMany({
        where: { userId: user.id },
        data: { active: false },
      });
    }

    return jsonOk({ deactivated: true });
  } catch (error) {
    return handleApiError(error);
  }
}
