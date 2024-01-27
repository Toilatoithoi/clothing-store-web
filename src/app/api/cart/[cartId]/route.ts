import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { CreateCategoryReq } from '@/interfaces/request';
export const DELETE = async (req: NextRequest, { params }: { params: { cartId: string; } }) => {
    const id = Number(params.cartId);
    try {
      // delete data khỏi hệ thống
      const res = await prisma.cart.delete({
        where: {
          id
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