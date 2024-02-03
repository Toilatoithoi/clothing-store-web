import prisma from '@/lib/db';
import { isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { CreateBillReq } from '@/interfaces/request';
import { verifyToken } from '@/utils/service';
export const GET = async (req: NextRequest) => {
  try {
    // input fromDate, toDate, status
    // verify token
    const data = await verifyToken(req);
    if (data == null) {
      return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
    }

    // filter
    const bill = await prisma.bill.findMany({
      where: {
        status: "SUCCESS", // nếu status != null thì mới cần truyền vào
        user: {
          username: data.username
        },
        // dùng gte, lte để filter theo from date, to date
      }
    });

    if (bill == null) {
      return NextResponse.json({
        code: 'Bill is false',
      }, {
        status: 404
      })
    }

    return NextResponse.json(bill);
  } catch (error) {
    console.log({ error })
    return NextResponse.json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Lỗi hệ thống"
    }, { status: 500 })
  }

}

export const POST = async (req: NextRequest) => {

  const data = await verifyToken(req);
  if (data == null) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
  }

  //validate input 
  const body = await req.json();
  const productids = body.product_id.split(',')
  if (isBlank(body.city) || isBlank(body.district) || isBlank(body.wards) || isBlank(body.address)) {
    return NextResponse.json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Đầu vào không hợp lệ'
    }, {
      status: 400
    })
  }

  //input address, note, name, phone..... billProducts: {} lấy tương tự cart


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
        status: "SUCCESS",
        bill_product: {
          // create:[
          // {
          //   // product_model_id,
          //   // quantity,            
          // }
          // ]
        }
      }
    })

    return NextResponse.json({})

  } catch (error) {
    console.log({ error })
    return NextResponse.json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Lỗi hệ thống"
    }, { status: 500 })
  }
}