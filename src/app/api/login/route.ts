import { isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { RestError, hashPassword } from '@/utils/service';
import jwt from 'jsonwebtoken';
import { INPUT_INVALID } from '@/constants/errorCodes';

export const POST = async (req: NextRequest) => {
  //validate input
  const body = await req.json();
  if (isBlank(body.username) || isBlank(body.password)) {
    return NextResponse.json(new RestError(INPUT_INVALID));
  }

  // check username có tồn tại không

  const user = await prisma.user.findFirst({
    where: {
      username: body.username,
    },
  });

  if (user == null) {
    return NextResponse.json(
      {
        code: 'USER_NOT_FOUND',
        message: 'Không tìm thấy user',
      },
      {
        status: 404,
      }
    );
  }
  if (user.is_lock) {
    return NextResponse.json(
      {
        code: 'USER_LOCKED',
        message: 'Tài khoản của bạn đã bị khóa',
      },
      {
        status: 404,
      }
    );
  }
  // check password
  const currPassword = user.password;
  const comparePassword = hashPassword(body.password);

  if (currPassword !== comparePassword) {
    return NextResponse.json(
      {
        code: 'WRONG_PASSWORD',
        message: 'Mật khẩu không đúng',
      },
      {
        status: 400,
      }
    );
  }

  //generate token
  const userInfo = {
    ...user,
    password: undefined,
  };
  const accessToken = await jwt.sign(userInfo, process.env.JWT_SECRET_KEY!, {
    expiresIn: '7d',
  });

  //reponse

  return NextResponse.json({ accessToken, userInfo });
};
