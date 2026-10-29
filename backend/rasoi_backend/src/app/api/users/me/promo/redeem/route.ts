import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { getAppConfig } from '@/lib/app-settings';
import { db } from '@/lib/db';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { enforceRateLimit } from '@/lib/rate-limit';
import { PromoError, redeemPromoCode } from '@/lib/promo-codes';
import { serializeUser } from '@/lib/serializers';
import { promoRedeemSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const limited = enforceRateLimit(request, 'promo-redeem', 12, 60_000);
    if (!limited.ok) {
      return jsonError('Too many attempts. Try again shortly.', 429);
    }

    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const config = await getAppConfig();
    if (!config.paymentsEnabled) {
      return jsonError('Promo codes are not available right now', 403);
    }

    const body = await request.json();
    const input = promoRedeemSchema.parse(body);

    const result = await redeemPromoCode(user, input.code);

    const updated = await db.user.findUnique({ where: { id: user.id } });

    return jsonOk({
      ...result,
      plan: updated ? serializeUser(updated).plan : serializeUser(user).plan,
    });
  } catch (error) {
    if (error instanceof PromoError) {
      return jsonError(error.message, error.status);
    }
    return handleApiError(error);
  }
}
