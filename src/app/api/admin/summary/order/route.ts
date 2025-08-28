import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken } from '@/utils/service';
import { ROLES, ORDER_STATUS } from '@/constants';

export const GET = async (req: NextRequest) => {
  try {
    // Xác thực user
    const user = await verifyToken(req).catch(() => null);
    if (!user || user.role !== ROLES.ADMIN) {
      return NextResponse.json({ code: 'forbidden' }, { status: 403 });
    }

    // Lấy đơn hàng, chỉ query status
    const orders = await prisma.bill.findMany({ select: { status: true } });

    // Tính tổng
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
  } catch (error) {
    console.error('GET /api/admin/summary/order failed', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
