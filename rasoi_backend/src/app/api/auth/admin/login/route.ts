import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { adminLoginSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = adminLoginSchema.parse(body);

    const admin = await prisma.admin.findUnique({ where: { email: input.email } });
    if (!admin) {
      return jsonError('Invalid email or password', 401);
    }

    const valid = await bcrypt.compare(input.password, admin.passwordHash);
    if (!valid) {
      return jsonError('Invalid email or password', 401);
    }

    const token = await signToken({ sub: admin.id, type: 'admin' }, '7d');

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
