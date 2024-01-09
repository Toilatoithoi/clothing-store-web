import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest,) => {
  // const url = request.url;
  // const query = new URL(url).searchParams.get('name')
  // console.log({ query })
  console.log('GET')
  return NextResponse.json({ demo: 'demo' })
}

export const POST = async (request: NextRequest,) => {
  // Tạo product
  const body = await request.json(); // lấy data product client truyền xuống;
  // validate trường thông tin: name không dc trống ....

  // nếu lỗi return 
  try {
    // kết nối với data base 

    // thêm product vào data base

    // trả về response success 

  } catch (error) {
    return NextResponse.json({ code: 'INTERNAL_SERVER_ERROR', message: 'lỗi hệ thống' })

  }
  return NextResponse.json({ demo: 'POST' })
}

export const PUT = async (request: NextRequest,) => {
  // const url = request.url;
  // const query = new URL(url).searchParams.get('name')
  // console.log({ query })
  console.log('PUT')
  return NextResponse.json({ demo: 'PUT' })
}

export const DELETE = async (request: NextRequest,) => {
  // const url = request.url;
  // const query = new URL(url).searchParams.get('name')
  // console.log({ query })
  console.log('DELETE')
  return NextResponse.json({ demo: 'DELETE' })
}