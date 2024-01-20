import { RestError, verifyToken } from '@/utils/service';
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
        phoneNumber: true,
        name: true,
        dob: true,
        gender: true,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
  }
};
