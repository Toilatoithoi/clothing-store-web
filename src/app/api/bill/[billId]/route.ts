import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { RestError, verifyToken } from '@/utils/service';
import { INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';

export const PUT = async (req: NextRequest, { params }: { params: { billId: string; } }) => {
    
    const data = await verifyToken(req);
    if (data == null) {
      return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
    }

    const id = Number(params.billId);
    const body = await req.json();
    // validate data: user_id có hợp lệ k? .....
  
    try {
      const bill = await prisma.bill.findFirst({ where: { id , user:{
        username: data.username
      }} });
      // lây thông tin bill trên db -> nếu mà không có thông tin bill -> thông báo lỗi bill not exist
      if (bill == null) {
        return NextResponse.json({
          code: "Bill_NOT_EXIST",
          message: "Bill không tồn tại"
        }, { status: 403 })
      }
  
      // update data vào hệ thống
      const res = await prisma.bill.update({
        where: {
          id,
          user_id: data.id
        },
        data: {
          ...body,
          user_id: undefined,
        }
      })
  
      return NextResponse.json({ id: res.id })
    } catch (error) {
        console.log({error})
        return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
    }
  }

  export const GET = async (req: NextRequest, { params }: { params: { billId: string; } }) => {
    const data = await verifyToken(req);
    if (data == null) {
      return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
    }
    const id = Number(params.billId);
    try {
      const bill = await prisma.bill.findFirst({ where: { id, user:{
        username: data.username
      } },
      select: {
        id: true,
        city: true,
        district: true,
        wards: true,
        address: true,
        note: true,
        created_at: true,
        user:{
          select:{
            name: true,
            phoneNumber: true,
            dob: true,
            username: true,
          }
        },
        updated_at: true,
        bill_product: {
          select:{
            product_model:{
              select: {
                product: {
                  select: {
                    name: true,
                  }
                },
                price: true,
              }
            },
            quantity: true,
          }
        },
      }
     });

       // lây thông tin bill trên db -> nếu mà không có thông tin bill -> thông báo lỗi bill not exist
       if (bill == null) {
        return NextResponse.json({
          code: "Bill_NOT_EXIST",
          message: "Bill không tồn tại"
        }, { status: 403 })
      }
  
      return NextResponse.json(bill);
    } catch (error) {
      console.log({error})
      return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
    }
  
  }

