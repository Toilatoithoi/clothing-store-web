import React, { useEffect, useState } from 'react'
import ShoppingCart  from "@/assets/svg/shopping-cart.svg";
import { useCart } from './hook';
import './style.scss';
import Image, { StaticImageData } from 'next/image'
import { formatNumber } from '@/utils';
import { useRouter } from 'next/navigation';


const CartDropdown = () => {
  const { data, mutate } = useCart();
  const [summary, setSummary] = useState({ totalPrice: 0, totalQuantity: 0 });

  // điều hướng route
  const router = useRouter();

  useEffect(() => {
    if (data && data.length > 0) {
      const summaryQty = data.reduce((acc, item) => ({
        totalPrice: acc.totalPrice + item.quantity * item.price,
        totalQuantity: acc.totalQuantity + item.quantity,
      }), { totalPrice: 0, totalQuantity: 0 });
      setSummary(summaryQty)
    }
  }, [data])

  const handleViewCartPage = () => {
    // nếu muốn ghi đè thì thêm / không nó sẽ hiển thị tiếp nối url hiện tại
    router.push('/user-cart')
  }
  const handleViewPaymentPage = () => {
    // nếu muốn ghi đè thì thêm / không nó sẽ hiển thị tiếp nối url hiện tại
    router.push('/payment')
  }

  // console.log({ data })
  return (
    <div className='relative cart'>
      <div className='relative'>
        <ShoppingCart />
        <div className='absolute font-bold translate-x-1/2 -translate-y-1/2 top-0 right-0 w-[1.8rem] h-[1.8rem] flex items-center justify-center bg-red-500 text-red-50  rounded-[50%] text-[1.2rem]'>
          {data?.length != 0 ? summary.totalQuantity ?? '0': '0'}
        </div>
      </div>
      <div className='cart-menu flex flex-col absolute border top-full right-0 w-[30rem] py-6  min-h-[40rem] bg-white border-black '>
        <div className='flex flex-col flex-1 max-h-[20rem] overflow-y-auto p-6'>
        {
          summary.totalPrice > 0  && data?.length != 0 ? data?.map(item => <div key={item.id} className='flex gap-2 text-[1rem] pb-2 border-b-2 border-gray-300'>
            <div>
              <Image className={`object-contain mr-[1rem] cursor-pointer`} src={item.image} alt={''} width={50} height={50} />
            </div>
            <div>
              <div className='font-[900]'>{item.product.name}</div>
              <div className='flex gap-2'>
                <div className='font-[600]'>{item.size}</div>
                <div className='font-[600]'>{item.color}</div>
              </div>
              <div className='flex'>
                <div className='text-gray-400'>{item.quantity}</div>
                <div className='text-gray-400'>X</div>
                <div className='text-gray-400'>{formatNumber(item.price)} VND</div>
              </div>
            </div>
          </div>
          )
            : <div className='text-[1.4rem] text-center'> Chưa có sản phẩm nào </div>}
        </div>
        <div className='mt-auto mb-3 p-6'>
          {summary.totalPrice > 0 && data?.length != 0 && (
            <div className='text-center text-[1.6rem] font-[700] border-b-2 border-gray-300 pb-2'>
              <div>Tổng cộng: {formatNumber(summary.totalPrice)} VND</div>
            </div>
          )}
          {summary.totalPrice > 0 && data?.length != 0 && (
            <div className='flex items-center justify-center pt-4 mb-6'>
              <button onClick={handleViewCartPage} className='w-[25rem] flex items-center justify-center text-[1.6rem] font-bold p-4 text-white uppercase bg-[#bc0516] cursor-pointer ' type='button'>
                Xem giỏ hàng
              </button>
            </div>
          )}
         {/* {summary.totalPrice > 0 && data?.length != 0 && (
            <div className='flex items-center justify-center pt-4 mb-6'>
              <div className='w-[25rem] flex items-center justify-center text-[1.6rem] font-bold p-4 text-white uppercase bg-[#bc0516] cursor-pointer '>
                Chưa có sản phẩm trong giỏ hàng
              </div>
            </div>
          )} */}
          {summary.totalPrice > 0 && data?.length != 0 && (
            <div className='flex items-center justify-center'>
              <button onClick={handleViewPaymentPage} className='w-[25rem] flex items-center justify-center text-[1.6rem] font-bold p-4 uppercase bg-white cursor-pointer border-2 border-gray-300' type='button'>
                Thanh toán
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartDropdown