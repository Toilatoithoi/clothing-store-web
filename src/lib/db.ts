import { PrismaClient } from '@prisma/client';

declare global {
  // Dùng globalThis để tránh tạo nhiều instance khi HMR
  var prisma: PrismaClient | undefined;
}

// Tạo singleton
const prisma = globalThis.prisma ?? new PrismaClient();

// Gán lại chỉ khi không phải production để tránh multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
