import prisma from '@/lib/db';
import { isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { CreateCategoryReq } from '@/interfaces/request';
export const GET = async (req: NextRequest) => {
  try {
    const category = await prisma.catetory.findMany();

    return NextResponse.json(category);
  } catch (error) {
    console.log({error})
    return NextResponse.json({
        code: "INTERNAL_SERVER_ERROR",
        message: "Lỗi hệ thống"
      }, { status: 500 })
  }

}

export const POST = async (req: NextRequest) => {
    //validate input 
    const body : CreateCategoryReq = await req.json();
    if (isBlank(String(body.name)) || isBlank(String(body.parent_id))) {
      return NextResponse.json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Đầu vào không hợp lệ'
      }, {
        status: 400
      })
    }

  
    try {

      // thêm vào db
        const createdCategory = await prisma.catetory.create({
        data: {
          ...body,
        }
      })
    
      return NextResponse.json({createdCategory})

    } catch (error) {
        console.log({error})
        return NextResponse.json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Lỗi hệ thống"
          }, { status: 500 })  
    }
  }