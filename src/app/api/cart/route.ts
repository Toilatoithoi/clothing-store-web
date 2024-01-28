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
      },
      select: {
        quantity: true,
        product_model: {
          select: {
            product: {
              select: {
                name: true
              }
            },
            color: true,
            price: true,
            size: true,
            image: true
          }
        },
      }
    });

    const res = cart.map(item => {
      return {
        ...item.product_model,
        quantity: item.quantity,
      }
    })

    return NextResponse.json(res);
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

  const body = await req.json();

  try {
    const cart = await prisma.cart.findMany({
      where: {
        user: {
          username: data.username
        }
      }
    });
    const modelsToCreate: { product_model_id: number; quantity: number; }[] = [];

    body.forEach((a: any) => {
      cart.forEach(async (b) => {
        if (a.id = b.id) {
          await prisma.cart.update({
            where: { id: b.id },
            data: {
              product_model_id: Number(a.product_model_id),
              quantity: Number(a.quantity)
            }
          })
        } else {
          await prisma.cart.create({
            data: {
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