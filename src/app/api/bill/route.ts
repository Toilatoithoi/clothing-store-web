import prisma from '@/lib/db';
import { isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { CreateBillReq } from '@/interfaces/request';
import { RestError, verifyToken } from '@/utils/service';
import { INPUT_INVALID, INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
import { Prisma, bill_product, product_model } from '@prisma/client';
import { FETCH_COUNT, ORDER_STATUS, ROLES } from '@/constants';
import { formatStringToDate } from '@/utils/datetime';
import { addDays } from 'date-fns';

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const fromDate = formatStringToDate(url.searchParams.get('fromDate')?.toString(), 'yyyy-MM-dd');
  const toDate = formatStringToDate(url.searchParams.get('toDate')?.toString(), 'yyyy-MM-dd');
  const username = url.searchParams.get('username')?.toString();
  const status = url.searchParams.get('status')?.toString();
  const isMine = url.searchParams.get('isMine')?.toString() === 'true';
  const fetchCount = Number(url.searchParams.get('fetchCount')) || FETCH_COUNT; // default 8 bản ghi
  let searchKey = url.searchParams.get('searchKey') as string

  let page = Number(url.searchParams.get('page') ?? 0) - 1;
  if (page < 0) {
    page = 0;
  }
  if (isBlank(searchKey)) {
    searchKey = ''
  }

  try {
    // input fromDate, toDate, status
    // verify token
    const data = await verifyToken(req);
    if (data == null || data.is_lock) {
      return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 });
    }

    const query: Prisma.billFindManyArgs = {
      where: {
        // nếu là admin thì hiển thị hết
        ...(data.role === ROLES.ADMIN && {
          user: {
            username: {
              contains: username,
            },
          },
        }),
        // nếu không là admin hoặc không ở trang quản trị thì chỉ hiện thị riêng bill của bản thân
        ...((data.role !== ROLES.ADMIN || isMine) && {
          user: {
            username: data.username,
          },
        }),
        ...((searchKey != '') && {
          full_name: {
            contains: searchKey,
          }
        }),
        status,
        ...fromDate && toDate && {
          created_at: {
            gte: fromDate,
            lte: addDays(toDate!, 1)
          }
        }
      },
    };

    const [bills, count] = await prisma.$transaction([
      prisma.bill.findMany({
        where: query.where,
        take: fetchCount,
        skip: Number(page ?? 0) * Number(fetchCount),
        select: {
          id: true,
          city: true,
          district: true,
          wards: true,
          address: true,
          phoneNumber: true,
          full_name: true,
          email: true,
          note: true,
          created_at: true,
          updated_at: true,
          total_price: true,
          user: true,
          reason: true,
          bill_product: {
            select: {
              quantity: true,
              color: true,
              size: true,
              image: true,
              product_model_id: true,
              product_name: true,
              price: true,
            },
          },
          status: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      prisma.bill.count({ where: query.where }),
    ]);

    return NextResponse.json({
      items: bills,
      // phân trang
      pagination: {
        totalCount: count,
        page: page <= 0 ? 1 : page + 1,
        totalPage: fetchCount
          ? Number(Math.ceil(count / Number(fetchCount)))
          : 1,
      },
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const data = await verifyToken(req);
  if (data == null || data.is_lock) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 });
  }

  //validate input
  const body = (await req.json()) as CreateBillReq;
  if (
    isBlank(body.city) ||
    isBlank(body.district) ||
    isBlank(body.wards) ||
    isBlank(body.address) ||
    isBlank(body.name) ||
    isBlank(body.phone) ||
    isBlank(body.email) ||
    body.bill_product.length == 0
  ) {
    return NextResponse.json(new RestError(INPUT_INVALID));
  }

  try {
    const models = await prisma.$transaction(
      body.bill_product.map((item) =>
        prisma.product_model.findFirst({
          where: { id: item.product_model_id || 0 },
          select: {
            product: { select: { name: true } },
            price: true,
            size: true,
            color: true,
            image: true,
          },
        })
      )
    );
    let total_price = 0;
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      total_price += (model?.price ?? 0) * body.bill_product[i].quantity;
    }

    // transaction là để đồng bộ các câu lệnh sql không liên quan theo tuần tự khi một cái không thành công các cái còn lại sẽ rollback
    const [createBill] = await prisma.$transaction([
      prisma.bill.create({
        data: {
          user_id: data.id,
          city: body.city,
          district: body.district,
          wards: body.wards,
          address: body.address,
          note: body.note,
          full_name: body.name,
          phoneNumber: body.phone,
          email: body.email,
          status: ORDER_STATUS.NEW,
          total_price,
          bill_product: {
            // do bill_product là một mảng nên phải map
            // ({object}) tương dương return {object}
            create: body.bill_product.map((item, idx) => ({
              quantity: item.quantity,
              product_model_id: item.product_model_id,
              color: models[idx]?.color,
              price: models[idx]?.price,
              size: models[idx]?.size,
              product_name: models[idx]?.product?.name,
              image: models[idx]?.image,
            })),
          },
        },
      }),
      // cập nhật lại stock và sold
      ...body.bill_product.map((item: bill_product) =>
        prisma.product_model.update({
          where: {
            id: item.product_model_id || 0,
          },
          data: {
            stock: {
              // trừ đi item.quantity
              decrement: item.quantity,
            },
          },
        })
      ),
    ]);

    if (createBill) {
      await prisma.cart.deleteMany({
        where: {
          user: {
            username: data.username,
          },
        },
      });
    }

    return NextResponse.json(createBill);
  } catch (error) {
    console.log({ error });
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {
      status: 500,
    });
  }
};
