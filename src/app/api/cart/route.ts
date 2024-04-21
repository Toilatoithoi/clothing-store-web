import prisma from '@/lib/db';
import { isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { CreateCartReq } from '@/interfaces/request';
import { RestError, verifyToken } from '@/utils/service';
import { INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
import { PRODUCT_STATUS } from '@/constants';


interface UpdateCartInput {
  quantity: number;
  product_model_id: number;
  override?: boolean; // ghi đè hay cộng thêm quantiy vào. 
}

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
        },
        product_model:{
          product:{
            status: PRODUCT_STATUS.PUBLISHED
          }
        }
      },
      select: {
        quantity: true,
        product_model_id: true,
        product_model: {
          select: {
            product: {
              select: {
                name: true,          
              }
            },
            color: true,
            price: true,
            size: true,
            image: true,
            sold: true,
            stock: true
          },
        },
      }
    });

    const res = cart.map(item => {
      return {
        ...item.product_model,
        quantity: item.quantity,
        product_model_id: item.product_model_id,
      }
    })

    return NextResponse.json(res);
  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const data = await verifyToken(req);
    if (data == null) {
      return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
    }
    const body = await req.json() as UpdateCartInput;
    console.log({ body })
    //lấy danh model theo user id;
    // kiểm tra model xem đã có trong database chưa
    const cartItem = await prisma.cart.findFirst({ // lấy ra bản ghi theo userid và product model id
      where: {
        user_id: data.id,
        // nếu không parseInt sẽ lỗi
        product_model_id: Number(body.product_model_id),
      }
    })

    let res = null
    // console.log({ cartItem })
    // console.log(Number(cartItem?.quantity))
    if (cartItem) { // nếu product_mode đã dc thêm vào giỏ hàng thì cartItem sẽ khác null
      res = await prisma.cart.update({ // update quantity cho cartItem
        data: {
          quantity: body.override ? Number(body.quantity) : (cartItem.quantity ?? 0) + Number(body.quantity ?? 0)
        },
        where: {
          id: cartItem.id,   
        }
      })
    } else{ // nếu product_mode chưa dc thêm vào thì tạo mới
        res = await prisma.cart.create({
          data: {
            user_id: data.id,
            // nếu không parseInt sẽ lỗi
            product_model_id: Number(body.product_model_id),
            quantity: body.quantity,
        }
      })
    }

    return NextResponse.json(res)

  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }
}


export const PUT = async (req: NextRequest) => {

  const data = await verifyToken(req);
  if (data == null) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
  }

  const body = await req.json();

  try {



    return NextResponse.json({})

  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }
}