import { RestError, hashPassword, verifyToken } from '@/utils/service';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from '@/constants/errorCodes';
import { UserPayload } from '@/app/(customer)/user/page';

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
        password: true,
        phoneNumber: true,
        name: true,
        dob: true,
        gender: true,
        role: true
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }
};

export const PUT = async (req: NextRequest) => {
  const data = await verifyToken(req);
  if (data == null) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
  }
  const body: UserPayload = await req.json();
  // validate data: phoneNumber có hợp lệ k? .....

  try {
    // update data vào hệ thống
    const res = await prisma.user.update({
      where: {
        id: data.id
      },
      data: {
        name: body.name,
        dob: new Date(body.dob).toISOString(),
        phoneNumber: body.phoneNumber,
        address: body.address,
        gender: body.gender
      }
    })
    return NextResponse.json({ res })
  } catch (error) {
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR), {status: 500});
  }
}
