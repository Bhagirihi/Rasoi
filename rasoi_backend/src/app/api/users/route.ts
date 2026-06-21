import { NextRequest } from 'next/server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { jsonOk, handleApiError } from '@/lib/api';
import { serializeUser } from '@/lib/serializers';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return jsonOk(users.map(serializeUser));
  } catch (error) {
    return handleApiError(error);
  }
}
