import { CreateProductReq } from '@/interfaces/request';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
export const GET = async (request: NextRequest,) => {
  console.log('GET')
  return NextResponse.json([])
}

export const POST = async (req: NextRequest,) => {
  try {
    const body: CreateProductReq = await req.json();
    //tạo product

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
      }
    })

    // const model = await prisma.product_model.createMany({

    // })
  } catch (error) {
    console.log({ error })
    return NextResponse.json({ code: 'INTERNAL_SERVER_ERROR', message: 'lỗi hệ thống' })

  }
  return NextResponse.json({ demo: 'POST' })
}

export const PUT = async (request: NextRequest,) => {
  // const url = request.url;
  // const query = new URL(url).searchParams.get('name')
  // console.log({ query })
  console.log('PUT')
  return NextResponse.json({ demo: 'PUT' })
}

export const DELETE = async (request: NextRequest,) => {
  // const url = request.url;
  // const query = new URL(url).searchParams.get('name')
  // console.log({ query })
  console.log('DELETE')
  return NextResponse.json({ demo: 'DELETE' })
}