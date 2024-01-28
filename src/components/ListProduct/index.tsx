'use client'
import React from 'react'
import SideBar from '../Sidebar'
import ProductCard from '../ProductCard'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import { useSWRWrapper } from '@/store/custom'
import { ProductRes } from '@/interfaces/model'
import { PaginationRes } from '@/interfaces';
import { formatNumber } from '@/utils'


const ListProduct = (props: { categoryId?: string; }) => {
  // lấy dữ liệu danh sách product từ api 
  const { data } = useSWRWrapper<PaginationRes<ProductRes>>('/api/product', {
    url: '/api/product',
    params: {
      ...props.categoryId && { categoryId: props.categoryId }
    }
  })

  console.log({ data });

  return (
    <>

      <div className='h-[6rem] flex items-center text-gray-400 text-[1.6rem]'>
        <span className='hover:text-gray-600 cursor-pointer'>Trang chủ</span>
        <span className='mx-2'>/</span>
        <span className='hover:text-gray-600 cursor-pointer'>áo nam</span>
      </div>


      <div className='h-[4rem] mb-[1.5rem] flex justify-between items-center bg-slate-100 px-4'>
        {/* tính tổng số sản phẩm */}
        <div>{`Tổng ${formatNumber(data?.pagination.totalCount)} sản phẩm `}</div>
        <div className='flex'>
          <div className='mr-4'>Sắp xếp theo</div>
          <div>
            <select className='outline-none'>
              <option>
                Mới nhất
              </option>
              <option>
                Theo giá từ thấp đến cao
              </option>
              <option>
                Theo giá từ cao đến thấp
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className='flex flex-1 gap-[1.5rem]'>
        <SideBar />
        <div className='grid grid-cols-4 gap-5 h-fit'>
          {data?.items.map(item => <ProductCard data={item} key={item.id} />)}
        </div>
      </div>
    </>
  )
}

export default ListProduct

