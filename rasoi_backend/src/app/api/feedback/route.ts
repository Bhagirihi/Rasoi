import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { jsonOk, handleApiError } from '@/lib/api';
import { feedbackSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = feedbackSchema.parse(body);
    const user = await getUserFromRequest(request);

    const feedback = await prisma.userFeedback.create({
      data: {
        userId: user?.id,
        category: input.category,
        message: input.message,
        name: input.name ?? user?.name,
        email: input.email ?? user?.email ?? undefined,
        appVersion: input.appVersion,
        platform: input.platform,
        status: 'pending',
      },
    });

    return jsonOk(
      {
        id: feedback.id,
        message: 'Thanks for your feedback. Our team will review it soon.',
      },
      201,
    );
  } catch (error) {
    return handleApiError(error);
  }
}
