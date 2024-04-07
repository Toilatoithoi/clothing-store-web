'use client'
import React, { useEffect, useState } from 'react'
import Menu1 from '@/assets/png/menu1.jpg'
import Menu2 from '@/assets/png/menu2.jpg'
import Menu3 from '@/assets/png/menu3.jpg'
import Menu4 from '@/assets/png/menu4.jpg'
import Menu5 from '@/assets/png/menu5.jpg'
import Image from 'next/image' // tương đương với img
// import InputCount from '@/components/InputCount'
// import { LiaShippingFastSolid } from "react-icons/lia"
// import { MdPayments } from "react-icons/md"
// import { BsBox } from "react-icons/bs"
// import { Disclosure, Transition } from '@headlessui/react'
// import { TiMinus } from 'react-icons/ti'
// import { FaPlus } from 'react-icons/fa6'
// thư viện sử lí ảnh ở detail 
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery"
import "react-image-gallery/styles/css/image-gallery.css"
import Truck from "@/assets/svg/truck.svg";
// import { FaCcAmazonPay } from "react-icons/fa";
import Gift from "@/assets/svg/gift.svg";
import Refresh from "@/assets/svg/refresh-ccw.svg";
import ProductSlider from '@/components/ProductSilder';
import './style.scss';
import { useSWRWrapper } from '@/store/custom'
import { PaginationRes } from '@/interfaces'
import { ProductRes } from '@/interfaces/model'
import { SORT_TYPE } from '@/constants'
import { mutate } from 'swr'


const images: ReactImageGalleryItem[] = [
  {
    original: Menu1.src,
    sizes: '50rem'
  },
  {
    original: Menu2.src,
    sizes: '50rem'
  },
  {
    original: Menu3.src,
    sizes: '50rem'

  },
  {
    original: Menu4.src,
    sizes: '50rem'

  },
  {
    original: Menu5.src,
    sizes: '50rem'

  },
];

// do detail sẽ dùng chung cho mọi sản phẩm 
// mỗi sản phẩm đấy phải phân biệt bởi productId (kiểu dùng này là dynamic router)
// props là thuộc tính từ lớp cha truyền cho lớp con
export const Menu = () => {
  const [filter, setFilter] = useState({
    price: {
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
    },
  })

  const { data: dataProductPrice } = useSWRWrapper<PaginationRes<ProductRes>>(`/api/product?orderBy=${SORT_TYPE.PRICE_DESC}}`, {
    url: '/api/product',
    params: {
      fetchCount: 8,
      page: 1,
      orderBy: SORT_TYPE.PRICE_DESC,
      priceMin: filter.price.min,
      priceMax: filter.price.max,
    }
  })

  const { data: dataProducCreatAt } = useSWRWrapper<PaginationRes<ProductRes>>(`/api/product?orderBy=${SORT_TYPE.TIME}${JSON.stringify(filter)}`, {
    url: '/api/product',
    params: {
      fetchCount: 8,
      page: 1,
      orderBy: SORT_TYPE.TIME,
      priceMin: filter.price.min,
      priceMax: filter.price.max,
      isList: true,
    }
  })

  useEffect(() => {
    mutate(`/api/product?orderBy=${SORT_TYPE.PRICE_DESC}${JSON.stringify(filter)}`)
  }, []);

  useEffect(() => {
    mutate(`/api/product?orderBy=${SORT_TYPE.TIME}${JSON.stringify(filter)}`)
  }, []);
  // query data của product theo id
  // render data lên
  return (
    <div className="w-full h-full flex-1 menu-page z-0">
      <div className="flex mb-[2rem]">
        <div className="flex-1 max-w-[100%] mr-[2.4rem]"><ImageGallery items={images} showBullets={true} /></div>
      </div>
      <div className="flex items-center justify-center pb-8 border-b-2 border-gray-500 mb-8">
        <div className="flex items-center justify-between pr-20 mr-4 border-r-2 border-gray-800">
          <div className='mr-6'>
            <Truck className='text-[4rem]' />
          </div>
          <div className='text-[1.2rem]'>
            <div className='font-bold'>Freeship</div>
            <div className='font-semibold'>Cho đơn hàng từ 500K</div>
          </div>
        </div>
        {/* <div className="flex items-center justify-between pr-20 mr-4 border-r-2 border-gray-800">
          <div className='mr-6'>
            <FaCcAmazonPay className='text-[4rem]' />
          </div>
          <div className='text-[1.2rem]'>
            <div className='font-bold'>Thanh toán COD</div>
            <div className='font-semibold'>Nhận hàng & thanh toán</div>
          </div>
        </div> */}
        <div className="flex items-center justify-between pr-20 mr-4 border-r-2 border-gray-800">
          <div className='mr-6'>
            <Gift className='text-[4rem]' />
          </div>
          <div className='text-[1.2rem]'>
            <div className='font-bold'>Nhiều ưu đãi</div>
            <div className='font-semibold'>Chiết khấu & quà tặng</div>
          </div>
        </div>
        <div className="flex items-center justify-between pr-20 mr-4">
          <div className='mr-6'>
            <Refresh className='text-[4rem]' />
          </div>
          <div className='text-[1.2rem]'>
            <div className='font-bold'>Sửa đồ</div>
            <div className='font-semibold'>Hỗ trợ tận tâm</div>
          </div>
        </div>
      </div>
      <div className='mb-[8rem]'>
        <div className='text-[2rem] font-bold mb-[2.4rem] flex items-center justify-center'>NHỮNG SẢN PHẨM GIÁ CAO NHẤT</div>
        <div>{
          dataProductPrice && (
            <ProductSlider data={dataProductPrice?.items}/>
          )
        }</div>
      </div>
      <div className='mb-[8rem] border-t-[0.05rem] border-gray-200 pt-[1.6rem]'>
        <div className='text-[2rem] font-bold mb-[2.4rem] flex items-center justify-center'>NHỮNG SẢN PHẨM MỚI NHẤT</div>
        {
          dataProducCreatAt && (
            <ProductSlider data={dataProducCreatAt?.items}/>
          )
        }
      </div>
    </div>
  )
}

export default Menu