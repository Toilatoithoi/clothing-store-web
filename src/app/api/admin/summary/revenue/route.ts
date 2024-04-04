import { ORDER_STATUS, ROLES } from '@/constants';
import { verifyToken } from '@/utils/service';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
export const GET = async (req: NextRequest) => {
  const user = await verifyToken(req);
  if (user?.role !== ROLES.ADMIN) {
    return NextResponse.json({ code: '' }, { status: 403 });
  }

  const fromDate = '2024-03-01';
  const toDate = '2024-04-04';

  try {
    const query = `
    SELECT DATE(created_at) as ti, SUM(total_price) as sum
    FROM bill
    WHERE status = 'SUCCESS' AND created_at >= '${fromDate}' AND created_at <= '${toDate}'
    GROUP BY ti;
  `
    const results = await prisma.$queryRawUnsafe(query);

    console.log({ results });
    return NextResponse.json(results)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}