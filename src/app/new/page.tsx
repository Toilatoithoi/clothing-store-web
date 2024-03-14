'use client'
import React from 'react'
import anhBia from '@/assets/png/promotion.jpg'
import Image from 'next/image'
import { LuClock4 } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";

import Post from '@/components/Post';
import Link from 'next/link';
import { useSWRWrapper } from '@/store/custom';
import { PostRes } from '@/interfaces/model';
import { useRouter } from 'next/navigation';
import { PaginationRes } from '@/interfaces';

const New = () => {
  const { data: postData } = useSWRWrapper<PaginationRes<PostRes>>('/api/post', {
    url: '/api/post',
  })
  const route = useRouter();
  const handleClickDetail = () => {
    route.push(`/promotion/4`)
  }

  return (
    <div>
      <div className='flex gap-1 text-gray-300 pl-8 h-[4rem] mb-4 items-center'>          
        <Link href={`/`}><div>Trang chủ</div></Link>
        <div>/</div>
        <div>Tin tức</div>
      </div>
      <div className='h-[44.5rem] pl-8 flex mb-5'>
        <div className='bg-[#f7f8fa] h-[44.5rem] w-[40rem] px-[1.6rem] py-[1.6rem] flex flex-col items-start justify-center cursor-pointer'>
          <div className='h-fit pb-8 mb-2 border-b-[0.05rem] border-gray-300 cursor-pointer'>
            <div className='flex text-[1rem] gap-1'>
              <LuClock4 className='my-1' />
              <div className=''>20/12/2023</div>
            </div>
            <div className='text-[1.2rem] font-bold'>ENJOY CHRISMAS | 2023 Holidays</div>
          </div>
          <div className='text-[1rem] font-medium mb-6 cursor-pointer'>
             Mùa lễ Giáng sinh đã rất cận kề, tín đồ thời trang hẳn không thể bỏ lỡ các gam màu đặc trưng của mùa lễ hội, 360® tung ra BST đậm màu sắc Noel, mở ra một bữa tiệc cuối năm trọn vị cảm xúc.					
          </div>
          <div className='flex cursor-pointer text-red-700 hover:text-green-700'>
            <button onClick={handleClickDetail} type='button' className='font-bold text-[1.2rem] mr-1'>Xem thêm</button>
            <FaPlus className='text-[1rem] mt-[0.45rem]' />
          </div>    
        </div>
        <div className=''>
          <Image className="object-contain overflow-hidden" src={anhBia} alt="Ảnh bìa" width={850} height={200}/>
        </div>
      </div>
      <div className='flex flex-1 pl-8 mb-8'>
        <div className="flex flex-1 gap-8 flex-wrap items-start">
          {
              postData?.items.map((item, idx) => (
                <Post data={item} key={item.id} />
              ))
            }    
        </div>
      </div>
      <div className='w-full flex items-center justify-center mb-14'>
        <button type='button' className='bg-red-700 text-white text-[1rem] text-center px-9 py-2 rounded-[1.5rem]'>Xem thêm</button>
      </div>
    </div>
  )
}

export default New