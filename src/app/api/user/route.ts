import { ROLES } from '@/constants';
import prisma from '@/lib/db';
import { verifyToken } from '@/utils/service';
import { NextRequest, NextResponse } from 'next/server';
export const GET = async (req: NextRequest) => {
  const data = await verifyToken(req);
  if (data == null) {
    return NextResponse.json({ code: 'UNAUTHORIZED' }, { status: 400 })
  }
  const user = await prisma.user.findFirst({ where: { id: data.id } });

  return NextResponse.json(user);
}




