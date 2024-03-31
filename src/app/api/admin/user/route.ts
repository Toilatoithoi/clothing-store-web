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

  const fetchCount = Number(url.searchParams.get('fetchCount')) || FETCH_COUNT; // default 8 bản ghi
  let page = Number(url.searchParams.get('page') ?? 0) - 1;
  if (page < 0) {
    page = 0;
  }

  // const query: Prisma.UserFindManyArgs = {
  //   where
  // }

  const groupBuy = await prisma.bill.groupBy({
    by: 'user_id',
    _sum: {
      total_price: true,
    },
    where: {
      status: ORDER_STATUS.SUCCESS,
    },
  });

  const mapUserToPrice: Record<string, number> = {};
  groupBuy.forEach((group) => {
    mapUserToPrice[group.user_id] = group._sum.total_price ?? 0;
  });
  const [users, count] = await prisma.$transaction([
    prisma.user.findMany({
      take: fetchCount,
      skip: Number(page ?? 0) * Number(fetchCount),
      select: {
        name: true,
        phoneNumber: true,
        username: true,
        dob: true,
        gender: true,
        address: true,
        id: true,
      },
    }),
    prisma.user.count(),
  ]);

  return NextResponse.json({
    items: users.map((user) => ({
      ...user,
      totalPrice: mapUserToPrice[user.id] ?? 0,
    })),
    pagination: {
      totalCount: count,
      page: page <= 0 ? 1 : page + 1,
      totalPage: fetchCount ? Number(Math.ceil(count / Number(fetchCount))) : 1,
    },
  });
};
