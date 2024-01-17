import { User } from '@prisma/client';
import sha256 from 'crypto-js/sha256';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken'

export const hashPassword = (password: string) => {
  return sha256(password).toString();
}


export const verifyToken = async (req: NextRequest) => {
  const authorization = req.headers.get('authorization');
  if (!authorization) {
    return null
  }
  const [tokenType, accessToken] = authorization.split(' ');

  if (tokenType !== 'Bearer' || !accessToken) {
    return null
  }
  try {
    const data = await jwt.verify(accessToken, process.env.JWT_SECRET_KEY ?? '') as User;
    return data
  } catch (error) {
    return null
  }
}