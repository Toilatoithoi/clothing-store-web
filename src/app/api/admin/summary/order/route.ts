import { ORDER_STATUS, ROLES } from '@/constants';
import { verifyToken } from '@/utils/service';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
export const GET = async (req: NextRequest) => {
  const user = await verifyToken(req);
  if (user?.role !== ROLES.ADMIN) {
    return NextResponse.json({ code: '' }, { status: 403 });
  }

  const order = await prisma.bill.findMany({ select: { status: true } });

  const summary = order.reduce(
    // prev là giá trị tích luỹ
    // curr la giá trị hiện tại
    (prev, curr) => {
      const result = { ...prev };
      if (curr.status === ORDER_STATUS.SUCCESS) {
        result.success++;
      } else if (curr.status === ORDER_STATUS.FAILED) {
        result.failed++;
      } else if (curr.status === ORDER_STATUS.CANCELED) {
        result.canceled++;
      } else if (curr.status === ORDER_STATUS.REJECT) {
        result.reject++;
      }

      return result;
    },
    {
      success: 0,
      failed: 0,
      canceled: 0,
      reject: 0,
    }
  );

  return NextResponse.json({
    total: order.length,
    ...summary,
  });
};
