import React, { useEffect, useState } from 'react'
import { HiOutlineShoppingBag } from "react-icons/hi";
import { useCart } from './hook';
import './style.scss';
import Image, { StaticImageData } from 'next/image'


const CartDropdown = () => {
  const { data } = useCart();
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (data && data.length > 0) {
      const totalPrice = data.reduce((acc, item) => acc + item.quantity * item.price, 0);
      setTotal(totalPrice);
    }
  }, [data])

  console.log({ data })
  return (
    <div className='relative cart'>
      <div><HiOutlineShoppingBag /></div>
      <div className='cart-menu absolute border top-full right-0 w-[30rem] p-6 min-h-[40rem] bg-white border-black'>
        {
          total > 0 ? data?.map(item => <div key={item.id} className='flex gap-2 text-[1rem] pb-2 border-b-2 border-gray-300'>
            <div>
              <Image className={`object-contain mr-[1rem] cursor-pointer`} src={item.image} alt={''} width={50} height={50}/>
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
                <div className='text-gray-400'>{item.price}</div>
              </div>
            </div>   
          </div>
          )
        : <div className='text-[1.4rem] text-center'> Chưa có sản phẩm nào </div>} 
        <div>
          {total > 0 && (
            <div className='text-center text-[1.6rem] font-[700] border-b-2 border-gray-300 pb-2'>
              <div>Tổng cộng: {total} VND</div>
            </div>
          )}
          {total > 0 && (
            <div className='flex items-center justify-center pt-4 mb-6'>
              <button className='w-[25rem] flex items-center justify-center text-[1.6rem] font-bold p-4 text-white uppercase bg-[#bc0516] cursor-pointer ' type='button'>
                Xem giỏ hàng
              </button>
            </div>
          )}
           {total > 0 && (
            <div className='flex items-center justify-center'>
              <button className='w-[25rem] flex items-center justify-center text-[1.6rem] font-bold p-4 uppercase bg-white cursor-pointer border-2 border-gray-300' type='button'>
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