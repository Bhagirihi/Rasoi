import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { serializeUser } from '@/lib/serializers';
import { z } from 'zod';

const confirmSchema = z.object({
  provider: z.enum(['stub', 'revenuecat', 'razorpay']),
  productId: z.string().min(1),
  transactionId: z.string().min(1),
});

/**
 * Server-side subscription confirmation.
 * Stub: trusts mobile in dev (same as PUT /plan today).
 * Production: verify RevenueCat webhook / Razorpay signature before updating plan.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = confirmSchema.parse(body);

    if (input.provider === 'revenuecat' || input.provider === 'razorpay') {
      return jsonError(
        `${input.provider} verification is not configured yet. Add webhook handler before go-live.`,
        501,
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        planTier: 'paid',
        hasUsedTrial: true,
      },
    });

    return jsonOk({
      provider: input.provider,
      transactionId: input.transactionId,
      plan: serializeUser(updated).plan,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
