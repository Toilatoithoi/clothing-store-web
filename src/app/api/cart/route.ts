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


  export const PUT = async (req: NextRequest) => {

    const data = await verifyToken(req);
    if (data == null) {
      return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
    }
  
    //validate input 
    const body = await req.json();

    // if (isBlank(body.product_model_id) || isBlank(body.quantity) ) {
    //   return NextResponse.json({
    //     code: 'INTERNAL_SERVER_ERROR',
    //     message: 'Đầu vào không hợp lệ'
    //   }, {
    //     status: 400
    //   })
    // }
  
    
    try {
      const cart = await prisma.cart.findMany({
        where: {
          user: {
            username: data.username
          }
        }
      });
      const modelsToCreate: {product_model_id: number; quantity: number; }[] = [];

      body.forEach((a: any) => {
        cart.forEach(async (b) =>{
           if(a.id = b.id){ 
            await prisma.cart.update({
              where: {id: b.id},
              data:{
                product_model_id: Number(a.product_model_id),
                quantity: Number(a.quantity)
              }
            })
           }else{
            await prisma.cart.create({
                data:{
                  ...a,
                  id: undefined
                }
            })
           }
        })
      });

      // const createdCart = await prisma.cart.upsert({
      //   data: modelsToCreate,
      // });


      return NextResponse.json({})

    } catch (error) {
      console.log({ error })
      return NextResponse.json({
        code: "INTERNAL_SERVER_ERROR",
        message: "Lỗi hệ thống"
      }, { status: 500 })
    }
  }