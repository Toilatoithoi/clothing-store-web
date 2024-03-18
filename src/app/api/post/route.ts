import prisma from '@/lib/db';
import { formatNumber, isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { CreatePostReq } from '@/interfaces/request';
import { RestError } from '@/utils/service';
import { INPUT_INVALID, INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
import { Select } from '@material-ui/core';
export const GET = async (req: NextRequest) => {
   // lấy từ link url api
   const url = new URL(req.url);
   const fetchCount = url.searchParams.get('fetchCount');
   const limit = url.searchParams.get('limit');
   console.log({fetchCount})
   // lấy từ link url api lấy giá trị page nếu bằng null thig gán bằng 0 và trừ 1
   let page = Number(url.searchParams.get('page') ?? 0) - 1;
   if (page < 0) {
    page = 0;
  }
  console.log({page})
  try {
    const [post, count] = await prisma.$transaction([
      prisma.post.findMany({
        orderBy: {
          createAt: 'desc',
        },
        ...(!isBlank(fetchCount) && (isBlank(limit)) &&{
          take: Number(fetchCount),
          skip: Number(page ?? 0) * Number(fetchCount), // skip = (page - 1) * fetchCount
        }),
        ...(!isBlank(limit)) && {
          take: Number(limit),
          skip: Number(0), // skip = (page - 1) * fetchCount
        }

      }
      ),
      prisma.post.count({
        
      })
    ])
    return NextResponse.json({
      items: post,
      // phân trang
      pagination: {
        totalCount: count,
        page: page <= 0 ? 1 : page + 1,
        totalPage: fetchCount ? Number(formatNumber(count / Number(fetchCount))) : 1,
      },
      limit
    });
  } catch (error) {
    console.log({error})
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
  }

}

export const POST = async (req: NextRequest) => {
    //validate input 
    const body : CreatePostReq = await req.json();
    console.log(body)

    if (isBlank(body.title) || isBlank(body.content) || isBlank(body.createAt)) {
      return NextResponse.json(new RestError(INPUT_INVALID));
    }

    try {

      // thêm vào db
        const createdPost = await prisma.post.create({
        data: {
          ...body,
        }
      })
    
      return NextResponse.json({createdPost})

    } catch (error) {
        console.log({error})
        return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR)); 
    }
  }