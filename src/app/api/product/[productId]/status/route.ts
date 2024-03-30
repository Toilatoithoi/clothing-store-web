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
        status: body.status,
      },
    });

    return NextResponse.json({ id: res.id });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), { status: 500 });
  }
};