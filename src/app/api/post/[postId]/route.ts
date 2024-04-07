import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { CreatePostReq } from '@/interfaces/request';
import { RestError } from '@/utils/service';
import { INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
import { isBlank } from '@/utils';

export const PUT = async (req: NextRequest, { params }: { params: { postId: string; } }) => {
  const id = Number(params.postId);
  const body = await req.json();
  // validate data: user_id có hợp lệ k? .....

  try {
    const post = await prisma.post.findFirst({ where: { id } });
    // lây thông tin post trên db -> nếu mà không có thông tin post -> thông báo lỗi post not exist
    if (post == null) {
      return NextResponse.json({
        code: "POST_NOT_EXIST",
        message: "Post không tồn tại"
      }, { status: 403 })
    }

    // update data vào hệ thống
    const res = await prisma.post.update({
      where: {
        id
      },
      data: {
        ...body,
      }
    })

    return NextResponse.json({ id: res.id })
  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }
}

export const DELETE = async (req: NextRequest, { params }: { params: { postId: string; } }) => {
  const id = Number(params.postId);
  try {
    const post = await prisma.post.findMany();

    // delete data khỏi hệ thống
    const res = await prisma.post.delete({
      where: {
        id
      }
    })

    return NextResponse.json({})
  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }
}

export const GET = async (req: NextRequest, { params }: { params: { postId: string; } }) => {
  const id = Number(params.postId);
  try {
    let post;
    post = await prisma.post.findFirst(
      { 
        ...(id && id != 0 && {
          where: {
            id
          },
        }),
      }
    );
    // lây thông tin post trên db -> nếu mà không có thông tin post -> thông báo lỗi post not exist
    if (post == null) {
      return NextResponse.json({
        code: "POST_NOT_EXIST",
        message: "Post không tồn tại"
      }, { status: 403 })
    }
    return NextResponse.json(post);
  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }

}

