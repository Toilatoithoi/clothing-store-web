import { FETCH_COUNT, ORDER_STATUS, ROLES } from '@/constants';
import { verifyToken } from '@/utils/service';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const GET = async (req: NextRequest) => {
  const user = await verifyToken(req);
  if (user?.role !== ROLES.ADMIN) {
    return NextResponse.json({ code: '' }, { status: 403 });
  }
  const url = new URL(req.url);

  const fetchCount = Number(url.searchParams.get('fetchCount')); // default 8 bản ghi
  let page = Number(url.searchParams.get('page') ?? 0) - 1;
  if (page < 0) {
    page = 0;
  }

  console.log(`SELECT user.*, subquery.totalPrice
FROM user
JOIN (
    SELECT user_id, SUM(total_price) AS totalPrice
    FROM bill
    GROUP BY user_id
) AS subquery ON user.id = subquery.user_id
ORDER BY subquery.totalPrice DESC
LIMIT ${fetchCount} OFFSET  ${Number(page ?? 0) * Number(fetchCount)}
;`)
  const users = await prisma.$queryRawUnsafe(`SELECT user.*, subquery.totalPrice
  FROM user
  JOIN (
      SELECT user_id, SUM(total_price) AS totalPrice
      FROM bill
      WHERE status = 'SUCCESS'
      GROUP BY user_id
  ) AS subquery ON user.id = subquery.user_id
  ORDER BY subquery.totalPrice DESC
  LIMIT ${fetchCount} OFFSET  ${Number(page ?? 0) * Number(fetchCount)}
  ;`)


  const count = await prisma.user.count()

  return NextResponse.json({
    items: users,
    pagination: {
      totalCount: count,
      page: page <= 0 ? 1 : page + 1,
      totalPage: fetchCount ? Number(Math.ceil(count / Number(fetchCount))) : 1,
    },
  });
};
