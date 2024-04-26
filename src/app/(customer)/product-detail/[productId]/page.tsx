'use client'
import React, { useEffect, useRef, useState } from 'react';
import Plus from "@/assets/svg/plus.svg";
import Minus from '@/assets/svg/minus.svg'
// import { FaRegStar } from "react-icons/fa";
import ProductImage from "@/assets/png/product-1.jpg"
import Image from 'next/image'; // tương đương với thẻ img
import InputCount from '@/components/InputCount';
import Gift from "@/assets/svg/gift.svg";
// import Cast  from "@/assets/svg/cast.svg";
import Box from "@/assets/svg/box.svg";
import { Disclosure, Transition } from '@headlessui/react';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
// import ProductSlider from '@/components/ProductSilder';
import { useSWRWrapper } from '@/store/custom';
import { ProductDetail, ProductModel } from '@/interfaces/model';
import { formatNumber, isBlank } from '@/utils';
import { useCart } from '@/components/CartDropdown/hook';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'
import { useRouter } from 'next/navigation';
import { useAppStatus } from '@/store/globalSWR';
import Link from 'next/link';
import { mutate } from 'swr';

interface ImageProp {
  original: string,
  thumbnail: string
}

const ProductDetailPage = (props: { params: { productId: string; } }) => {
  // query data của product băng id -> render data lên 
  //  khi click sẽ set lại giá trị cho size
  const [selectedSize, setSelectedSize] = useState('');
  // khi click sẽ set lại giá trị cho color
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  // size là một mảng string
  const [sizes, setSizes] = useState<string[]>([]);
  // color là record kiểu ProductModel để có thể làm tìm kiếm theo màu sắc
  // có key là color string và value và product_model
  // cần lấy product_model để lấy được image để in ra màn hình
  const [colors, setColors] = useState<Record<string, ProductModel>>({});
  // MapSizeColorToModel có key là string và value là product_model
  // MapSizeColorToModel dùng để map size và color
  // key là size+màu và value là product_model tương ứng
  const MapSizeColorToModel = useRef<Record<string, ProductModel>>({})
  // trả về quantity và product_model
  // khi nào cần addToCart thì dùng useCart()
  const { addToCart } = useCart()
  const { data: appStatus } = useAppStatus();
  // lấy thông tin sản phẩm từ api product-detail
  const { data: product } = useSWRWrapper<ProductDetail>(`/api/product/${props.params.productId}`, {
    url: `/api/product/${props.params.productId}`
  })
  console.log(product)

  // const images = [
  //   {
  //     original: ProductImage.src,
  //     thumbnail: ProductImage.src,
  //   },
  //   {
  //     original: ProductImage.src,
  //     thumbnail: ProductImage.src,
  //   },
  //   {
  //     original: ProductImage.src,
  //     thumbnail: ProductImage.src,
  //   },
  //   {
  //     original: ProductImage.src,
  //     thumbnail: ProductImage.src,
  //   },
  //   {
  //     original: ProductImage.src,
  //     thumbnail: ProductImage.src,
  //   },
  //   {
  //     original: ProductImage.src,
  //     thumbnail: ProductImage.src,
  //   },
  //   {
  //     original: ProductImage.src,
  //     thumbnail: ProductImage.src,
  //   },
  //   {
  //     original: ProductImage.src,
  //     thumbnail: ProductImage.src,
  //   },
  // ];
  const [imageValues, setImageValues] = useState<ImageProp[]>([])

  // điều hướng route
  const router = useRouter();

  // bắt sự thay đổi của product
  useEffect(() => {
    if (product) {
      const imageList: ImageProp[] = [];
      product.product_model.forEach((item) => {
        imageList.push({ original: item.image, thumbnail: item.image })
      })
      setImageValues(imageList)
      // 
      const sizes: string[] = [];
      // là một list các phần tử nên dùng object.key hay array vẫn giống nhau
      // khác nhau array còn phải for còn object chỉ cần key dùng cho tìm kiểm hiệu qua hơn
      const colors: Record<string, ProductModel> = {};

      product?.product_model.forEach(model => {
        if (!sizes.includes(model.size)) { // kiểm tra size đã có trong list chưa
          sizes.push(model.size);
        }
        if (!colors[model.color]) {        // kiểm tra color đã có trong list chưa
          colors[model.color] = model;
        }
        console.log({model})
        // chứa key là size + màu và vaule gán bằng model
        // vd: const colos = {'Xanh': {color:'xanh', size:'M'}}
        // value: {color: xanh, size: 'M} 
        // model là các product_model
        // do là useRef nên phải .current
        // khi gán thì dùng ngoặc ['key']
        MapSizeColorToModel.current[model.size + model.color] = model;
      })

      setSizes(sizes);
      setColors(colors);
      // lấy giá trị product_model size đầu tiên tìm được nếu không có trả về null
      setSelectedSize(product?.product_model[0]?.size ?? '');
      // lấy giá trị product_model color đầu tiên tìm được nếu không có trả về null
      setSelectedColor(product?.product_model[0]?.color ?? '')
    }
  }, [product])

  const handleAddCart = () => {
    let selectedModel;
    if (selectedSize && selectedColor) {
      selectedModel = MapSizeColorToModel.current[selectedSize + selectedColor] ?? product?.product_model[0];
    } else {
      if (selectedColor) {
        selectedModel = MapSizeColorToModel.current["null" + selectedColor] ?? product?.product_model[0];
      } else {
        selectedModel = MapSizeColorToModel.current[selectedSize + "null"] ?? product?.product_model[0];
      }
    }
    addToCart({
      // thêm vào chỉ lấy quantity và product_model_id
      // lý do dùng global state là để các compoment không phụ thuộc
      ...selectedModel,
      quantity,
      product: product!,
      product_model_id: selectedModel.id,
      // productName: ''
    })
    // sau khi thêm thành công sẽ set lại input là 1
    setQuantity(1);
  }
  const handleAddPayment = () => {
    let selectedModel;
    if (selectedSize && selectedColor) {
      selectedModel = MapSizeColorToModel.current[selectedSize + selectedColor] ?? product?.product_model[0];
    } else {
      if (selectedColor) {
        selectedModel = MapSizeColorToModel.current["null" + selectedColor] ?? product?.product_model[0];
      } else {
        selectedModel = MapSizeColorToModel.current[selectedSize + "null"] ?? product?.product_model[0];
      }
    }
    addToCart({
      // thêm vào chỉ lấy quantity và product_model_id
      // lý do dùng global state là để các compoment không phụ thuộc
      ...selectedModel,
      quantity,
      product: product!,
      product_model_id: selectedModel.id,
      // productName: ''
    })
    // sau khi thêm thành công sẽ set lại input là 1
    setQuantity(1);
    // nếu muốn ghi đè thì thêm / không nó sẽ hiển thị tiếp nối url hiện tại
    router.push('/payment')
  }
  console.log({ MapSizeColorToModel: MapSizeColorToModel.current })
  // chon product_model mong muốn bằng MapSizeColorToModel.current[key] lấy giá trị
  // mặc định khi render ban đầu sẽ hiển thị MapSizeColorToModel đầu tiên của product nếu không chọn
  // selectdModel là product_model chọn
  let selectedModel;
  if (selectedSize && selectedColor) {
    selectedModel = MapSizeColorToModel.current[selectedSize + selectedColor] ?? product?.product_model[0];
  } else {
    if(selectedColor){
      selectedModel = MapSizeColorToModel.current["null" + selectedColor] ?? product?.product_model[0];
    }else {
      selectedModel = MapSizeColorToModel.current[selectedSize + "null"] ?? product?.product_model[0];
    }
  }
  return (
    <div className='w-full  h-full flex-1'>
      <div className='flex gap-[0.8rem]  p-[1.2rem] items-center'>
        <Link className='text-[1.6rem] text-gray-500' href="/">Trang chủ</Link>/
        <a className='text-[1.6rem] text-gray-500' href="">{product?.category?.name}</a>/
      </div>
      <div className='flex mb-[8rem]'>
        <div className='flex-1 max-w-[60%] mr-[2.4rem]' ><ImageGallery items={imageValues} thumbnailPosition="left" /></div>
        <div className='flex flex-col flex-1 p-[1.6rem] '>
          <div className='border-dashed border-b border-[#6d6d6d1a]'>
            <div className='text-[2.7rem]'>{product?.name}</div>
            {/* <div className='flex mb-[1.6rem]'>
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaRegStar className="text-yellow-500" />
            </div> */}
            <div className="flex text-[1.6rem] items-center" >
              <span className='mr-1'>Tình trạng:</span> <strong className='text-green-600'>
                {selectedModel?.stock && selectedModel?.stock > 0 ? selectedModel?.stock + ' ' : 0 + ' '}
                sản phẩm sẵn có</strong>
            </div>
            <div className='text-[2.4rem] font-semibold'>{formatNumber(selectedModel?.price)} VND</div>
          </div>
          <div className='flex items-center py-[0.8rem]'>
            <div className="text-[1.6rem] font-semibold mr-[1.6rem]">Màu sắc</div>
            {
              // Object.key sẽ trả về các key của object
              // const color = {Xanh: "value1", key2: "value2"}
              // Object.keys(a) = {key1, key2}
              // lấy được key 
              Object.keys(colors).map(key =>
                <div
                  key={key}
                  // sự kiện khi click vào sẽ setSelectedColor
                  onClick={() => {
                    setSelectedColor(key)
                  }}
                  className={`mr-4 rounded-[0.4rem] cursor-pointer border border-gray-400 hover:border-gray-600 ${selectedColor === key ? 'border-gray-600 border-[2px]' : ''}`}>
                  {/* render ra image dùng colors[truyền key].thuộc tính muốn lấy giá trị */}
                  <a data-tooltip-id="my-tooltip" data-tooltip-content={colors[key].color}><Image src={colors[key].image} className='w-[3rem] h-[3rem] object-contain' width={30} height={30} alt={'size'} objectFit='cover' /></a>
                  <Tooltip id="my-tooltip" />
                </div>)
            }

          </div>
          <div className='flex items-center py-[0.8rem]'>
            {
              sizes[0] && (
                <div className="text-[1.6rem] font-semibold mr-[1.6rem]">Cỡ</div>
              )
            }
            {/* hiển thị danh sách màu sắc theo product */}
            {sizes[0] && sizes.map(size => <><a><div className={`mr-4 rounded-[0.4rem] w-[3rem] h-[3rem] flex items-center justify-center cursor-pointer border border-gray-400 hover:border-gray-600 ${selectedSize === size ? 'border-gray-600 border-[2px]' : ''}`}
              // sự kiện khi click vào sẽ setSelectedSize
              onClick={() => setSelectedSize(size)}
              key={size} data-tooltip-id="my-tooltip" data-tooltip-content={size}>{size}
            </div></a><Tooltip id="my-tooltip" /></>
            )}
          </div>
          {/* <div className='text-[#bc0516] text-[1.6rem] py-[0.8rem] cursor-pointer'>Hướng dẫn kích cỡ</div> */}
          <div className='flex items-center'>
            <div className="text-[1.6rem] font-semibold mr-[1.6rem]">Số lượng</div>

            <div><InputCount value={quantity} onChange={setQuantity} min={1} max={selectedModel?.stock} /></div>
          </div>
          <div className='flex items-center py-[0.8rem]'>
            {
              selectedModel?.stock && selectedModel?.stock > 0 && appStatus?.isAuthenticated ?
                <button onClick={handleAddCart} className='h-[4rem] flex items-center justify-center text-[1.6rem] font-bold text-white uppercase bg-[#bc0516] flex-[2] mr-[1.6rem]' type='button'>Thêm vào giỏ hàng</button>
                : <button disabled={true} className='h-[4rem] flex items-center justify-center text-[1.6rem] font-bold text-white uppercase bg-gray-300 flex-[2] mr-[1.6rem]' type='button'>Thêm vào giỏ hàng</button>
            }
            {
              selectedModel?.stock && selectedModel?.stock > 0 && appStatus?.isAuthenticated ?
                <button onClick={handleAddPayment} className='h-[4rem] flex items-center justify-center text-[1.6rem] font-bold text-white uppercase bg-[#bc0516] flex-1' type='button'>Mua ngay</button>
                : <button disabled={true} className='h-[4rem] flex items-center justify-center text-[1.6rem] font-bold text-white uppercase bg-gray-300 flex-1' type='button'>Mua ngay</button>
            }
            {/* <button onClick={handleAddCart} className='h-[4rem] flex items-center justify-center text-[1.6rem] font-bold text-white uppercase bg-[#bc0516] flex-[2] mr-[1.6rem]' type='button'>Thêm vào giỏ hàng</button> */}
            {/* <button onClick={handleAddPayment} className='h-[4rem] flex items-center justify-center text-[1.6rem] font-bold text-white uppercase bg-[#bc0516] flex-1' type='button'>Mua ngay</button> */}
          </div>
          <div className='bg-[#F7F8FA] p-[1.6rem]'>
            <div className='flex items-center mb-[0.8rem]'>
              <div className='mr-[0.8rem]'><Gift /></div>
              <div><strong>Miễn phí vận chuyển</strong><Link className="cursor-pointer hover:font-bold" href={'/promotion/9'}>(Tìm hiểu thêm)</Link></div>
            </div>
            {/* <div className='flex items-center mb-[0.8rem]'>
              <div className='mr-[0.8rem]'><Cast /></div>
              <div><strong>Thanh toán ngay hoặc COD</strong> (Tìm hiểu thêm)</div>
            </div> */}
            <div className='flex items-center mb-[0.8rem]'>
              <div className='mr-[0.8rem]'><Box /></div>
              <div><strong>
                Chính sách đổi trả</strong> <Link className="cursor-pointer hover:font-bold" href={'/promotion/10'}>(Tìm hiểu thêm)</Link></div>
            </div>
          </div>

          <div><Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="flex justify-between w-full items-center p-3"
                >

                  <div className={`text-[2rem] font-bold ${open ? 'text-[#bc0516]' : ''}`}>Chi tiết sản phẩm</div>
                  <div>{!open ? <Plus /> : <Minus className="text-[#bc0516]" />}</div>
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