import React from 'react'
// thư viện Image
import Image from 'next/image'
import anhBia from '@/assets/png/promotion.jpg'
import Clock from '@/assets/svg/clock.svg'
import Plus from '@/assets/svg/plus.svg'
import { PostRes } from '@/interfaces/model'
import { useRouter } from 'next/navigation'

const Post = (props: { data: PostRes }) => {
  const route = useRouter();
  const handleClickDetail = () => {
    route.push(`/promotion/${props.data.id}`)
  }
  return (
    <div className="h-[30rem] flex flex-col items-start justify-center mb-4 border border-gray-300">
      {
        props.data.image? <Image className="object-contain overflow-hidden text-ellipsis" src={props.data.image} alt="Ảnh sản phẩm" width={404} height={200}/>:
        <Image className="object-contain overflow-hidden text-ellipsis" src={anhBia} alt="Ảnh sản phẩm" width={404} height={200}/>
      }
        <div className='h-fit w-[40rem] px-[1.6rem] py-[1.6rem] flex flex-col items-start justify-center cursor-pointer'>
          <div className='h-fit pb-8 mb-2 border-b-[0.05rem] border-gray-300 cursor-pointer'>
            <div className='flex text-[1rem] gap-1'>
              <Clock className='my-1 h-4 w-4' />
              <div className=''>{props.data?.createAt.toString().split('T')[0]}</div>
            </div>
            <div className='text-[1.2rem] font-bold'>{props.data.title}</div>
          </div>
          <div className="sapo text-[0.9rem]" dangerouslySetInnerHTML={{ __html: props.data?.sapo || '' }}></div>
          <div className='flex cursor-pointer text-red-700 hover:text-green-700'>
            <button type='button' onClick={handleClickDetail} className='font-bold text-[1.2rem] mr-1'>Xem thêm</button>
            <Plus className='text-[1rem] mt-[0.45rem] h-4 w-4' />
          </div>    
        </div>
    </div>
  )
}

export default Post