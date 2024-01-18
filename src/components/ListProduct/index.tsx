'use client'
import React from 'react'
import SideBar from '../Sidebar'
import ProductCard from '../ProductCard'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
const ListProduct = () => {
  const { data } = useSWR('/api/product', fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
  });

  console.log({ data })

  return (
    <>

      <div className='h-[6rem] flex items-center text-gray-400 text-[1.6rem]'>
        <span className='hover:text-gray-600 cursor-pointer'>Trang chủ</span>
        <span className='mx-2'>/</span>
        <span className='hover:text-gray-600 cursor-pointer'>áo nam</span>
      </div>


      <div className='h-[4rem] mb-[1.5rem] flex justify-between items-center bg-slate-100 px-4'>
        <div>Tổng 35 sản phẩm </div>
        <div className='flex'>
          <div className='mr-4'>Sắp xếp theo</div>
          <div>
            <select>
              <option>
                Theo mức độ phổ biến
              </option>
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
        <div className='flex-1 flex gap-5 flex-wrap items-start'>
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </>
  )
}

export default ListProduct