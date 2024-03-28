'use client'
import Promotion from '@/components/Promotion'
import { PostRes } from '@/interfaces/model'
import { PaginationRes } from '@/interfaces';
import { useSWRWrapper } from '@/store/custom'
import Link from 'next/link'
import Image from 'next/image'
import Clock from "@/assets/svg/clock.svg"
import React, { useEffect, useState } from 'react'
import Plus from '@/assets/svg/plus.svg'
import anhBia from '@/assets/png/promotion.jpg'
import { mutate } from 'swr';
import PostOnTop from '@/components/PostOnTop';
//page danh sách
// interface PromotionPageProps {
//   params: {
//     fetchCount: string;
//     page: string;
//   }
// }
const PromotionPage = () => {
  // const [fetchCount, setFetchCount] = useState(5);
  // const [page, setPage] = useState(1);
  // const { data: postData } = useSWRWrapper<PaginationRes<PostRes>>('/api/post/list', {
  //   url: '/api/post',
  //   params: {
  //     fetchCount: fetchCount,
  //     page: page,
  //   }
  // })
  // useEffect(() => {
  //     mutate('/api/post/list')
  // }, [page])
  // const handleValuePage = (values: number) =>{
  //   setPage(values)
  // }
  return (
    // <div className='mt-6'>
    //   <div className="w-full mb-[3rem]">
    //     <div className="flex w-full justify-center gap-[3.2rem]">
    //       {/* <div className="bg-[#f7f8fa] h-fit w-[20rem] p-[1rem] border border-gray-200">
    //         <div className='w-full p-[3rem] text-center border-b-2 mb-4 border-gray-950'>
    //           <div className="font-bold text-[1.8rem]">BÀI VIẾT MỚI</div>
    //         </div>   
    //         {
    //           postOnTop?.items.map((item, idx) => (
    //             <Link href={`/promotion/${item.id}`} key={idx}>
    //               <div className='flex gap-1 mb-4'>
    //                 {
    //                   item.image ? <Image className="object-contain mb-8" src={item.image} alt="Ảnh bìa" width={80} height={90} />
    //                   : <Image className='object-contain mb-8' src={anhBia} alt="Ảnh bìa" width={80} height={90} />
    //                 }    
    //                 <div>
    //                   <div className='flex'>
    //                     <Clock className='m-1 h-4 w-4' />
    //                     <div className='text-[1rem]'>
    //                       {item.createAt.toString().split('T')[0]}
    //                     </div>
    //                   </div>
    //                   <div className='text-[1rem] font-bold'>{item.title}</div>
    //                 </div>
    //               </div>
    //             </Link>
    //           ))
    //         }
    //       </div> */}
    //       <PostOnTop />
    //       {/* dùng grid chia làm 5 cột */}
    //       {/* box-sizing là tổng chiều dài của phần tử có tính thêm border, padding hay không */}
    //       {/* mã màu bg-[#f7f8fa] */}
    //       <div className="bg-[#f7f8fa] w-[70rem] h-fit">
    //         <div className='w-full p-[1rem] text-center border-b-2 mb-4 border-gray-300'>
    //           <div className="font-bold text-[2.6rem] text-red-500">Tin Tức</div>
    //         </div>
    //         {
    //           postData?.items.map((item, idx) => (
    //             <Link href={`/promotion/${item.id}`} key={idx} className='flex mb-5'>
    //               <div className=''>
    //                 {item.image ? 
    //                   <Image className="object-contain overflow-hidden" src={item.image} alt="Ảnh bìa" width={300} height={200}/>
    //                   : <Image className="object-contain overflow-hidden" src={anhBia} alt="Ảnh bìa" width={300} height={200}/>
    //                 }    
    //               </div>
    //               <div className='bg-[#f7f8fa] px-[1.6rem] flex flex-col items-start justify-start cursor-pointer overflow-hidden text-ellipsis w-[40rem]'>
    //                 <div className='h-fit pb-8 mb-2 border-b-[0.05rem] border-gray-300 cursor-pointer'>
    //                   <div className='text-[1.2rem] font-bold'>Tin tức</div>
    //                   <div className='flex text-[1rem] gap-1'>
    //                     <Clock className='my-1 w-4 h-4' />
    //                     <div className=''> {item.createAt.toString().split('T')[0]}</div>
    //                   </div>
    //                   <div className='text-[1.2rem] font-bold'>{item.title}</div>
    //                 </div>
    //                 <div className="sapo" dangerouslySetInnerHTML={{ __html: item.sapo || '' }}></div>
    //                 <div className='flex cursor-pointer text-red-700 hover:text-green-700'>
    //                   <button type='button' className='font-bold text-[1.2rem] mr-1'>Xem thêm</button>
    //                   <Plus className='text-[1rem] mt-[0.45rem] h-4 w-4' />
    //                 </div>
    //               </div>
    //             </Link>
    //         ))}
    //         <div className='flex items-center justify-center gap-4'>
    //           <select className='w-[5rem] flex items-end justify-end p-2 border-2 border-blue-600' onChange={(e) => handleValuePage(Number(e.target.value))}>
    //             {postData?.pagination.totalPage && Array.from({ length: postData.pagination.totalPage }, (_, index) => (
    //               <option className="text-center" key={index} value={index + 1}>{`${index + 1}`}</option>
    //             ))}
    //           </select>
    //           <div>/</div>
    //           <div>{postData?.pagination.totalPage}</div>
    //         </div>    
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <Promotion />
  )
}

export default PromotionPage