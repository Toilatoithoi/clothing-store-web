'use client'
import React, { useEffect, useState } from 'react'
// import anhBia from '@/assets/png/promotion.jpg'
// import anhBia2 from '@/assets/png/anhbai2.jpg'
// import anhBia3 from '@/assets/png/anhbai3.jpg'
// import anhBia4 from '@/assets/png/anhbai4.jpg'
// import anhBia5 from '@/assets/png/anhbai5.jpg'
import Image from 'next/image'
import Clock from "@/assets/svg/clock.svg";
import { useParams, useRouter } from 'next/navigation'
import { useSWRWrapper } from '@/store/custom'
import anhBia from '@/assets/png/promotion.jpg'
import { PostRes } from '@/interfaces/model'
import Link from 'next/link'
import { PaginationRes } from '@/interfaces'
import PostOnTop from '../PostOnTop';
import Plus from '@/assets/svg/plus.svg'
import { mutate } from 'swr';
import { isBlank } from '@/utils';

const Promotion = (props: { promotionId?: string; }) => {
  // const [id, setId] = useState<string>('3'); // Sửa từ 'string | undefined' thành 'string'

  useEffect(() => {
    if (props.promotionId != null) {
      // setId(props.promotionId || '3');
    }
  }, [props.promotionId])

  const [fetchCount, setFetchCount] = useState(5);
  const [page, setPage] = useState(1);

  const { data: postDetail } = useSWRWrapper<PostRes>(`/api/post/${props.promotionId}`, {
    url: `/api/post/${props.promotionId}`,
  })

  const { data: postData } = useSWRWrapper<PaginationRes<PostRes>>('/api/post/list', {
    url: '/api/post',
    params: {
      fetchCount: fetchCount,
      page: page,
    }
  })

  // Sử dụng hook useRouter để lấy đối tượng router
  const route = useRouter();
  useEffect(() => {
    mutate('/api/post/list')
  }, [page])
  const handleValuePage = (values: number) => {
    setPage(values)
  }
  return (
    <div className='mt-6'>
      <div className="w-full">
        <div className="flex w-full justify-center gap-[3.2rem]">
          {/* <div className="bg-[#f7f8fa] h-fit w-[20rem] p-[1rem] border border-gray-200">
            <div className='w-full p-[3rem] text-center border-b-2 mb-4 border-gray-950'>
              <div className="font-bold text-[1.8rem]">BÀI VIẾT MỚI</div>
            </div>
            {
              postData?.items.map((item) => (
                <Link href={`/promotion/${item.id}`} key={item.id}>
                  <div className='flex gap-1 mb-4'>
                    {
                      item.image ? <Image className="object-contain mb-8" src={item.image} alt="Ảnh bìa" width={80} height={90} />
                      : <Image className="object-contain mb-8" src={anhBia} alt="Ảnh bìa" width={80} height={90} />
                    }
                    <div>
                      <div className='flex'>
                        <Clock className='m-1 text-[1rem] h-4 w-4' />
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
          </div> */}
          <PostOnTop />
          {/* dùng grid chia làm 5 cột */}
          {/* box-sizing là tổng chiều dài của phần tử có tính thêm border, padding hay không */}
          {/* mã màu bg-[#f7f8fa] */}
          <div className="bg-[#f7f8fa] w-[70rem] h-fit mb-4">
            {/* <div className="font-bold text-[1.8rem] mb-2">ENJOY CHRISMAS | MUA 1 TẶNG 1 toàn bộ hệ thống</div>
            <div className='mb-6 text-[1.2rem]'>20/12/2023</div>
            <Image className="object-contain mb-8" src={anhBia} alt="Ảnh bìa" width={700} />
            <div className='mb-6 text-[1.2rem]'>Mùa lễ hội đã tới, hệ thống thời trang nam 360®  gửi tới bạn chương trình ưu đãi lớn nhất mùa Noel này</div>
            <div className='mb-6 text-[1.2rem] flex'>
              <div>– MUA 1 TẶNG 1 hàng ngàn sản phẩm thu đông</div>
              <a className='text-red-500'>--{'>'} Link các sản phẩm tại đây</a>
            </div>
            <div className='mb-6 text-[1.2rem] flex'>
              <div>– Giảm đến 50% các sản phẩm áo khoác, áo nỉ, hoodie, quần dài, quần jeans </div>
              <a className='text-red-500'>--{'>'} Link các sản phẩm tại đây</a>
            </div>
            <div className='mb-6 text-[1.2rem] flex'>
              <div>– Đặc biệt một sản phẩm cực hot trong mùa lạnh, áo giữ nhiệt của nhà 360 nay có</div>
              <a className='text-red-500'>giá mới chỉ còn 199k</a>
            </div>
            <div className='mb-6 text-[1.2rem]'>
              <div>Số lượng có hạn, bạn hãy tới ngay các cửa hàng của 360® để mang về cho mình những sản phẩm vừa đẹp, vừa ấm lại có giá cực hời cho dịp cuối năm này.</div>
            </div>
            <div className='mb-10 text-[1.2rem]'>
              <div>Thời trang nam 360® chúc bạn có một mùa Giáng Sinh & đón năm mới ấm áp.</div>
            </div>
            <div className='text-[1.2rem]'>
              <div>————————</div>
            </div>
            <div className='text-[1.2rem]'>
              <div>360® – BE YOURSELF</div>
            </div>
            <div className='text-[1.2rem]'>
              <div>– Hotline: 1900 886 803 – 0973 285 886</div>
            </div> */}
            {
              !isBlank(props.promotionId) && postDetail ? 
                <>
                  <div className="font-bold text-[1.8rem] mb-2">{postDetail.title}</div>
                  <div className='mb-6 text-[1.2rem]'>{postDetail.createAt.split('T')[0]}</div>
                  <div className="content" dangerouslySetInnerHTML={{ __html: postDetail.content || '' }}></div>
                </>
              :
                <>
                  <div className='w-full p-[1rem] text-center border-b-2 mb-4 border-gray-300'>
                    <div className="font-bold text-[2.6rem] text-red-500">Tin Tức</div>
                  </div>
                  {
                    postData && postData.items.map((item, idx) => (
                      <Link href={`/promotion/${item.id}`} key={idx} className='flex mb-5'>
                        <div className=''>
                          {/* nếu bài viết k có ảnh thì sẽ lấy ảnh bìa */}
                          {item.image ?
                            <Image className="object-contain overflow-hidden" src={item.image} alt="Ảnh bìa" width={300} height={200} />
                            : <Image className="object-contain overflow-hidden" src={anhBia} alt="Ảnh bìa" width={300} height={200} />
                          }
                        </div>
                        <div className='bg-[#f7f8fa] px-[1.6rem] flex flex-col items-start justify-start cursor-pointer overflow-hidden text-ellipsis w-[40rem]'>
                          <div className='h-fit pb-8 mb-2 border-b-[0.05rem] border-gray-300 cursor-pointer'>
                            <div className='text-[1.2rem] font-bold'>Tin tức</div>
                            <div className='flex text-[1rem] gap-1'>
                              <Clock className='my-1 w-4 h-4' />
                              <div className=''> {item.createAt.toString().split('T')[0]}</div>
                            </div>
                            <div className='text-[1.2rem] font-bold'>{item.title}</div>
                          </div>
                          <div className="sapo text-[0.9rem]" dangerouslySetInnerHTML={{ __html: item.sapo || '' }}></div>
                          <div className='flex cursor-pointer text-red-700 hover:text-green-700'>
                            <button type='button' className='font-bold text-[1.2rem] mr-1'>Xem thêm</button>
                            <Plus className='text-[1rem] mt-[0.45rem] h-4 w-4' />
                          </div>
                        </div>
                      </Link>
                    ))}
                  <div className='flex items-center justify-center gap-4'>
                    <select className='w-[5rem] flex items-end justify-end p-2 border-2 border-blue-600' onChange={(e) => handleValuePage(Number(e.target.value))}>
                      {postData?.pagination.totalPage && Array.from({ length: postData.pagination.totalPage }, (_, index) => (
                        <option className="text-center" key={index} value={index + 1}>{`${index + 1}`}</option>
                      ))}
                    </select>
                    <div>/</div>
                    <div>{postData?.pagination.totalPage}</div>
                  </div>
                </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Promotion