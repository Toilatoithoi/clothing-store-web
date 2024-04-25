import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { RestError } from '@/utils/service';
import { INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
import { CreateProductReq } from '@/interfaces/request';

export const PUT = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  const id = Number(params.productId);
  const body = (await req.json()) as CreateProductReq;
  // validate data: user_id có hợp lệ k? .....

  try {
    const product = await prisma.product.findFirst({ where: { id } });
    // lây thông tin category trên db -> nếu mà không có thông tin category -> thông báo lỗi category not exist
    if (product == null) {
      return NextResponse.json(
        {
          code: 'PRODUCT_NOT_EXIST',
          message: 'Product không tồn tại',
        },
        { status: 403 }
      );
    }

    // update data vào hệ thống
    const res = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        status: body.status || product.status,
        description: body.description,
        category_id: body.categoryId,
        price: body.price,
        product_model: {
          update: body.model.filter(item=> item.id).map(item => ({
            where: {
              id: item.id!
            },
            data: item
          })),
          create: body.model.filter(item => !item.id)
        }
      },
    });

    return NextResponse.json({ id: res.id });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), { status: 500 });
  }
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  const id = Number(params.productId);
  try {
    const product = await prisma.product.findFirst({
      where: { id },
      select: {
        name: true,
        category: true,
        product_model: true,
        status: true,
        id: true,
        description: true,
        price: true,
      },
    });

    // lây thông tin category trên db -> nếu mà không có thông tin category -> thông báo lỗi category not exist
    if (product == null) {
      return NextResponse.json(
        {
          code: 'PRODUCT_NOT_EXIST',
          message: 'Product không tồn tại',
        },
        { status: 403 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }
};
