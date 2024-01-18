import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { CreateCategoryReq } from '@/interfaces/request';

export const PUT = async (req: NextRequest, { params }: { params: { categoryId: string; } }) => {
  const id = Number(params.categoryId);
  const body = await req.json();
  // validate data: user_id có hợp lệ k? .....

  try {
    const category = await prisma.category.findFirst({ where: { id } });
    // lây thông tin category trên db -> nếu mà không có thông tin category -> thông báo lỗi category not exist
    if (category == null) {
      return NextResponse.json({
        code: "CATEGORY_NOT_EXIST",
        message: "Category không tồn tại"
      }, { status: 403 })
    }

    // update data vào hệ thống
    const res = await prisma.category.update({
      where: {
        id
      },
      data: {
        ...body,
        parent_id: undefined
      }
    })

    return NextResponse.json({ id: res.id })
  } catch (error) {
    console.log({ error })
    return NextResponse.json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Lỗi hệ thống"
    }, { status: 500 })
  }
}

export const DELETE = async (req: NextRequest, { params }: { params: { categoryId: string; } }) => {
  const id = Number(params.categoryId);
  try {
    const category = await prisma.category.findMany();

    const parent = await prisma.category.findFirst({ where: { id } })
    if (parent == null) {
      return NextResponse.json({
        code: "CATEGORY_NOT_EXIST",
        message: "Category không tồn tại"
      }, { status: 403 })
    }


    // delete data khỏi hệ thống
    const res = await prisma.category.delete({
      where: {
        id
      }
    })

    return NextResponse.json({})
  } catch (error) {
    console.log({ error })
    return NextResponse.json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Lỗi hệ thống"
    }, { status: 500 })
  }
}

export const GET = async (req: NextRequest, { params }: { params: { categoryId: string; } }) => {
  const id = Number(params.categoryId);
  try {
    const category = await prisma.category.findFirst({ where: { id } });

    // lây thông tin category trên db -> nếu mà không có thông tin category -> thông báo lỗi category not exist
    if (category == null) {
      return NextResponse.json({
        code: "CATEGORY_NOT_EXIST",
        message: "Category không tồn tại"
      }, { status: 403 })
    }

    return NextResponse.json(category);
  } catch (error) {
    console.log({ error })
    return NextResponse.json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Lỗi hệ thống"
    }, { status: 500 })
  }

}

