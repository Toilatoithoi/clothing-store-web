import prisma from '@/lib/db';
import { isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { CreateCategoryReq } from '@/interfaces/request';
import { RestError } from '@/utils/service';
import { INPUT_INVALID, INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
import { group } from 'console';
export const GET = async (req: NextRequest) => {
  try {
    const searchParams = new URL(req.url).searchParams;
    let searchKey = searchParams.get('searchKey') as string
    const level = searchParams.get('level');
    if(isBlank(searchKey)){
      searchKey = ''
    }
    const category = await prisma.category.findMany({
      ...(!isBlank(level) && {
        where: {
          level: Number(level),
        },
      }),
      ...(searchKey != '' && {
        where: {
          name:{
            contains: searchKey
          }
        },
      }),
      
      orderBy: {
        name: 'desc'
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
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
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), { status: 500 });
  }
};
