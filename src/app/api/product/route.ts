import { CreateProductReq, PRODUCT_STATUS } from '@/interfaces/request';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { isBlank } from '@/utils';
export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const category_id = url.searchParams.get('categoryId');
  try {
    const products = await prisma.product.findMany({
      select: {
        product_model: true,
        name: true,
        status: true,
        category: true,
      },
      where: {
        status: 'PUBLISHED',
        ...(!isBlank(category_id!) && {
          category_id: Number(category_id),
        }),
      },
    });
    const res = products.map((product) => {
      const price = {
        priceMin: product.product_model[0]?.price ?? 0,
        priceMax: product.product_model[0]?.price ?? 0,
      };

      product.product_model.forEach((mode) => {
        if (mode.price && mode.price > price.priceMax) {
          price.priceMax = mode.price;
        }
        if (mode.price && mode.price < price.priceMin) {
          price.priceMin = mode.price;
        }
      });

      return {
        name: product.name,
        status: product.status,
        category: product.category,
        price,
        image: product.product_model[0]?.image,
      };
    });

    return NextResponse.json(res);
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Lỗi hệ thống',
      },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as CreateProductReq;
    const product = await prisma.product.create({
      data: {
        name: body.name,
        status: PRODUCT_STATUS.DRAFT,
        description: body.description,
        category_id: body.category_id,
        product_model: {
          create: body.model,
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log({ error });
    return NextResponse.json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'lỗi hệ thống',
    });
  }
};
