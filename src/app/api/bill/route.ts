import prisma from '@/lib/db';
import { isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { CreateBillReq } from '@/interfaces/request';
import { RestError, verifyToken } from '@/utils/service';
import { INPUT_INVALID, INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';


export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const firstDay = url.searchParams.get('firstDay')?.toString();
  const lastDay = url.searchParams.get('lastDay')?.toString();
  try {
    // input fromDate, toDate, status
    // verify token
    const data = await verifyToken(req);
    if (data == null) {
      return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
    }
    const bill = await prisma.bill.findMany({
      where: {
        user: {
          username: data.username
        },
        // dùng gte, lte để filter theo from date, to date
        created_at: {
          gte: firstDay,
          lte: lastDay
        }
      },
      select: {
        id: true,
        city: true,
        district: true,
        wards: true,
        address: true,
        phoneNumber: true,
        fullname: true,
        note: true,
        created_at: true,
        updated_at: true,
        bill_product: true,
        status: true,
      }
    });

    if (bill.length === 0) {
      return NextResponse.json({
        code: 'Bill not exist',
      }, {
        status: 404
      })
    }

    return NextResponse.json(bill);
  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
  }

}

export const POST = async (req: NextRequest) => {

  const data = await verifyToken(req);
  if (data == null) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
  }

  //validate input 
  const body = await req.json();
  if (isBlank(body.city) || isBlank(body.district) || isBlank(body.wards) || isBlank(body.address)) {
    return NextResponse.json(new RestError(INPUT_INVALID));
  }

  try {
    // thêm vào db
    const createdBill = await prisma.bill.create({
      data: {
        user_id: data.id,
        city: body.city,
        district: body.district,
        wards: body.wards,
        address: body.address,
        note: body.note,
        fullname: body.name,
        phoneNumber: body.phone,
        status: "NEW",
        bill_product: {
          create: body.bill_product.map((item: Record<string, string>) => ({
            quantity: item.quantity,
            product_model_id: item.product_model_id,
          })),
        },
      }
    })

    const deleteCart = await prisma.cart.deleteMany({
      where:{
        user: {
          username: data.username
        },
      }
    })

    return NextResponse.json(createdBill)

  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), { status: 300 });
  }
}