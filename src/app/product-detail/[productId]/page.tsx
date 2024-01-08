'use client'
import React from 'react';
import { FaMinus, FaPlus, FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import ProductImage from "@/assets/png/product-1.jpg"
import Image from 'next/image'; // tương đương với thẻ img
import InputCount from '@/components/InputCount';
import { LiaShippingFastSolid } from "react-icons/lia";
import { MdOutlinePayments } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { Disclosure, Transition } from '@headlessui/react';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import ProductSlider from '@/components/ProductSilder';

const images = [
  {
    original: ProductImage.src,
    thumbnail: ProductImage.src,
  },
  {
    original: ProductImage.src,
    thumbnail: ProductImage.src,
  },
  {
    original: ProductImage.src,
    thumbnail: ProductImage.src,
  },
  {
    original: ProductImage.src,
    thumbnail: ProductImage.src,
  },
  {
    original: ProductImage.src,
    thumbnail: ProductImage.src,
  },
  {
    original: ProductImage.src,
    thumbnail: ProductImage.src,
  },
  {
    original: ProductImage.src,
    thumbnail: ProductImage.src,
  },
  {
    original: ProductImage.src,
    thumbnail: ProductImage.src,
  },

];

const ProductDetailPage = (props: { params: { productId: string; } }) => {
  // query data của product băng id -> render data lên 
  return (
    <div className='w-full  h-full flex-1'>
      <div className='flex gap-[0.8rem]  p-[1.2rem] items-center'>
        <a className='text-[1.6rem] text-gray-500' href="">Trang chủ</a>/
        <a className='text-[1.6rem] text-gray-500' href="">Set đồ</a>/
        <a className='text-[1.6rem] text-gray-500' href="">Set đô nỉ</a>
      </div>
      <div className='flex mb-[8rem]'>
        <div className='flex-1 max-w-[60%] mr-[2.4rem]' ><ImageGallery items={images} thumbnailPosition="left" /></div>
        <div className='flex flex-col flex-1 p-[1.6rem]'>
          <div className='border-dashed border-b border-[#6d6d6d1a]'>
            <div className='text-[2.7rem]'>Áo polo nam POTTK442</div>
            <div className='flex mb-[1.6rem]'>
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaRegStar className="text-yellow-500" />
            </div>
            <div className='text-[2.4rem] font-semibold'>419.000 VND</div>
          </div>
          <div className='flex items-center py-[0.8rem]'>
            <div className="text-[1.6rem] font-semibold mr-[1.6rem]">Màu sắc</div>
            <div className='mr-4 rounded-[0.4rem] cursor-pointer border border-gray-400 hover:border-gray-600'>
              <Image src={ProductImage} className='w-[3rem] h-[3rem] object-contain' width={30} height={30} alt={'size'} objectFit='cover' />
            </div>
            <div className='mr-4 rounded-[0.4rem] cursor-pointer border border-gray-400 hover:border-gray-600'>              <Image src={ProductImage} className='w-[3rem] h-[3rem] object-contain' width={30} height={30} alt={'size'} objectFit='cover' />
            </div>
            <div className='mr-4 rounded-[0.4rem] cursor-pointer border border-gray-400 hover:border-gray-600'>              <Image src={ProductImage} className='w-[3rem] h-[3rem] object-contain' width={30} height={30} alt={'size'} objectFit='cover' />
            </div>
          </div>
          <div className='flex items-center py-[0.8rem]'>
            <div className="text-[1.6rem] font-semibold mr-[1.6rem]">Cỡ</div>
            <div className='mr-4 rounded-[0.4rem] w-[3rem] h-[3rem] flex items-center justify-center cursor-pointer border border-gray-400 hover:border-gray-600'>S</div>
            <div className='mr-4 rounded-[0.4rem] w-[3rem] h-[3rem] flex items-center justify-center cursor-pointer border border-gray-400 hover:border-gray-600'>M</div>
            <div className='mr-4 rounded-[0.4rem] w-[3rem] h-[3rem] flex items-center justify-center cursor-pointer border border-gray-400 hover:border-gray-600'>L</div>
            <div className='mr-4 rounded-[0.4rem] w-[3rem] h-[3rem] flex items-center justify-center cursor-pointer border border-gray-400 hover:border-gray-600'>XL</div>
          </div>
          <div className='text-[#bc0516] text-[1.6rem] py-[0.8rem] cursor-pointer'>Hướng dẫn kích thước</div>
          <div className='flex items-center'>
            <div className="text-[1.6rem] font-semibold mr-[1.6rem]">Số lượng</div>
            <div><InputCount /></div>
          </div>
          <div className='flex items-center py-[0.8rem]'>
            <button className='h-[4rem] flex items-center justify-center tex-[1.6rem] font-bold text-white uppercase bg-[#bc0516] flex-[2] mr-[1.6rem]' type='button'>Thêm vào giỏ hàng</button>
            <button className='h-[4rem] flex items-center justify-center tex-[1.6rem] font-bold text-white uppercase bg-[#bc0516] flex-1' type='button'>Mua ngay</button>
          </div>
          <div className='bg-[#F7F8FA] p-[1.6rem]'>
            <div className='flex items-center mb-[0.8rem]'>
              <div className='mr-[0.8rem]'><LiaShippingFastSolid /></div>
              <div><strong>Miễn phí vận chuyển</strong> (Tìm hiểu thêm)</div>
            </div>
            <div className='flex items-center mb-[0.8rem]'>
              <div className='mr-[0.8rem]'><MdOutlinePayments /></div>
              <div><strong>Thanh toán ngay hoặc COD</strong> (Tìm hiểu thêm)</div>
            </div>
            <div className='flex items-center mb-[0.8rem]'>
              <div className='mr-[0.8rem]'><BsBoxSeam /></div>
              <div><strong>
                Chính sách đổi trả</strong> (Tìm hiểu thêm)</div>
            </div>
          </div>

          <div><Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="flex justify-between w-full items-center p-3"
                >

                  <div className={`text-[2rem] font-bold ${open ? 'text-[#bc0516]' : ''}`}>Chi tiết sản phẩm</div>
                  <div>{!open ? <FaPlus /> : <FaMinus className="text-[#bc0516]" />}</div>
                </Disclosure.Button>
                <Transition
                  show={open}
                  enter="transition duration-100 ease-out  "
                  enterFrom="transform  opacity-0"
                  enterTo="transform opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform opacity-100 "
                  leaveTo="transform  opacity-0"
                >

                  <Disclosure.Panel
                    static
                  >
                    <div className='flex flex-col p-2 gap-2  max-h-[40rem] overflow-y-auto'>
                      <div>Chất liệu: Pique</div>
                      <div>Form      : Regular</div>
                      <div>Đặc tính :</div>
                      <div>Màu        : Đen, Trắng, Be</div>
                      <div>Size        : M-XL</div>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure></div>
        </div>
      </div>

      <div className='mb-[8rem]'>
        <div className='text-[2rem] font-bold mb-[2.4rem]'>Sản phẩm đã xem</div>
        <div><ProductSlider /></div>
      </div>
      <div className='mb-[8rem] border-t-[0.05rem] border-gray-200 pt-[1.6rem]'>
        <div className='text-[2rem] font-bold mb-[2.4rem]'>Sản phẩm cùng danh mục</div>
        <div><ProductSlider /></div>
      </div>
    </div>
  )
}

export default ProductDetailPage