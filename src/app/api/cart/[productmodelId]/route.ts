import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/db';
import { RestError, verifyToken } from "@/utils/service";
import { INTERNAL_SERVER_ERROR } from "@/constants/errorCodes";

export const DELETE = async (req: NextRequest, { params }: { params: { productmodelId: string; } }) => {
    const id = Number(params.productmodelId);
    const data = await verifyToken(req);
    if (data == null) {
      return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
    }
    try {
      const product_model = await prisma.product_model.findFirst({ where: { id: id} });
      if (product_model == null) {
        return NextResponse.json({
          code: "PRODUCT_MODEL_NOT_EXIST",
          message: "product model không tồn tại"
        }, { status: 403 })
      }
      
      const productCart = await prisma.cart.deleteMany({ where: {
        product_model_id: id,
        user:{
          username: data.username
      } }});
  
      return NextResponse.json(data.username)
    } catch (error) {
      console.log({ error })
      return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
    }
  }
  