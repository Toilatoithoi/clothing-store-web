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
    _sum: {
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
    where: {
      status: ORDER_STATUS.SUCCESS
    }
  });


  const billRows = await prisma.$queryRawUnsafe(`SELECT  SUM(subquery.quantity) as totalQuantity
  FROM bill
  JOIN (
      SELECT bill_id, SUM(quantity) AS quantity
      FROM bill_product
      GROUP BY bill_id
  ) AS subquery ON bill.id = subquery.bill_id
	WHERE status = 'SUCCESS';`)

  return NextResponse.json({
    count: {
      product,
      sold: (billRows as any)[0]?.totalQuantity,
      bill,
      customer,
      revenue: revenue._sum.total_price,
    },
  });
};
