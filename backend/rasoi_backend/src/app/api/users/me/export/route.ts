import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { exportUserData } from '@/lib/user-account';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const data = await exportUserData(user.id);
    if (!data) return jsonError('Account not found', 404);

    return jsonOk(data);
  } catch (error) {
    return handleApiError(error);
  }
}
