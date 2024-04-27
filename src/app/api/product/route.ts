import { CreateProductReq, PRODUCT_STATUS } from '@/interfaces/request';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { formatNumber, isBlank } from '@/utils';
import { category } from '@prisma/client';
import { RestError, verifyToken } from '@/utils/service';
import { INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
import { FETCH_COUNT, ROLES, SORT_TYPE } from '@/constants';



export const GET = async (request: NextRequest) => {
  // lấy từ link url api
  const data = await verifyToken(request);

  const url = new URL(request.url);
  // lấy từ link url api lấy giá trị categoryId
  const category_id = url.searchParams.get('categoryId');
  const status = url.searchParams.get('status');
  // lấy từ link url api lấy giá trị fetchCount
  const fetchCount = Number(url.searchParams.get('fetchCount')) || FETCH_COUNT; // default 50 bản ghi
  // orderBy là sort thời gian, giá từ thấp đến cap, giá từ cao đến thấp
  const orderBy = url.searchParams.get('orderBy') as SORT_TYPE ?? SORT_TYPE.TIME; // mặc định sort theo time 
  const isList = url.searchParams.get('isList');
  // sort theo giá lớn nhất
  const priceMin = Number(url.searchParams.get('priceMin'))
  // sort theo giá nhỏ nhất
  const priceMax = Number(url.searchParams.get('priceMax'))
  // chuổi chuỗi category con nhận được thành mảng
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
        // phải để là || không phải ?? vì ?? chỉ khi null hoặc undefind mới mới trả về giá trị thay thế còn || thì ngoài null và undefind thì còn 0, '' sẽ coi là false đều trả về giá trị kia
        lte: priceMax || Number.MAX_SAFE_INTEGER
      },
      ...(data?.role == ROLES.ADMIN && isList == null? {
        status: status ? status : { not: PRODUCT_STATUS.DELETED }
      } : {
        status: PRODUCT_STATUS.PUBLISHED,
      }),
      ...(category != null && {
        // hiển thị tất cả category cha và category con
        // truyền một object category vào filter
        category: {
          // OR là 1 trong 2 thoả mãn là được
          // tìm kiếm theo categoryId,
          // nếu filterCategories có thì sẽ không filter theo thằng cha và thằng con của cha nữa mà chỉ filter riêng mấy thằng con mà tích vào thôi
          OR: filterCategories?.length ? filterCategories.map((category: string) => ({
            id: Number(category)
          })) : !isBlank(category_id) ?
            [
              {
                // lấy cả category cha và category con
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



    const [products, count] = await prisma.$transaction([
      prisma.product.findMany({
        select: {
          product_model: true,
          name: true,
          status: true,
          category: true,
          id: true,
          price: true,
        },
        take: fetchCount,
        skip: Number(page ?? 0) * Number(fetchCount), // skip = (page - 1) * fetchCount
        where,
        // Cho prouduct muốn soát theo giá thì phải liên kết với product_model do có phân trang vì có fetchCount
        // nên chỉ có thể sort nhưng thằng lấy ra được sau fetchCount thôi còn những thằng database sẽ không sort được
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

      const quantity = {
        sold: 0,
        stock: 0,
      }

      // lấy giá lớn nhất của một model
      product.product_model.forEach((mode) => {
        if (mode.price && mode.price > price.priceMax) {
          price.priceMax = mode.price;
        }
        if (mode.price && mode.price < price.priceMin) {
          price.priceMin = mode.price;
        }
        // Tổng sản phẩm đã bán
        quantity.sold += (mode.sold ?? 0);
        // Tổng sản phẩm trong kho
        quantity.stock += (mode.stock ?? 0);
      });

      return {
        name: product.name,
        status: product.status,
        category: product.category,
        price,
        image: product.product_model[0]?.image,
        id: product.id,
        ...quantity
      };
    });

    // chỉ sort những thằng lấy ra được sau khi phân trang chứ không phải toàn bộ từ database
    // nên phải dùng order by ở câu truy vấn luôn nên bắt buộc phải có thêm thuộc tính price ở sản phẩm
    // res = res.sort() 
    const total_count = products.length
    console.log({total_count})

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
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }
};

export const POST = async (req: NextRequest) => {
  try {
    // khi người ta điền thêm size và thêm màu thì sẽ tạo ra thêm bảng product_model
    const body = (await req.json()) as CreateProductReq;

    const product = await prisma.product.create({
      data: {
        name: body.name,
        status: PRODUCT_STATUS.DRAFT,
        description: body.description,
        category_id: body.categoryId,
        price: body.price,
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
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), { status: 500 });
  }
};

// ... do đầu vào có thể là nhiều tham số không biết ra có bao nhiêu tham số
// (a,b,c,d,...) chứ không phải ([a,b,c,d,...])

// do không biết có bao nhiêu tham số nên để lấy hết thì dùng ... arg là một mảng
// const min = (...arg: number[]) =>{
//   console.log(arg)
// }

// min(2,3,4) in mảng [2,3,4]



