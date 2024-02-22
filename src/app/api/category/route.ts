import prisma from '@/lib/db';
import { isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { CreateCategoryReq } from '@/interfaces/request';
import { RestError } from '@/utils/service';
import { INPUT_INVALID, INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
export const GET = async (req: NextRequest) => {
  try {
    const searchParams = new URL(req.url).searchParams;
    const level = searchParams.get('level');
    const category = await prisma.category.findMany({
      ...(!isBlank(level) && {
        where: {
          level: Number(level),
        },
      }),
      orderBy: {
        name: 'desc',
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
  }
};

export const POST = async (req: NextRequest) => {
  //validate input
  const body: CreateCategoryReq = await req.json();
  if (isBlank(String(body.name)) || isBlank(String(body.parent_id))) {
    return NextResponse.json(new RestError(INPUT_INVALID));
  }

  try {
    // thêm vào db
    const createdCategory = await prisma.category.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json({ createdCategory });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
  }
};
