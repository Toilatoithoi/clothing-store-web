import { ORDER_STATUS, ROLES } from '@/constants';
import { verifyToken } from '@/utils/service';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
export const GET = async (req: NextRequest) => {
  const user = await verifyToken(req);
  if (user?.role !== ROLES.ADMIN) {
    return NextResponse.json({ code: '' }, { status: 403 });
  }

  const product = await prisma?.product.count();
  const sold = await prisma?.product_model.aggregate({
    _count: {
      sold: true,
    },
  });
  const bill = await prisma?.bill.count({
    where: { status: ORDER_STATUS.SUCCESS },
  });
  const customer = await prisma?.user.count({
    where: {
      role: {
        not: ROLES.ADMIN,
      },
    },
  });

  const revenue = await prisma.bill.aggregate({
    _sum: {
      total_price: true,
    },
  });

  return NextResponse.json({
    count: {
      product,
      sold: sold?._count.sold,
      bill,
      customer,
      revenue: revenue._sum.total_price,
    },
  });
};
