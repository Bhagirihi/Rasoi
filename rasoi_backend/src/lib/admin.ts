import { NextRequest } from 'next/server';

import { getAdminFromRequest } from '@/lib/auth';
import { jsonError } from '@/lib/api';

export async function requireAdmin(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return { admin: null, error: jsonError('Admin authorization required', 401) };
  }
  return { admin, error: null };
}
