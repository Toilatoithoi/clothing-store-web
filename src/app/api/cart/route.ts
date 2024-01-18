import prisma from '@/lib/db';
import { isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { CreateCartReq } from '@/interfaces/request';
import { verifyToken } from '@/utils/service';
export const GET = async (req: NextRequest) => {
    try {
      const data = await verifyToken(req);
      if (data == null) {
        return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
      }
  
      const cart = await prisma.cart.findMany({
        where: {
          user: {
            username: data.username
          }
        }
      });
  
      if (cart == null) {
        return NextResponse.json({
         code: 'Cart is false',
     }, {
         status: 404
     })
   }
  
      return NextResponse.json(cart);
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

    if (isBlank(body.product_id) || isBlank(body.quantity) ) {
      return NextResponse.json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Đầu vào không hợp lệ'
      }, {
        status: 400
      })
    }
  
    
    try {
      const modelsToCreate: { user_id: number; product_id: number; quantity: number; }[] = [];

      productids.forEach((id_p: any) => {
        const model = {
          user_id: data.id,
          product_id: Number(id_p),
          quantity: body.quantity
        };
        modelsToCreate.push(model);
      });

      const createdCart = await prisma.cart.createMany({
        data: modelsToCreate,
      });

      return NextResponse.json({ createdCart })

    } catch (error) {
      console.log({ error })
      return NextResponse.json({
        code: "INTERNAL_SERVER_ERROR",
        message: "Lỗi hệ thống"
      }, { status: 500 })
    }
  }