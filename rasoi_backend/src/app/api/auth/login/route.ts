import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { loginSchema } from '@/lib/validators';
import { serializeUser } from '@/lib/serializers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = loginSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { phone: input.phone } });

    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            name: input.name,
            isGuest: false,
          },
        })
      : await prisma.user.create({
          data: {
            name: input.name,
            phone: input.phone,
            isGuest: false,
          },
        });

    const token = await signToken({ sub: user.id, type: 'user' });

    return jsonOk({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
