import { createPrismaClient } from '@/lib/create-prisma-client';

const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof createPrismaClient> };

/** Dev hot-reload can keep an old PrismaClient missing newly generated models. */
function isPrismaClientReady(client: ReturnType<typeof createPrismaClient> | undefined): client is ReturnType<typeof createPrismaClient> {
  return Boolean(client && 'sponsorEvent' in client && client.sponsorEvent);
}

export const prisma =
  isPrismaClientReady(globalForPrisma.prisma) ? globalForPrisma.prisma : createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
