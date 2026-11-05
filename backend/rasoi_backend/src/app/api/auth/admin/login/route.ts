import type { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { adminLoginSchema } from '@/lib/validators';
import { enforceRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Brute-force + CPU-DoS guard: bcrypt.compare is expensive, so every
    // attempt must be rate-limited (this was the one sensitive route missing it).
    const limited = enforceRateLimit(request, 'auth-admin-login', 10, 60_000);
    if (!limited.ok) {
      return jsonError('Too many login attempts. Please try again shortly.', 429);
    }

    const body = await request.json();
    const input = adminLoginSchema.parse(body);

    const admin = await db.admin.findUnique({ where: { email: input.email } });
    if (!admin) {
      return jsonError('Invalid email or password', 401);
    }

    const valid = await bcrypt.compare(input.password, admin.passwordHash);
    if (!valid) {
      return jsonError('Invalid email or password', 401);
    }

    const token = await signToken({ sub: admin.id, type: 'admin', name: admin.name }, '7d');

    return jsonOk({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
