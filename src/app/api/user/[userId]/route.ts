import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import jwt from 'jsonwebtoken'
import { User } from '@prisma/client';

// Update user info
export const PUT = async (req: NextRequest, { params }: { params: { userId: string; } }) => {
  console.log({ params })
  const id = Number(params.userId);
  const body = await req.json();
  // validate data: phoneNumber có hợp lệ k? .....

  try {
    const user = await prisma.user.findFirst({ where: { id } });
    // lây thông tin user trên db -> nếu mà không có thông tin user -> thông báo lỗi user not exist
    if (user == null) {
      return NextResponse.json({
        code: "USER_NOT_EXIST",
        message: "User không tồn tại"
      }, { status: 403 })
    }
    // update data vào hệ thống
    const res = await prisma.user.update({
      where: {
        id
      },
      data: {
        name: body.name,
        dob: body.dob,
        phoneNumber: body.phoneNumber,
      }
    })

    return NextResponse.json({ id: res.id })
  } catch (error) {
    return NextResponse.json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Lỗi hệ thống"
    }, { status: 500 })
  }
}

export const GET = async (req: NextRequest, { params }: { params: { userId: string; } }) => {

  const authorization = req.headers.get('authorization');
  if (!authorization) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
  }
  const [tokenType, accessToken] = authorization.split(' ');

  if (tokenType !== 'Bearer' || !accessToken) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
  }
  const data = await jwt.verify(accessToken, process.env.JWT_SECRET_KEY ?? '') as User;
  if (String(data.id) !== String(params.userId)) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
  }

  const user = await prisma.user.findFirst({ where: { id: Number(params.userId) } })

  return NextResponse.json(user)
}

