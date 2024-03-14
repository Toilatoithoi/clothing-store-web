import prisma from '@/lib/db';
import { isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { CreateLookBookReq, CreatePostReq } from '@/interfaces/request';
import { RestError } from '@/utils/service';
import { INPUT_INVALID, INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
import { Select } from '@material-ui/core';
export const GET = async (req: NextRequest) => {
   // lấy từ link url api
   const url = new URL(req.url);
   const fetchCount = url.searchParams.get('fetchCount');
   console.log(fetchCount)
   // lấy từ link url api lấy giá trị page nếu bằng null thig gán bằng 0 và trừ 1
   let page = Number(url.searchParams.get('page') ?? 0) - 1;
   if (page < 0) {
    page = 0;
  }
  try {
    const [lookbook, count] = await prisma.$transaction([
      prisma.look_book.findMany({
        orderBy: {
          createAt: 'asc',
        },
        ...(!isBlank(fetchCount) && {
          take: Number(fetchCount),
          skip: Number(page ?? 0) * Number(fetchCount), // skip = (page - 1) * fetchCount
        }),
      }
      ),
      prisma.look_book.count({
        
      })
    ])
    return NextResponse.json({
      items: lookbook,
      // phân trang
      pagination: {
        totalCount: count,
        page: page <= 0 ? 1 : page + 1,
        totalPage: fetchCount ? count / Number(fetchCount) : 1,
      },
    });
  } catch (error) {
    console.log({error})
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
  }

}

export const POST = async (req: NextRequest) => {
    //validate input 
    const body : CreateLookBookReq = await req.json();
    console.log(body)

    if (isBlank(body.title) || isBlank(body.content) || isBlank(body.createAt)) {
      return NextResponse.json(new RestError(INPUT_INVALID));
    }


    try {

      // thêm vào db
        const createdLookBook = await prisma.look_book.create({
        data: {
          ...body,
        }
      })
    
      return NextResponse.json({createdLookBook})

    } catch (error) {
        console.log({error})
        return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR)); 
    }
  }