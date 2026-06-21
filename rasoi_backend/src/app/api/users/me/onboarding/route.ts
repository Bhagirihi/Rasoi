import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { getAutoTrialWriteIfEligible } from '@/lib/auto-trial';
import { validateFavoriteCuisines } from '@/lib/kitchen-styles';
import { db } from '@/lib/db';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { onboardingSchema } from '@/lib/validators';
import { serializeUser } from '@/lib/serializers';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = onboardingSchema.parse(body);
    await validateFavoriteCuisines(input.favoriteCuisines);

    const trialUpdate = await getAutoTrialWriteIfEligible(user);

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        hasCompletedOnboarding: true,
        dietPreference: input.dietPreference,
        dietChoice: input.dietChoice,
        regionalCuisine: input.regionalCuisine,
        favoriteCuisines: JSON.stringify(input.favoriteCuisines),
        notificationsEnabled: input.notificationsEnabled,
        ...trialUpdate,
      },
    });

    return jsonOk(serializeUser(updated));
  } catch (error) {
    return handleApiError(error);
  }
}
