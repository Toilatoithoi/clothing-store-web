import prisma from '@/lib/db';
import { CreateUserReq } from '@/interfaces/request';
import { isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/utils/service';
//Create user
export const POST = async (req: NextRequest) => {
  const body: CreateUserReq = await req.json();
  console.log({
    body,
    password: isBlank(body.password),
    username: isBlank(body.username),
    phoneNumber: isBlank(body.phoneNumber),
  });
  // validate input
  if (
    isBlank(body.username) ||
    isBlank(body.password) ||
    isBlank(body.phoneNumber)
  ) {
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Input Invalid',
      },
      { status: 400 }
    );
  }

  try {
    // check trùng lặp: check username và số điện thoại có trùng lặp hay không
    const user = await prisma.user.findFirst({
      where: { username: body.username },
    });
    if (user != null) {
      return NextResponse.json(
        {
          code: 'USER_EXIST',
          message: 'User is existed',
        },
        { status: 400 }
      );
    }

    // hash password

    const hash = hashPassword(body.password);

    // thêm vào db
    const createdUser = await prisma.user.create({
      data: {
        ...body,
        password: hash,
      },
    });

    return NextResponse.json({ id: createdUser.id });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Lỗi hệ thống',
      },
      { status: 500 }
    );
  }
};
