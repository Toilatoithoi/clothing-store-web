import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const PUT = async (req: NextRequest, { params }: { params: { billId: string; } }) => {
    const id = Number(params.billId);
    const body = await req.json();
    // validate data: user_id có hợp lệ k? .....
  
    try {
      const bill = await prisma.bill.findFirst({ where: { id } });
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
          id
        },
        data: {
          ...body,
          user_id: undefined
        }
      })
  
      return NextResponse.json({ id: res.id })
    } catch (error) {
        console.log({error})
      return NextResponse.json({
        code: "INTERNAL_SERVER_ERROR",
        message: "Lỗi hệ thống"
      }, { status: 500 })
    }
  }

  export const GET = async (req: NextRequest, { params }: { params: { billId: string; } }) => {
    const id = Number(params.billId);
    try {
      const bill = await prisma.bill.findFirst({ where: { id } });

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
      return NextResponse.json({
          code: "INTERNAL_SERVER_ERROR",
          message: "Lỗi hệ thống"
        }, { status: 500 })
    }
  
  }

