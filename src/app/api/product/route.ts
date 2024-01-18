import { CreateProductReq } from '@/interfaces/request';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
export const GET = async (request: NextRequest,) => {
  try {
    const product = await prisma.product.findMany();

    return NextResponse.json(product);
  } catch (error) {
    console.log({error})
    return NextResponse.json({
        code: "INTERNAL_SERVER_ERROR",
        message: "Lỗi hệ thống"
      }, { status: 500 })
  }
}

export const POST = async (req: NextRequest,) => {
  try {
    const body = await req.json();
    //tạo product
    const color_products = body.color.split(',')
    const size_products = body.size.split(',')
    console.log(color_products)

    const product = await prisma.product.create({
      data: {
        name: body.name,
        status: body.status,
        description: body.description,
        category_id: body.category_id
      }
    })

    const modelsToCreate: { product_id: number; price: number; color: string; size: string; sold: number; stock: number; image: string; }[] = [];

    color_products.forEach((color_product: any) => {
      size_products.forEach((size_product: any) => {
        const model = {
          product_id: product.id,
          price: body.price,
          color: `${color_product}`,
          size: `${size_product}`,
          sold: body.sold,
          stock: body.stock,
          image: body.image,
        };
  
        modelsToCreate.push(model);
      })
    });

    const model = await prisma.product_model.createMany({
      data: modelsToCreate,
    });

    return NextResponse.json(model)
    
  } catch (error) {
    console.log({ error })
    return NextResponse.json({ code: 'INTERNAL_SERVER_ERROR', message: 'lỗi hệ thống' })

  }
}
