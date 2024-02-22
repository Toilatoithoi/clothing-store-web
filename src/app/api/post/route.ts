import prisma from '@/lib/db';
import { isBlank } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { CreatePostReq } from '@/interfaces/request';
import { RestError } from '@/utils/service';
import { INPUT_INVALID, INTERNAL_SERVER_ERROR } from '@/constants/errorCodes';
export const GET = async (req: NextRequest) => {
  try {
    const post = await prisma.post.findMany();
    return NextResponse.json(post);
  } catch (error) {
    console.log({error})
    return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR));
  }

}

export const POST = async (req: NextRequest) => {
    //validate input 
    const body : CreatePostReq = await req.json();
    console.log(body)

    if (isBlank(body.title) || isBlank(body.content) || isBlank(body.createAt)) {
      return NextResponse.json(new RestError(INPUT_INVALID));
    }


    try {

      // thêm vào db
        const createdPost = await prisma.post.create({
        data: {
          ...body,
        }
      })
    
      return NextResponse.json({createdPost})

    } catch (error) {
        console.log({error})
        return NextResponse.json(new RestError(INTERNAL_SERVER_ERROR)); 
    }
  }