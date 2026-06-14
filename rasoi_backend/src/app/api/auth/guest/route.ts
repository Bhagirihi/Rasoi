import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { jsonOk, handleApiError } from '@/lib/api';
import { serializeUser } from '@/lib/serializers';

export async function POST() {
  try {
    const user = await prisma.user.create({
      data: {
        name: 'Guest',
        isGuest: true,
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
