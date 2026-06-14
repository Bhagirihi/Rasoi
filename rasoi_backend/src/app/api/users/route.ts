import { NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { jsonOk, handleApiError } from '@/lib/api';
import { serializeUser } from '@/lib/serializers';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return jsonOk(users.map(serializeUser));
  } catch (error) {
    return handleApiError(error);
  }
}
