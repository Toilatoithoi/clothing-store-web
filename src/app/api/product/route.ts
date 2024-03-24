import { CreateProductReq, PRODUCT_STATUS } from '@/interfaces/request';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { formatNumber, isBlank } from '@/utils';
import { category } from '@prisma/client';
import { RestError } from '@/utils/service';
import { INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
import { SORT_TYPE } from '@/constants';
export const GET = async (request: NextRequest) => {
  // lấy từ link url api
  const url = new URL(request.url);
  // lấy từ link url api lấy giá trị categoryId
  const category_id = url.searchParams.get('categoryId');
  // lấy từ link url api lấy giá trị fetchCount
  const fetchCount = Number(url.searchParams.get('fetchCount')) || 8; // default 8 bản ghi

  const orderBy = url.searchParams.get('orderBy') as SORT_TYPE ?? SORT_TYPE.TIME; // mặc định sort theo time 
  const priceMin = Number(url.searchParams.get('priceMin'))
  const priceMax = Number(url.searchParams.get('priceMax'))
  const filterCategories = !isBlank(url.searchParams.get('filterCategories')) ? url.searchParams.get('filterCategories')?.split('|') : null
  // lấy từ link url api lấy giá trị page nếu bằng null thig gán bằng 0 và trừ 1
  let page = Number(url.searchParams.get('page') ?? 0) - 1;
  if (page < 0) {
    page = 0;
  }
  const searchKey = url.searchParams.get('searchKey');
  try {
    let category: category | null = null;
    if (category_id && !isBlank(category_id)) {
      category = await prisma.category.findFirst({
        where: { id: Number(category_id) },
      });
    }

    // model where cho biểu thức điều kiện
    const where = {
      ...!isBlank(searchKey) && {
        name: {
          contains: searchKey!,
        },
      },
      price: {
        gte: priceMin ?? 0,
        lte: priceMax || Number.MAX_SAFE_INTEGER
      },
      status: 'PUBLISHED',
      ...(category != null && {
        // hiển thị tất cả category cha và category con
        // truyền một object category vào filter
        category: {
          // OR là 1 trong 2 thoả mãn là được
          // tìm kiếm theo categoryId,
          OR: filterCategories?.length ? filterCategories.map((category: string) => ({
            id: Number(category)
          })) : !isBlank(category_id) ?
            [
              {
                // bằng category truyền vào
                id: Number(category_id),
              },
              {
                // category truyền vào bằng category cha
                parent_id: Number(category_id),
              },
            ] : [],
        },
      }),
    };


    console.log(JSON.stringify(where), fetchCount)

    const [products, count] = await prisma.$transaction([
      prisma.product.findMany({
        select: {
          product_model: true,
          name: true,
          status: true,
          category: true,
          id: true,
          price: true,
          image_product: true
        },
        take: fetchCount,
        skip: Number(page ?? 0) * Number(fetchCount), // skip = (page - 1) * fetchCount
        where,
        orderBy: {
          ...orderBy === SORT_TYPE.TIME && {
            created_at: 'desc',
          },
          ...orderBy === SORT_TYPE.PRICE_ASC && {
            price: 'asc',
          },
          ...orderBy === SORT_TYPE.PRICE_DESC && {
            price: 'desc',
          },
        },
      }),
      prisma.product.count({
        where,
      }),
    ]);

    let res = products.map((product) => {
      const price = {
        // giá hiển thị ban đầu là product_model đầu tiên của product đó nếu không có giá trị thì sẽ mặc định là 0
        priceMin: product.product_model[0]?.price ?? 0,
        priceMax: product.product_model[0]?.price ?? 0,
        price: product.price
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

      return {
        name: product.name,
        status: product.status,
        category: product.category,
        price,
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
        totalPage: fetchCount ? Number(Math.ceil(count / Number(fetchCount))) : 1,
      },
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
  }
};

export const POST = async (req: NextRequest) => {
  try {
    // khi người ta điền thêm size và thêm màu thì sẽ tạo ra thêm bảng product_model
    const body = (await req.json()) as CreateProductReq;
    const priceMin = Math.min(...body.model.map(item => item.price));

    const product = await prisma.product.create({
      data: {
        name: body.name,
        status: PRODUCT_STATUS.DRAFT,
        description: body.description,
        category_id: body.category_id,
        price: priceMin,
        // tạo bảng product_model
        // tạo đồng thời cả product và product_model thì nếu khi product_model bị lỗi thì product sẽ không thành công
        product_model: {
          create: body.model,
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
  }
};


