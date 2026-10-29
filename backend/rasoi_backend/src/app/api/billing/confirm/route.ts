import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { getAppConfig } from '@/lib/app-settings';
import { isRasoiPlusProductId } from '@/lib/billing-products';
import { isStubBillingAllowed } from '@/lib/env';
import { db } from '@/lib/db';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { serializeUser } from '@/lib/serializers';
import { customerHasActiveRasoiPlus, isRevenueCatServerConfigured } from '@/lib/revenuecat';
import { markYearlyPromoConsumed } from '@/lib/promo-codes';
import { z } from 'zod';

const confirmSchema = z.object({
  provider: z.enum(['stub', 'revenuecat', 'razorpay']),
  productId: z.string().min(1),
  transactionId: z.string().min(1),
});

/**
 * Server-side subscription confirmation after a native store purchase.
 * RevenueCat: verifies active `rasoi_plus` entitlement via RevenueCat API.
 * Stub: dev-only when ALLOW_STUB_BILLING=1.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const config = await getAppConfig();
    if (!config.paymentsEnabled) {
      return jsonError('Payments are not enabled', 403);
    }

    const body = await request.json();
    const input = confirmSchema.parse(body);

    if (input.provider === 'razorpay') {
      return jsonError(
        'Razorpay verification is not configured yet. Add webhook handler before go-live.',
        501,
      );
    }

    if (input.provider === 'revenuecat') {
      if (!isRevenueCatServerConfigured()) {
        return jsonError('Subscription verification is temporarily unavailable', 503);
      }

      if (!isRasoiPlusProductId(input.productId)) {
        return jsonError('Unknown subscription product.', 400);
      }

      const hasEntitlement = await customerHasActiveRasoiPlus(user.id);
      if (!hasEntitlement) {
        return jsonError(
          'No active Rasoi Plus subscription found. Wait a moment and try Restore purchases.',
          402,
        );
      }

      const updated = await db.user.update({
        where: { id: user.id },
        data: {
          planTier: 'paid',
          hasUsedTrial: true,
          ...(input.productId.includes('yearly') ? { yearlyPromoOfferTag: null } : {}),
        },
      });

      if (input.productId.includes('yearly')) {
        await markYearlyPromoConsumed(user.id);
      }

      return jsonOk({
        provider: input.provider,
        productId: input.productId,
        transactionId: input.transactionId,
        plan: serializeUser(updated).plan,
      });
    }

    if (!isStubBillingAllowed()) {
      return jsonError('Stub billing is disabled in this environment', 403);
    }

    const updated = await db.user.update({
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
