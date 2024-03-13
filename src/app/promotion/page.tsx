'use client'
import Promotion from '@/components/Promotion'
import { PostRes } from '@/interfaces/model'
import { useSWRWrapper } from '@/store/custom'
import Link from 'next/link'
import Image from 'next/image'
import { LuClock4 } from "react-icons/lu";
import React from 'react'
import Post from '@/components/Post'
import { FaPlus } from 'react-icons/fa6'
import anhBia from '@/assets/png/promotion.jpg'
//page danh sách
const PromotionPage = () => {
  const { data: postData } = useSWRWrapper<PostRes[]>('/api/post', {
    url: '/api/post',
  })
  return (
    <div className='mt-6'>
      <div className="w-full">
        <div className="flex w-full justify-center gap-[3.2rem]">
          <div className="bg-[#f7f8fa] h-fit w-[20rem] p-[1rem] border border-gray-200">
            <div className='w-full p-[3rem] text-center border-b-2 mb-4 border-gray-950'>
              <div className="font-bold text-[1.8rem]">BÀI VIẾT MỚI</div>
            </div>   
            {
              postData?.map((item, idx) => (
                <Link href={`/promotion/${item.id}`} key={idx}>
                  <div className='flex gap-1 mb-4'>
                    <Image className="object-contain mb-8" src={item.image} alt="Ảnh bìa" width={80} height={90} />
                    <div>
                      <div className='flex'>
                        <LuClock4 className='m-1' />
                        <div className='text-[1rem]'>
                          {item.createAt.toString().split('T')[0]}
                        </div>
                      </div>
                      <div className='text-[1rem] font-bold'>{item.title}</div>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
          {/* dùng grid chia làm 5 cột */}
          {/* box-sizing là tổng chiều dài của phần tử có tính thêm border, padding hay không */}
          {/* mã màu bg-[#f7f8fa] */}
          <div className="bg-[#f7f8fa] w-[70rem] h-fit">
            {
              postData?.map((item, idx) => (
                <Link href={`/promotion/${item.id}`} key={idx} className='flex mb-5'>
                  <div className=''>
                    <Image className="object-contain overflow-hidden" src={item.image} alt="Ảnh bìa" width={300} height={200}/>
                  </div>
                  <div className='bg-[#f7f8fa] px-[1.6rem] py-[1.6rem] flex flex-col items-start justify-start cursor-pointer overflow-hidden'>
                    <div className='h-fit pb-8 mb-2 border-b-[0.05rem] border-gray-300 cursor-pointer'>
                      <div className='text-[1.2rem] font-bold'>Tin tức</div>
                      <div className='flex text-[1rem] gap-1'>
                        <LuClock4 className='my-1' />
                        <div className=''> {item.createAt.toString().split('T')[0]}</div>
                      </div>
                      <div className='text-[1.2rem] font-bold'>{item.title}</div>
                    </div>
                    <div className='flex cursor-pointer text-red-700 hover:text-green-700'>
                      <button type='button' className='font-bold text-[1.2rem] mr-1'>Xem thêm</button>
                      <FaPlus className='text-[1rem] mt-[0.45rem]' />
                    </div>
                  </div>
                </Link>
            ))}    
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromotionPage