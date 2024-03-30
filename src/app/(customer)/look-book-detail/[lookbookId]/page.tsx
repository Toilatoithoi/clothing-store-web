'use client'
import Video from '@/components/Video';
import { LookBookRes } from '@/interfaces/model';
import { useSWRWrapper } from '@/store/custom';
import Link from 'next/link';
import React, { useEffect } from 'react'

const LookBookDetail = (props: { params: { lookBookId: string; } }) => {
    const { data: lookbookDetail } = useSWRWrapper<LookBookRes>(`/api/lookbook/${props.params.lookBookId}`, {
        url: `/api/lookbook/${props.params.lookBookId}`,
    })
    console.log(lookbookDetail)
    return (
        <div>
            <div className='h-[4.5rem] w-full'>
                <div className='max-w-screen-xl m-auto h-full px-[2rem] items-center flex gap-[0.4rem] font-thin text-[1.2rem]'>
                    <div className='text-gray-500 hover:text-gray-800'><Link href={'/'}>Trang chủ</Link></div>
                    <div className='text-gray-500'>/</div>
                    <div className='text-gray-500 hover:text-gray-800'><Link href={'/look-book'}>LookBook</Link></div>
                    <div className='text-gray-500'>/</div>
                    <div className='text-gray-500'> {lookbookDetail?.title}</div>
                </div>
            </div>
            <div>
                <div className='h-[44.5rem] pl-8 flex mb-5'>
                    <div className='flex-1'>
                        <Video url={`${lookbookDetail?.url}`} />
                    </div>
                    <div className='content bg-[#f7f8fa] h-[44.5rem] w-[60rem] px-[1.6rem] py-[1.6rem] flex flex-col items-start justify-center cursor-pointer'>
                        <div className='h-fit pb-4 mb-4 border-b-[0.05rem] border-gray-300 cursor-pointer'>
                            <div className='text-[1.8rem] font-bold'>{lookbookDetail?.title}</div>
                        </div>
                        {/* <div className='text-[1rem] font-medium mb-6 cursor-pointer'>
                          Mùa lễ Giáng sinh đã rất cận kề, tín đồ thời trang hẳn không thể bỏ lỡ các gam màu đặc trưng của mùa lễ hội, 360® tung ra BST đậm màu sắc Noel, mở ra một bữa tiệc cuối năm trọn vị cảm xúc.
                      </div>
                      <div className='text-[1rem] font-medium mb-6 cursor-pointer'>
                          Sự kết hợp giữa những gam màu: xanh, đỏ cơ bản của mùa lễ với những tone màu nâu, be ấm áp khiến cho không khí Giáng sinh vẫn tưng bừng mà không bị quá rực rỡ cho những chàng trai hiện đại.
                             Trên nền các chất liệu vải cao cấp như: dạ ép, nỉ cào bông, pique, texture,… những chiếc áo khoác, blazer, hoodie ra đời vừa mang phong cách trẻ trung lại vẫn giữ nguyên nét chỉn chu, lịch sự.
                      </div>
                      <div className='text-[1rem] font-medium mb-6 cursor-pointer'>
                      Tận hưởng mùa lễ hội bằng những thiết kế trending trong BST Giáng sinh mới nhất từ 360®. Hãy sở hữu ngay những items này để chiếm trọn spotlight mùa lễ hội bạn nhé!
                      </div>     */}
                        <div className="content text-[1rem] font-medium mb-6 cursor-pointer" dangerouslySetInnerHTML={{ __html: lookbookDetail?.content || '' }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LookBookDetail