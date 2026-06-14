import { NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { sponsorUpdateSchema } from '@/lib/validators';
import { serializeSponsor } from '@/lib/serializers';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const sponsor = await prisma.sponsor.findUnique({ where: { id } });

    if (!sponsor) return jsonError('Sponsor not found', 404);

    return jsonOk(serializeSponsor(sponsor));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const { id } = await context.params;
    const existing = await prisma.sponsor.findUnique({ where: { id } });
    if (!existing) return jsonError('Sponsor not found', 404);

    const body = await request.json();
    const input = sponsorUpdateSchema.parse(body);

    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: input,
    });

    return jsonOk(serializeSponsor(sponsor));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const { id } = await context.params;
    const existing = await prisma.sponsor.findUnique({ where: { id } });
    if (!existing) return jsonError('Sponsor not found', 404);

    await prisma.sponsor.delete({ where: { id } });

    return jsonOk({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
