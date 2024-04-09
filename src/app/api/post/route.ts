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
  let searchKey = url.searchParams.get('searchKey') as string
  // lấy từ link url api lấy giá trị page nếu bằng null thig gán bằng 0 và trừ 1
  let page = Number(url.searchParams.get('page') ?? 0) - 1;
  if (page < 0) {
    page = 0;
  }
  if(isBlank(searchKey)){
    searchKey = ''
  }
  const key = `SELECT * FROM post
WHERE title COLLATE utf8mb4_general_ci LIKE '%${searchKey}%' 
ORDER BY createAt DESC
LIMIT ${isBlank(limit) ? fetchCount : limit} OFFSET ${Number(page ?? 0) * Number(fetchCount)}
`
  try {
    const [post, counts] = await prisma.$transaction([
      prisma.$queryRawUnsafe(key),
      prisma.$queryRawUnsafe(`SELECT COUNT(id) as count FROM post
      WHERE title COLLATE utf8mb4_general_ci LIKE '%${searchKey}%' 
      `)
    ])
    const count = Number((counts as any)[0]?.count)

    return NextResponse.json({
      items: post,
      // phân trang
      pagination: {
        totalCount: count,
        page: page <= 0 ? 1 : page + 1,
        totalPage: fetchCount ? Number(Math.ceil(count / Number(fetchCount))) : 1,
      },
      limit
    });
  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), { status: 500 });
  }

}

export const POST = async (req: NextRequest) => {
  //validate input 
  const body: CreatePostReq = await req.json();

  if (isBlank(body.title)) {
    return NextResponse.json(new RestError(INPUT_INVALID));
  }

  try {

    // thêm vào db
    const createdPost = await prisma.post.create({
      data: {
        ...body,
      }
    })

    return NextResponse.json({ createdPost })

  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }
}