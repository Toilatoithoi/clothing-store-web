import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
export const GET = async () => {
  const user = await prisma.user.findMany();

  return NextResponse.json(user);
}





