import { PaginationRes } from '@/interfaces'
import { PostRes } from '@/interfaces/model'
import { useSWRWrapper } from '@/store/custom'
import Clock from "@/assets/svg/clock.svg"
import Image from 'next/image'
import anhBia from '@/assets/png/promotion.jpg'
import Link from 'next/link'
import React from 'react'


const PostOnTop = () => {
  const { data: postOnTop } = useSWRWrapper<PaginationRes<PostRes>>('/api/post/limit',{
        url: '/api/post',
        params: {
          limit: 5
        }
      })
  return (
      <div className="bg-[#f7f8fa] h-fit w-[20rem] p-[1rem] border border-gray-200">
          <div className='w-full p-[3rem] text-center border-b-2 mb-4 border-gray-950'>
              <div className="font-bold text-[1.8rem]">BÀI VIẾT MỚI</div>
          </div>
          {
              postOnTop?.items.map((item, idx) => (
                  <Link href={`/promotion/${item.id}`} key={idx}>
                      <div className='flex gap-1 mb-4'>
                          {
                              item.image ? <Image className="object-contain mb-8" src={item.image} alt="Ảnh bìa" width={80} height={90} />
                                  : <Image className='object-contain mb-8' src={anhBia} alt="Ảnh bìa" width={80} height={90} />
                          }
                          <div>
                              <div className='flex'>
                                  <Clock className='m-1 h-4 w-4' />
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
  )
}

export default PostOnTop