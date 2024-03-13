import React from 'react'
// thư viện Image
import Image from 'next/image'
import anhBia2 from '@/assets/png/anhbai2.jpg'
import { LuClock4 } from 'react-icons/lu'
import { FaPlus } from 'react-icons/fa6'
import { PostRes } from '@/interfaces/model'
import { useRouter } from 'next/navigation'

const Post = (props: { data: PostRes }) => {
  const route = useRouter();
  const handleClickDetail = () => {
    route.push(`/promotion/${props.data.id}`)
  }
  return (
    <div className="h-fit flex flex-col items-start mb-4 border border-gray-300">
        <Image className="object-contain" src={props.data.image} alt="Ảnh sản phẩm" width={404} height={200}/>
        <div className='h-fit w-[40rem] px-[1.6rem] py-[1.6rem] flex flex-col items-start justify-center cursor-pointer'>
          <div className='h-fit pb-8 mb-2 border-b-[0.05rem] border-gray-300 cursor-pointer'>
            <div className='flex text-[1rem] gap-1'>
              <LuClock4 className='my-1' />
              <div className=''>{props.data.createAt.toString().split('T')[0]}</div>
            </div>
            <div className='text-[1.2rem] font-bold'>{props.data.title}</div>
          </div>
          <div className='flex cursor-pointer text-red-700 hover:text-green-700'>
            <button type='button' onClick={handleClickDetail} className='font-bold text-[1.2rem] mr-1'>Xem thêm</button>
            <FaPlus className='text-[1rem] mt-[0.45rem]' />
          </div>    
        </div>
    </div>
  )
}

export default Post