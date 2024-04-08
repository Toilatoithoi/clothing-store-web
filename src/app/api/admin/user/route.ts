import { FETCH_COUNT, ORDER_STATUS, ROLES } from '@/constants';
import { verifyToken } from '@/utils/service';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { isBlank } from '@/utils';

export const GET = async (req: NextRequest) => {
  const user = await verifyToken(req);
  if (user?.role !== ROLES.ADMIN) {
    return NextResponse.json({ code: '' }, { status: 403 });
  }
  const url = new URL(req.url);

  const fetchCount = Number(url.searchParams.get('fetchCount')); // default 8 bản ghi
  let page = Number(url.searchParams.get('page') ?? 0) - 1;
  let searchKey = url.searchParams.get('searchKey') as string
  if (page < 0) {
    page = 0;
  }
  if (isBlank(searchKey)) {
    searchKey = ''
  }
  // queryRawUnsafe sử dụng để dùng câu lệnh sql thuần
  // limit là số bản ghi sẽ lấy
  // offset là số bản ghi bỏ qua
  const users = await prisma.$queryRawUnsafe(`SELECT user.*, subquery.totalPrice
  FROM user
  LEFT JOIN (
      SELECT user_id, SUM(total_price) AS totalPrice
      FROM bill
      WHERE status = 'SUCCESS'
      GROUP BY user_id
  ) AS subquery ON user.id = subquery.user_id
  WHERE name COLLATE utf8mb4_general_ci LIKE '%${searchKey}%' 
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



export const PUT = async (req: NextRequest) => {
  const data = await verifyToken(req);
  if (data == null || data.role !== ROLES.ADMIN) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
  }
  const body = await req.json();
  const id = body.id;
  const isLock = body.isLock;
  const user = await prisma.user.findFirst({ where: { id } });



  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        is_lock: isLock,
      }
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ code: 'INTERNAL_SERVER_ERROR' }, { status: 500 })
  }

  return NextResponse.json(user);
}
