import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { formatDeleteAccountFeedbackMessage } from '@/lib/delete-account-reasons';
import { validateFavoriteCuisines } from '@/lib/kitchen-styles';
import { db } from '@/lib/db';
import { parseKitchenPreferences } from '@/lib/kitchen-preferences';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { deleteAccountSchema, profileUpdateSchema } from '@/lib/validators';
import { deleteUserAccount } from '@/lib/user-account';
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
      const phoneTaken = await db.user.findUnique({ where: { phone: input.phone } });
      if (phoneTaken && phoneTaken.id !== user.id) {
        return jsonError('Phone number already in use', 409);
      }
    }

    const updated = await db.user.update({
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
        kitchenPreferences: input.kitchenPreferences
          ? JSON.stringify({
              ...parseKitchenPreferences(user.kitchenPreferences),
              ...input.kitchenPreferences,
            })
          : undefined,
      },
    });

    return jsonOk(serializeUser(updated));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json().catch(() => ({}));
    const input = deleteAccountSchema.parse(body);

    if (input.reason === 'other' && !input.reasonDetail?.trim()) {
      return jsonError('Please tell us more when you choose Other', 400);
    }

    await db.userFeedback.create({
      data: {
        userId: user.id,
        category: 'other',
        message: formatDeleteAccountFeedbackMessage(input.reason, input.reasonDetail),
        name: user.name,
        email: user.email,
        status: 'pending',
      },
    });

    if (user.isGuest) {
      await deleteUserAccount(user.id);
      return jsonOk({ deleted: true });
    }

    const confirmEmail = input.confirmEmail?.trim().toLowerCase() ?? '';

    if (!user.email || confirmEmail !== user.email.toLowerCase()) {
      return jsonError('Confirm your email address to delete this account', 400);
    }

    await deleteUserAccount(user.id);
    return jsonOk({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
