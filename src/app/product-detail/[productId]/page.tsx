'use client'
import React, { useEffect, useRef, useState } from 'react';
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
import { useSWRWrapper } from '@/store/custom';
import { ProductDetail, ProductModel } from '@/interfaces/model';
import { formatNumber } from '@/utils';
import { useCart } from '@/components/CartDropdown/hook';

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

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<Record<string, ProductModel>>({});
  const MapSizeColorToModel = useRef<Record<string, ProductModel>>({})
  const { addToCart } = useCart()
  const { data: product } = useSWRWrapper<ProductDetail>(`/api/product/${props.params.productId}`, {
    url: `/api/product/${props.params.productId}`
  })

  useEffect(() => {
    if (product) {
      const sizes: string[] = [];
      const colors: Record<string, ProductModel> = {};

      product?.product_model.forEach(model => {
        if (!sizes.includes(model.size)) { // kiểm tra size đã có trong list chưa
          sizes.push(model.size);
        }
        if (!colors[model.color]) {
          colors[model.color] = model;
        }
        MapSizeColorToModel.current[model.size + model.color] = model;
      })

      setSizes(sizes);
      setColors(colors);
      setSelectedSize(product?.product_model[0]?.size ?? '');
      setSelectedColor(product?.product_model[0]?.color ?? '')
    }
  }, [product])

  const handleAddCart = () => {
    const selectedModel = MapSizeColorToModel.current[selectedSize + selectedColor] ?? product?.product_model[0];
    addToCart({
      ...selectedModel,
      quantity: 1,
      product: product!,
    })
  }


  console.log({ sizes, MapSizeColorToModel: MapSizeColorToModel.current })
  const selectedModel = MapSizeColorToModel.current[selectedSize + selectedColor] ?? product?.product_model[0];
  return (
    <div className='w-full  h-full flex-1'>
      <div className='flex gap-[0.8rem]  p-[1.2rem] items-center'>
        <a className='text-[1.6rem] text-gray-500' href="">Trang chủ</a>/
        <a className='text-[1.6rem] text-gray-500' href="">{product?.category?.name}</a>/
      </div>
      <div className='flex mb-[8rem]'>
        <div className='flex-1 max-w-[60%] mr-[2.4rem]' ><ImageGallery items={images} thumbnailPosition="left" /></div>
        <div className='flex flex-col flex-1 p-[1.6rem]'>
          <div className='border-dashed border-b border-[#6d6d6d1a]'>
            <div className='text-[2.7rem]'>{product?.name}</div>
            <div className='flex mb-[1.6rem]'>
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaRegStar className="text-yellow-500" />
            </div>
            <div className="flex text-[1.6rem] items-center" >
              <span className='mr-1'>Tình trạng:</span> <strong className='text-green-600'>{`${selectedModel?.stock} sản phẩm sẵn có`}</strong>
            </div>
            <div className='text-[2.4rem] font-semibold'>{formatNumber(selectedModel?.price)} VND</div>
          </div>
          <div className='flex items-center py-[0.8rem]'>
            <div className="text-[1.6rem] font-semibold mr-[1.6rem]">Màu sắc</div>
            {
              Object.keys(colors).map(key =>
                <div
                  key={key}
                  onClick={() => {
                    setSelectedColor(key)
                  }}
                  className={`mr-4 rounded-[0.4rem] cursor-pointer border border-gray-400 hover:border-gray-600 ${selectedColor === key ? 'border-gray-600 border-[2px]' : ''}`}>
                  <Image src={colors[key].image} className='w-[3rem] h-[3rem] object-contain' width={30} height={30} alt={'size'} objectFit='cover' />
                </div>)
            }

          </div>
          <div className='flex items-center py-[0.8rem]'>
            <div className="text-[1.6rem] font-semibold mr-[1.6rem]">Cỡ</div>
            {sizes.map(size => <div className={`mr-4 rounded-[0.4rem] w-[3rem] h-[3rem] flex items-center justify-center cursor-pointer border border-gray-400 hover:border-gray-600 ${selectedSize === size ? 'border-gray-600 border-[2px]' : ''}`}
              onClick={() => setSelectedSize(size)}
              key={size}>{size}</div>
            )}

          </div>
          <div className='text-[#bc0516] text-[1.6rem] py-[0.8rem] cursor-pointer'>Hướng dẫn kích thước</div>
          <div className='flex items-center'>
            <div className="text-[1.6rem] font-semibold mr-[1.6rem]">Số lượng</div>
            <div><InputCount /></div>
          </div>
          <div className='flex items-center py-[0.8rem]'>
            <button onClick={handleAddCart} className='h-[4rem] flex items-center justify-center tex-[1.6rem] font-bold text-white uppercase bg-[#bc0516] flex-[2] mr-[1.6rem]' type='button'>Thêm vào giỏ hàng</button>
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
                    <div className='flex flex-col p-2 gap-2  max-h-[40rem] overflow-y-auto' dangerouslySetInnerHTML={{ __html: product?.description ?? '' }}>

                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure></div>
        </div>
      </div>

      {/* <div className='mb-[8rem]'>
        <div className='text-[2rem] font-bold mb-[2.4rem]'>Sản phẩm đã xem</div>
        <div><ProductSlider /></div>
      </div>
      <div className='mb-[8rem] border-t-[0.05rem] border-gray-200 pt-[1.6rem]'>
        <div className='text-[2rem] font-bold mb-[2.4rem]'>Sản phẩm cùng danh mục</div>
        <div><ProductSlider /></div>
      </div> */}
    </div>
  )
}

export default ProductDetailPage