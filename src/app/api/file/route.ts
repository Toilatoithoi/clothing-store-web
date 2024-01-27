import multer from 'multer';
import { createEdgeRouter } from 'next-connect';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary'
import { uuid } from '@/utils';

export const POST = async (req: NextRequest, ctx: any) => {

  // tạo ra một chuỗi không bao giờ trùng lặp
  const public_id = uuid();
  const timestamp = new Date().getTime();
  const upload_preset = process.env.UPLOAD_PRESET ?? 'web-store';
  const secretKey = process.env.CLOUDINARY_SECRET_KEY;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUD_NAME_API_KEY;
  // tạo chữ kí
  // public_id là tên file ảnh đấy lên
  const signature = cloudinary.utils.api_sign_request(
    { public_id, timestamp, upload_preset }, secretKey!)
  console.log(signature)

  // bắt buộc phải chuyền dưới dạng form data vì phải truyền trên file
  const formData = await req.formData();

  formData.append('upload_preset', upload_preset);
  formData.append('public_id', public_id);
  formData.append('api_key', apiKey!);
  formData.append('signature', signature);
  formData.append('timestamp', String(timestamp));

  // upload ảnh
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  const data = await res.json()

  return NextResponse.json(data)
}