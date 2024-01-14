import React from 'react'
// thư viện Image
import Image from 'next/image'
import anhBia2 from '@/assets/png/anhbai2.jpg'
import { LuClock4 } from 'react-icons/lu'
import { FaPlus } from 'react-icons/fa6'

const Post = () => {
  return (
    <div className="h-fit flex flex-col items-start mb-4 border border-gray-300">
        <Image className="object-contain" src={anhBia2} alt="Ảnh sản phẩm" width={404}/>
        <div className='h-fit w-[40rem] px-[1.6rem] py-[1.6rem] flex flex-col items-start justify-center cursor-pointer'>
          <div className='h-fit pb-8 mb-2 border-b-[0.05rem] border-gray-300 cursor-pointer'>
            <div className='flex text-[1rem] gap-1'>
              <LuClock4 className='my-1' />
              <div className=''>20/12/2023</div>
            </div>
            <div className='text-[1.2rem] font-bold'>STAY COZY OUT THERE | SWEATER FOR WINTER FW 23/24</div>
          </div>
          <div className='text-[1rem] font-medium mb-6 cursor-pointer'>
            Vào những ngày trời nắng nhưng sáng sớm vẫn se lạnh sẽ thật thích hợp để diện áo len cùng quần kaki hoặc jeans. Khoác thêm áo dạ với gam...										
          </div>
          <div className='flex cursor-pointer text-red-700 hover:text-green-700'>
            <button type='button' className='font-bold text-[1.2rem] mr-1'>Xem thêm</button>
            <FaPlus className='text-[1rem] mt-[0.45rem]' />
          </div>    
        </div>
    </div>
  )
}

export default Post