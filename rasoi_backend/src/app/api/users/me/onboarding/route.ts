import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { validateFavoriteCuisines } from '@/lib/kitchen-styles';
import { prisma } from '@/lib/prisma';
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

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        hasCompletedOnboarding: true,
        dietPreference: input.dietPreference,
        dietChoice: input.dietChoice,
        regionalCuisine: input.regionalCuisine,
        favoriteCuisines: JSON.stringify(input.favoriteCuisines),
        notificationsEnabled: input.notificationsEnabled,
      },
    });

    return jsonOk(serializeUser(updated));
  } catch (error) {
    return handleApiError(error);
  }
}
