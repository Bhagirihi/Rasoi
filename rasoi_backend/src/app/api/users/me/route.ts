import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { validateFavoriteCuisines } from '@/lib/kitchen-styles';
import { prisma } from '@/lib/prisma';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { profileUpdateSchema } from '@/lib/validators';
import { serializeUser } from '@/lib/serializers';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    return jsonOk(serializeUser(user));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = profileUpdateSchema.parse(body);

    if (input.favoriteCuisines) {
      await validateFavoriteCuisines(input.favoriteCuisines);
    }

    if (input.phone && input.phone !== user.phone) {
      const phoneTaken = await prisma.user.findUnique({ where: { phone: input.phone } });
      if (phoneTaken && phoneTaken.id !== user.id) {
        return jsonError('Phone number already in use', 409);
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: input.name,
        phone: input.phone,
        dietChoice: input.dietChoice,
        dietPreference: input.dietPreference,
        regionalCuisine: input.regionalCuisine,
        favoriteCuisines: input.favoriteCuisines
          ? JSON.stringify(input.favoriteCuisines)
          : undefined,
        notificationsEnabled: input.notificationsEnabled,
      },
    });

    return jsonOk(serializeUser(updated));
  } catch (error) {
    return handleApiError(error);
  }
}
