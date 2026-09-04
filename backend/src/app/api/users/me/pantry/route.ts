import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { pantryUpdateSchema } from '@/lib/validators';
import { parseJson, serializeUser } from '@/lib/serializers';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    return jsonOk({
      ingredients: parseJson<string[]>(user.pantryIngredients, []),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = pantryUpdateSchema.parse(body);

    const updated = await db.user.update({
      where: { id: user.id },
      data: { pantryIngredients: JSON.stringify(input.ingredients) },
    });

    return jsonOk(serializeUser(updated));
  } catch (error) {
    return handleApiError(error);
  }
}
