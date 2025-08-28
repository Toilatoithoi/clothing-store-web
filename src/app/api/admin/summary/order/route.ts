import { ORDER_STATUS, ROLES } from '@/constants';
import { verifyToken } from '@/utils/service';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const GET = async (req: NextRequest) => {
  try {
    // Xác thực user
    const user = await verifyToken(req);
    if (!user || user.role !== ROLES.ADMIN) {
      return NextResponse.json({ code: 'forbidden' }, { status: 403 });
    }

    // Lấy đơn hàng
    const orders = await prisma.bill.findMany({ select: { status: true } });

    // Tính tổng
    const summary = orders.reduce(
      (prev, curr) => {
        const result = { ...prev };
        switch (curr.status) {
          case ORDER_STATUS.SUCCESS:
            result.success++;
            break;
          case ORDER_STATUS.FAILED:
            result.failed++;
            break;
          case ORDER_STATUS.CANCELED:
            result.canceled++;
            break;
          case ORDER_STATUS.REJECT:
            result.reject++;
            break;
        }
        return result;
      },
      { success: 0, failed: 0, canceled: 0, reject: 0 }
    );

    return NextResponse.json({
      total: orders.length,
      ...summary,
    });
  } catch (error) {
    console.error('GET /api/admin/summary/order failed', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
