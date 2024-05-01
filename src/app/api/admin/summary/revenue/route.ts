import { ORDER_STATUS, ROLES } from '@/constants';
import { verifyToken } from '@/utils/service';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {formatDateToString} from '@/utils/datetime'
import { addDays, subMonths } from 'date-fns';
import { isBlank } from '@/utils';
export const GET = async (req: NextRequest) => {
  const user = await verifyToken(req);
  if (user?.role !== ROLES.ADMIN) {
    return NextResponse.json({ code: '' }, { status: 403 });
  }
  const url = new URL(req.url);
  let fromDate = url.searchParams.get('fromDate')
  let toDate = url.searchParams.get('toDate')
  
  if(isBlank(fromDate)){
    fromDate =  formatDateToString(subMonths(new Date(), 1), 'yyyy-MM-dd')
  }

  if(isBlank(toDate)){
    toDate =  formatDateToString(new Date(), 'yyyy-MM-dd')
  }

  toDate = formatDateToString(addDays(toDate!, 1), 'yyyy-MM-dd')

  console.log({fromDate})
  console.log({toDate})

  try {
    // tính doanh thu theo ngày tạo 
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
    return NextResponse.json({ error }, { status: 300 })
  }
}