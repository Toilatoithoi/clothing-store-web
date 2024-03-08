import { RestError, hashPassword, verifyToken } from '@/utils/service';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from '@/constants/errorCodes';

export const GET = async (req: NextRequest) => {
  // verify token
  const data = await verifyToken(req);
  if (data == null) {
    return NextResponse.json(new RestError(UNAUTHORIZED), { status: 401 });
  }
  // lấy thông tin user nếu token hợp lệ
  try {
    const user = await prisma.user.findFirst({
      where: { id: Number(data.id) },
      select: {
        address: true,
        username: true,
        password:true,
        phoneNumber: true,
        name: true,
        dob: true,
        gender: true,
      },
    });
    console.log(user)
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
  }
};

export const PUT = async (req: NextRequest) => {
  const data = await verifyToken(req);
  if (data == null) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
  }
  const body = await req.json();
  // validate data: phoneNumber có hợp lệ k? .....

  try {
    const userData = await prisma.user.findFirst({ where: {username: data.username } });
    // lây thông tin user trên db -> nếu mà không có thông tin user -> thông báo lỗi user not exist
    if (userData == null) {
      return NextResponse.json({
        code: "USER_NOT_EXIST",
        message: "User không tồn tại"
      }, { status: 403 })
    }
    // hash password
    const hash = hashPassword(body.password);
    // update data vào hệ thống
    const res = await prisma.user.update({
      where: {
        id: userData.id
      },
      data: {
        name: body.name,
        dob: body.dob,
        phoneNumber: body.phoneNumber,
        address: body.address,
        gender: body.gender,
        password: hash
      }
    })

    return NextResponse.json({ id: res.id })
  } catch (error) {
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
  }
}
