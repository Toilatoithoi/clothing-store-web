import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { CreatePostReq } from '@/interfaces/request';
import { RestError } from '@/utils/service';
import { INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';

export const PUT = async (req: NextRequest, { params }: { params: { lookbookId: string; } }) => {
  const id = Number(params.lookbookId);
  const body = await req.json();
  // validate data: user_id có hợp lệ k? .....

  try {
    const look_book = await prisma.look_book.findFirst({ where: { id } });
    // lây thông tin lookbook trên db -> nếu mà không có thông tin lookbook -> thông báo lỗi lookbook not exist
    if (look_book == null) {
      return NextResponse.json({
        code: "LOOK_BOOK_NOT_EXIST",
        message: "Look book không tồn tại"
      }, { status: 403 })
    }

    // update data vào hệ thống
    const res = await prisma.look_book.update({
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
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
  }
}

export const DELETE = async (req: NextRequest, { params }: { params: { lookbookId: string; } }) => {
  const id = Number(params.lookbookId);
  try {
    const look_book = await prisma.look_book.findMany();

    // delete data khỏi hệ thống
    const res = await prisma.look_book.delete({
      where: {
        id
      }
    })

    return NextResponse.json({})
  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
  }
}

export const GET = async (req: NextRequest, { params }: { params: { lookbookId: string; } }) => {
  const id = Number(params.lookbookId);
  try {
    const look_book = await prisma.look_book.findFirst({ where: { id } });

    // lây thông tin lookbook trên db -> nếu mà không có thông tin lookbook -> thông báo lỗi lookbook not exist
    if (look_book == null) {
      return NextResponse.json({
        code: "LOOK_BOOK_NOT_EXIST",
        message: "Look book không tồn tại"
      }, { status: 403 })
    }

    return NextResponse.json(look_book);
  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
  }

}

