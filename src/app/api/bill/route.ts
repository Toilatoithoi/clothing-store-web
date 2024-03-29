import prisma from '@/lib/db';
import { isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { CreateBillReq } from '@/interfaces/request';
import { RestError, verifyToken } from '@/utils/service';
import { INPUT_INVALID, INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
import { bill_product } from '@prisma/client';


export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const firstDay = url.searchParams.get('firstDay')?.toString();
  const lastDay = url.searchParams.get('lastDay')?.toString();
  console.log({firstDay})
  console.log({lastDay})
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
        full_name: true,
        email: true,
        note: true,
        created_at: true,
        updated_at: true,
        bill_product: true,
        status: true,
      },
      orderBy:{
        created_at: 'desc'
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
  if (isBlank(body.city) || isBlank(body.district) || isBlank(body.wards) || isBlank(body.address) || isBlank(body.name) || isBlank(body.phone) || isBlank(body.email) || body.bill_product.length == 0) {
    return NextResponse.json(new RestError(INPUT_INVALID));
  }

  try {
    // thêm vào db
    // const createdBill = await prisma.bill.create({
    //   data: {
    //     user_id: data.id,
    //     city: body.city,
    //     district: body.district,
    //     wards: body.wards,
    //     address: body.address,
    //     note: body.note,
    //     full_name: body.name,
    //     phoneNumber: body.phone,
    //     email: body.email,
    //     status: "NEW",
    //     bill_product: {
    //       // do bill_product là một mảng nên phải map
    //       // ({object}) tương dương return {object}
    //       create: body.bill_product.map((item: Record<string, string>) => ({
    //         quantity: item.quantity,
    //         product_model_id: item.product_model_id,
    //       })),
    //     },
    //   }
    // })
    // tính toán lại sold và stock
    
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
          status: "NEW",
          bill_product: {
            // do bill_product là một mảng nên phải map
            // ({object}) tương dương return {object}
            create: body.bill_product.map((item: Record<string, string>) => ({
              quantity: item.quantity,
              product_model_id: item.product_model_id,
            })),
          },
        }
      }),
      // cập nhật lại stock và sold
      ...body.bill_product.map((item: bill_product) => prisma.product_model.update({
        where: {
          id: item.product_model_id
        },
        data: {
          sold: {
            // công thêm item.quantity
            increment: item.quantity
          },
          stock: {
            // trừ đi item.quantity
            decrement: item.quantity,
          }
        }
      }))
    ])


    // await prisma.product_model.updateMany(body.bill_product.map((item: Record<string, string>) => ({
    //   where: {
    //     id: item.product_model_id
    //   },
    //   data: {

    //   }
    // })))

    if (createBill) {
      await prisma.cart.deleteMany({
        where: {
          user: {
            username: data.username
          },
        }
      })
    }

    return NextResponse.json(createBill)

  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), { status: 300 });
  }
}