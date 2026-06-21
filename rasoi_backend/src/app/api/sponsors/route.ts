import { NextRequest } from 'next/server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { jsonOk, handleApiError } from '@/lib/api';
import { sponsorCreateSchema } from '@/lib/validators';
import { serializeSponsor } from '@/lib/serializers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get('placement');
    const activeOnly = searchParams.get('active') !== 'false';

    const sponsors = await db.sponsor.findMany({
      where: {
        placement: placement ?? undefined,
        active: activeOnly ? true : undefined,
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    return jsonOk(sponsors.map(serializeSponsor));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const body = await request.json();
    const input = sponsorCreateSchema.parse(body);

    const sponsor = await db.sponsor.create({
      data: input,
    });

    return jsonOk(serializeSponsor(sponsor), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
