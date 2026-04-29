import { PrismaClient } from '@prisma/client'

// Design Pattern: Singleton
// Purpose: Ensures only one instance of the Prisma Client is created.
// This prevents exhausting database connection limits, particularly in development with hot-reloading.
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: "file:./dev.db"
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
