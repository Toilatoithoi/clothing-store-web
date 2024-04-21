import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { CreateCategoryReq } from '@/interfaces/request';
import { RestError } from '@/utils/service';
import { INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
import { isBlank } from '@/utils';

export const PUT = async (req: NextRequest, { params }: { params: { categoryId: string; } }) => {
  const id = Number(params.categoryId);
  const body = await req.json();
  // validate data: user_id có hợp lệ k? .....

  try {
    const category = await prisma.category.findFirst({ where: { id } });
    // lây thông tin category trên db -> nếu mà không có thông tin category -> thông báo lỗi category not exist
    if (category == null) {
      return NextResponse.json({
        code: "CATEGORY_NOT_EXIST",
        message: "Category không tồn tại"
      }, { status: 403 })
    }

    // update data vào hệ thống
    const res = await prisma.category.update({
      where: {
        id
      },
      data: {
        ...body,
        // nếu nhập level bằng 1 thì parent_id = null còn không thì bằng parent_id nhập vào nếu không nhập thì sẽ lấy parent_id của category hiện tại 
        parent_id: Number(body.level) === 1 ? null : body.parent_id || category.parent_id
      }
    })

    return NextResponse.json({ id: res.id })
  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), { status: 500 });
  }
}

export const DELETE = async (req: NextRequest, { params }: { params: { categoryId: string; } }) => {
  const id = Number(params.categoryId);
  try {
    const product_category = await prisma.product.findFirst({ where: { category_id: id } });
    if (product_category != null) {
      return NextResponse.json({
        code: "PRODUCT_CATEGORY_EXIST",
        message: "Category là khoá ngoại"
      }, { status: 403 })
    }

    const category_parent = await prisma.category.findFirst({ where: { parent_id: id } });
    if (category_parent != null) {
      return NextResponse.json({
        code: "CATEGORY_PARENT_EXIST",
        message: "Category là khoá ngoại"
      }, { status: 403 })
    }

    const parent = await prisma.category.findFirst({ where: { id } })
    if (parent == null) {
      return NextResponse.json({
        code: "CATEGORY_NOT_EXIST",
        message: "Category không tồn tại"
      }, { status: 403 })
    }


    // delete data khỏi hệ thống
    const res = await prisma.category.delete({
      where: {
        id
      }
    })

    return NextResponse.json({})
  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }
}

export const GET = async (req: NextRequest, { params }: { params: { categoryId: string; } }) => {
  const id = Number(params.categoryId);
  try {
    const searchParams = new URL(req.url).searchParams;
    const level = searchParams.get('level');
    const id = Number(params.categoryId);
    let category;
    if (Number(level) == 1) {
      category = await prisma.category.findFirst({
        where: {
          id: id,
        },
      });
    } else {
      category = await prisma.category.findMany({
        ...(!isBlank(level) && {
          where: {
            parent_id: id,
            level: Number(level),
          },
        }),
        orderBy: {
          category: {
            name: 'desc'
          },
        },
      });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.log({ error })
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }

}

