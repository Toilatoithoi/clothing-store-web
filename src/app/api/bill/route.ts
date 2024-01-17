import prisma from '@/lib/db';
import { isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { CreateBillReq } from '@/interfaces/request';
import { verifyToken } from '@/utils/service';
export const GET = async (req: NextRequest) => {
  try {

    const data = await verifyToken(req);
    if (data == null) {
      return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
    }

    const bill = await prisma.bill.findMany({
      where: {
        user: {
          username: data.username
        }
      }
    });

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
  //validate input 
  const body: CreateBillReq = await req.json();
  if (isBlank(String(body.user_id)) || isBlank(body.city) || isBlank(body.district) || isBlank(body.wards) || isBlank(body.address)) {
    return NextResponse.json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Đầu vào không hợp lệ'
    }, {
      status: 400
    })
  }


  try {
    // check bill có thành công không 

    const billTue = await prisma.bill.findFirst({
      where: {
        status: "sccess"
      }
    })

    if (billTue == null) {
      return NextResponse.json({
        code: 'Bill is false',
      }, {
        status: 404
      })
    }

    // thêm vào db
    const createdBill = await prisma.bill.create({
      data: {
        ...body,
      }
    })

    return NextResponse.json({ createdBill })

  } catch (error) {
    console.log({ error })
    return NextResponse.json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Lỗi hệ thống"
    }, { status: 500 })
  }
}