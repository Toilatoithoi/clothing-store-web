import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { CreateProductReq } from '@/interfaces/request';

export const PUT = async (req: NextRequest, { params }: { params: { productId: string; } }) => {
  const id = Number(params.productId);
  const body = await req.json();
  // validate data: user_id có hợp lệ k? .....

  try {
    const product = await prisma.product.findFirst({ where: { id } });
    // lây thông tin category trên db -> nếu mà không có thông tin category -> thông báo lỗi category not exist
    if (product == null) {
      return NextResponse.json({
        code: "PRODUCT_NOT_EXIST",
        message: "Product không tồn tại"
      }, { status: 403 })
    }

    // update data vào hệ thống
    const res = await prisma.product.update({
      where: {
        id
      },
      data: {
        name: body.name,
        status: body.status,
        description: body.description,
        category_id: body.category_id
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

export const GET = async (req: NextRequest, { params }: { params: { productId: string; } }) => {
  const id = Number(params.productId);
  try {
    const product = await prisma.product.findFirst({ where: { id } });

    // lây thông tin category trên db -> nếu mà không có thông tin category -> thông báo lỗi category not exist
    if (product == null) {
      return NextResponse.json({
        code: "PRODUCT_NOT_EXIST",
        message: "Product không tồn tại"
      }, { status: 403 })
    }

    const product_model = await prisma.product_model.findMany({ where: { product_id:id} });

    return NextResponse.json(product_model);
  } catch (error) {
    console.log({ error })
    return NextResponse.json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Lỗi hệ thống"
    }, { status: 500 })
  }

}

