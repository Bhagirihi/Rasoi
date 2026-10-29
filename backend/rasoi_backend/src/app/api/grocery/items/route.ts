import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { setGroceryItemChecked } from '@/lib/grocery-list';
import { groceryItemCheckSchema } from '@/lib/validators';

/** Check / uncheck one grocery item. Ownership is verified in the lib. */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = groceryItemCheckSchema.parse(body);
    const item = await setGroceryItemChecked(user.id, input.id, input.checked);
    return jsonOk({ item: { id: item.id, checked: item.checked } });
  } catch (error) {
    return handleApiError(error);
  }
}
