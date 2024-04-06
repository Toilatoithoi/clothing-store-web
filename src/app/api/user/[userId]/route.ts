import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import jwt from 'jsonwebtoken'
import { User } from '@prisma/client';
import { RestError, verifyToken } from '@/utils/service';
import { INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';

// Update user info
export const PUT = async (req: NextRequest, { params }: { params: { userId: string; } }) => {
  console.log({ params })
  const id = Number(params.userId);
  const data = await verifyToken(req);
  if (data == null) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
  }
  const body = await req.json();
  // validate data: phoneNumber có hợp lệ k? .....

  try {
    const user = await prisma.user.findFirst({ where: { id, username: data.username } });
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
        address: body.address,
        gender: body.gender,
        password: body.password
      }
    })

    return NextResponse.json({ id: res.id })
  } catch (error) {
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }
}

export const GET = async (req: NextRequest, { params }: { params: { userId: string; } }) => {
  const data = await verifyToken(req);

  if (data == null) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
  }

  if (String(data.id) !== String(params.userId)) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
  }

  const user = await prisma.user.findFirst({ where: { id: Number(params.userId) } })

  return NextResponse.json(user)
}

