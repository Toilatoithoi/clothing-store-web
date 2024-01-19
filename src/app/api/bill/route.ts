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
        status: "SUCCESS", 
        user: {
          username: data.username
        }
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
        status:"SUCCESS"
      }
    })

    const modelsToCreate: { bill_id: number; product_id: number; quantity: number; }[] = [];

    productids.forEach((id_p: any) => {
        const model = {
          bill_id: createdBill.id,
          product_id: Number(id_p),
          quantity: body.quantity
        };
        modelsToCreate.push(model);
    });

    const model = await prisma.bill_product.createMany({
      data: modelsToCreate,
    });

    return NextResponse.json({ model })

  } catch (error) {
    console.log({ error })
    return NextResponse.json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Lỗi hệ thống"
    }, { status: 500 })
  }
}