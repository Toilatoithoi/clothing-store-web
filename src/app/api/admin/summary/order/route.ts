import { ORDER_STATUS, ROLES } from '@/constants';
import { verifyToken } from '@/utils/service';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Bắt buộc để build Vercel pass

export const GET = async (req: NextRequest) => {
  try {
    // 1. Xác thực token
    const user = await verifyToken(req);
    if (!user || user.role !== ROLES.ADMIN) {
      return NextResponse.json({ code: 'forbidden', message: 'Access denied' }, { status: 403 });
    }

    // 2. Lazy-load Prisma runtime
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // 3. Query DB
    const orders = await prisma.bill.findMany({ select: { status: true } });

    // 4. Tính summary
    const summary = orders.reduce(
      (prev, curr) => {
        switch (curr.status) {
          case ORDER_STATUS.SUCCESS: prev.success++; break;
          case ORDER_STATUS.FAILED: prev.failed++; break;
          case ORDER_STATUS.CANCELED: prev.canceled++; break;
          case ORDER_STATUS.REJECT: prev.reject++; break;
        }
        return prev;
      },
      { success: 0, failed: 0, canceled: 0, reject: 0 }
    );

    return NextResponse.json({ total: orders.length, ...summary });
  } catch (error: any) {
    console.error('Error in /api/admin/summary/order:', error);
    return NextResponse.json({ code: 'server_error', message: error.message }, { status: 500 });
  }
};
