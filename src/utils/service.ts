import { User } from '@prisma/client';
import sha256 from 'crypto-js/sha256';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export const hashPassword = (password: string) => {
  return sha256(password).toString();
};

export const verifyToken = async (req: NextRequest) => {
  const authorization = req.headers.get('authorization');
  if (!authorization) {
    return null;
  }
  const [tokenType, accessToken] = authorization.split(' ');

  if (tokenType !== 'Bearer' || !accessToken) {
    return null;
  }
  try {
    const data = (await jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY ?? ''
    )) as User;
    return data;
  } catch (error) {
    return null;
  }
};


const mapCodeToMessage: Record<string, string> = {
  INTERNAL_SERVER_ERROR: 'Lỗi hệ thống',
  INPUT_INVALID: 'Đầu vào không hợp lệ',
};
export class RestError {
  code: string;
  message?: string;

  //  tự map message nếu có giá trị truyền vào không thì sẽ lấy giá trị của code
  constructor(code: string, message?: string) {
    this.code = code;
    this.message = message ?? mapCodeToMessage[code];
  }
}
