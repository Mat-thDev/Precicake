import { PrismaClient } from '@prisma/client';

// Singleton: evita esgotar conexões durante o hot-reload do tsx watch.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
