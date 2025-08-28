import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic';

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient({
  log: ['query', 'info'], // chỉ log, không connect lúc build
});

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma