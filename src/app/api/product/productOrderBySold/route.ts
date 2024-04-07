import { PRODUCT_STATUS } from '@/interfaces/request';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { isBlank } from '@/utils';
import { product_model } from '@prisma/client';
import { RestError } from '@/utils/service';
import { INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
export const GET = async (request: NextRequest) => {
  // lấy từ link url api
  const url = new URL(request.url);
  // lấy từ link url api lấy giá trị fetchCount
  const fetchCount = url.searchParams.get('fetchCount');
  // lấy từ link url api lấy giá trị page nếu bằng null thig gán bằng 0 và trừ 1
  let page = Number(url.searchParams.get('page') ?? 0) - 1;
  if (page < 0) {
    page = 0;
  }
  try {
    // model where cho biểu thức điều kiện
    const where = {
      status: 'PUBLISHED',
    };

    const [products, count] = await prisma.$transaction([
      prisma.product.findMany({
        select: {
          product_model: true,
          name: true,
          status: true,
          category: true,
          id: true,
        },
        ...(!isBlank(fetchCount) && {
          take: Number(fetchCount),
          skip: Number(page ?? 0) * Number(fetchCount), // skip = (page - 1) * fetchCount
        }),
        where,
        orderBy: {
          id: 'asc',
        },
      }),
      prisma.product.count({
        where,
      }),
    ]);

    const res = products.map((product) => {
      const price = {
        // giá hiển thị ban đầu là product_model đầu tiên của product đó nếu không có giá trị thì sẽ mặc định là 0
        priceMin: product.product_model[0]?.price ?? 0,
        priceMax: product.product_model[0]?.price ?? 0,
      };

      // lấy giá lớn nhất của một model
      product.product_model.forEach((mode) => {
        if (mode.price && mode.price > price.priceMax) {
          price.priceMax = mode.price;
        }
        if (mode.price && mode.price < price.priceMin) {
          price.priceMin = mode.price;
        }
      });

      let maxSold = product?.product_model[0]?.sold ?? 0;
      let i = 0;
      let index = 0;
      product.product_model.forEach((mode) => {
        if (mode.sold && mode.sold > maxSold) {
          maxSold = mode.sold;
          index = i;
        }
        i = i++;
      })

      return {
        name: product.name,
        status: product.status,
        category: product.category,
        price,
        product_model: product.product_model[index],
        image: product.product_model[0]?.image,
        id: product.id,
      };
    });

    return NextResponse.json({
      items: res,
      // phân trang
      pagination: {
        totalCount: count,
        page: page <= 0 ? 1 : page + 1,
        totalPage: fetchCount ? count / Number(fetchCount) : 1,
      },
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }
};
