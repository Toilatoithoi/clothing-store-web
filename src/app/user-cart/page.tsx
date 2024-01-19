
'use client'
import React from 'react';
import { IoIosArrowForward } from "react-icons/io";
import Pay from '@/assets/svg/pay.svg'
import { CiShoppingTag } from "react-icons/ci";
import ProductImage from '@/assets/png/product-1.jpg'
import Image from 'next/image'
import InputCount from '@/components/InputCount';


const UserCart = () => {
  return (
    <div>
      <div className='flex items-center justify-center my-[3.2rem]'>
        <div className='font-bold'>Giỏ hàng</div><IoIosArrowForward />
        <div>Thanh toán</div><IoIosArrowForward />
        <div>Hoàn tất</div>
      </div>
      <div className='w-full'>
        <div className='flex w-full gap-[3.2rem]'>
          <div className='bg-[#f7f8fa] flex-1 p-[3rem] grid grid-cols-5 h-fit gap-4'>
            <div className='col-span-2'>Sản phẩm</div>
            <div className='text-center'>Giá </div>
            <div className='text-center'>Số lượng</div>
            <div className='text-center'>Tạm tính</div>
            <>
              <div className='flex col-span-2'>
                <Image src={ProductImage} className='object-contain mr-4' alt="product" width={80} />
                <div>
                  <div>Áo hoodie nam AHHTK403</div>
                  <div>Màu sắc: Be</div>
                  <div>Cỡ: M</div>
                  <div className='cursor-pointer hover:text-red-500'>Xóa</div>
                </div>
              </div>
              <div className='text-center'>500,000</div>
              <div className='flex justify-center'><InputCount /></div>
              <div className='text-center'>500,000</div>
            </>
            <>
              <div className='flex col-span-2'>
                <Image src={ProductImage} className='object-contain mr-4' alt="product" width={80} />
                <div>
                  <div>Áo hoodie nam AHHTK403</div>
                  <div>Màu sắc: Be</div>
                  <div>Cỡ: M</div>
                  <div className='cursor-pointer hover:text-red-500'>Xóa</div>
                </div>
              </div>
              <div className='text-center'>500,000</div>
              <div className='flex justify-center'><InputCount /></div>
              <div className='text-center'>500,000</div>
            </>
            <>
              <div className='flex col-span-2'>
                <Image src={ProductImage} className='object-contain mr-4' alt="product" width={80} />
                <div>
                  <div>Áo hoodie nam AHHTK403</div>
                  <div>Màu sắc: Be</div>
                  <div>Cỡ: M</div>
                  <div className='cursor-pointer hover:text-red-500'>Xóa</div>
                </div>
              </div>
              <div className='text-center'>500,000</div>
              <div className='flex justify-center'><InputCount /></div>
              <div className='text-center'>500,000</div>
            </>

          </div>
          <div className='bg-[#f7f8fa] w-[40rem]  p-[3rem]'>
            <div className='h-[4rem] flex items-center text-[2rem] font-bold mb-[1.6rem]'>Tóm tắt đơn hàng</div>
            <div className=' w-full flex justify-between h-[3.6rem] items-center text-[1.6rem]'>
              <div className='font-bold'>Tạm tính</div>
              <div>2.670.000 VNĐ</div>
            </div>
            <div className='w-full flex justify-between h-[3.6rem] items-center text-[1.6rem] mb-[2.4rem]'>
              <div className='font-bold'>Tổng</div>
              <div className='font-bold'>2.670.000 VNĐ</div>
            </div>
            <div className='w-full mb-[2.4rem]'>
              <button type="button" className='h-[4rem] w-full flex items-center justify-center tex-[1.6rem] font-bold text-white uppercase bg-[#bc0516] flex-1'>Thanh toán</button>
            </div>
            <div className='flex text-[1.6rem] items-center mb-[1.4rem]'> <CiShoppingTag className=" font-bold mr-[0.4rem]" /> <div className='font-bold'>Phiếu ưu đãi</div> </div>
            <div className='flex h-[3.8rem] border border-gray-900 mb-[1rem]'>
              <input type="text" placeholder='Mã ưu đãi' className='outline-none flex-1 px-4' />
              <button className='bg-[#2d2d2d]  px-4 text-white'>Áp dụng</button>
            </div>
            <div className='text-[1.6rem] font-bold mb-[1.5rem]'>Free ship cho đơn hàng từ 500.000đ</div>
            <div className='text-[1.6rem] font-bold py-[1.5rem] border-t border-gray-200'>Chùng tôi chấp nhận</div>
            <div><Pay className="w-[10rem]" /></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCart