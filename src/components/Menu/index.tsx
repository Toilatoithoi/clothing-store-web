'use client'
import React from 'react'
import Menu1 from '@/assets/png/menu1.jpg'
import Menu2 from '@/assets/png/menu2.jpg'
import Menu3 from '@/assets/png/menu3.jpg'
import Menu4 from '@/assets/png/menu4.jpg'
import Menu5 from '@/assets/png/menu5.jpg'
import Image from 'next/image' // tương đương với img
import InputCount from '@/components/InputCount'
import { LiaShippingFastSolid } from "react-icons/lia"
import { MdPayments } from "react-icons/md"
import { BsBox } from "react-icons/bs"
import { Disclosure, Transition } from '@headlessui/react'
import { TiMinus } from 'react-icons/ti'
import { FaPlus } from 'react-icons/fa6'
// thư viện sử lí ảnh ở detail 
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery"
import "react-image-gallery/styles/css/image-gallery.css"
import { MdLocalShipping } from "react-icons/md";
import { FaCcAmazonPay } from "react-icons/fa";
import { RiVipFill } from "react-icons/ri";
import { FcDataRecovery } from "react-icons/fc";
import ProductSlider from '@/components/ProductSilder';
import './style.scss';


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
            <MdLocalShipping className='text-[4rem]' />
          </div>
          <div className='text-[1.2rem]'>
            <div className='font-bold'>Freeship</div>
            <div className='font-semibold'>Cho đơn hàng từ 500K</div>
          </div>
        </div>
        <div className="flex items-center justify-between pr-20 mr-4 border-r-2 border-gray-800">
          <div className='mr-6'>
            <FaCcAmazonPay className='text-[4rem]' />
          </div>
          <div className='text-[1.2rem]'>
            <div className='font-bold'>Thanh toán COD</div>
            <div className='font-semibold'>Nhận hàng & thanh toán</div>
          </div>
        </div>
        <div className="flex items-center justify-between pr-20 mr-4 border-r-2 border-gray-800">
          <div className='mr-6'>
            <RiVipFill className='text-[4rem]' />
          </div>
          <div className='text-[1.2rem]'>
            <div className='font-bold'>Nhiều ưu đãi</div>
            <div className='font-semibold'>Chiết khấu & quà tặng</div>
          </div>
        </div>
        <div className="flex items-center justify-between pr-20 mr-4 border-r-2 border-gray-800">
          <div className='mr-6'>
            <FcDataRecovery className='text-[4rem]' />
          </div>
          <div className='text-[1.2rem]'>
            <div className='font-bold'>Sửa đồ</div>
            <div className='font-semibold'>Hỗ trợ tận tâm</div>
          </div>
        </div>
      </div>
      {/* <div className='mb-[8rem]'>
        <div className='text-[2rem] font-bold mb-[2.4rem] flex items-center justify-center'>NHỮNG SẢN PHẨM NHIỀU NGƯỜI MUA</div>
        <div><ProductSlider /></div>
      </div>
      <div className='mb-[8rem] border-t-[0.05rem] border-gray-200 pt-[1.6rem]'>
        <div className='text-[2rem] font-bold mb-[2.4rem] flex items-center justify-center'>KHUYẾN MÃI HÔM NAY</div>
        <div><ProductSlider /></div>
      </div> */}
    </div>
  )
}

export default Menu