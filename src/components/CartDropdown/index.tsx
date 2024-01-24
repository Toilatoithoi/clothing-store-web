import React from 'react'
import { HiOutlineShoppingBag } from "react-icons/hi";
import { useCart } from './hook';
import './style.scss';


const CartDropdown = () => {
  const { data } = useCart();
  console.log({ data })
  return (
    <div className='relative cart'>
      <div><HiOutlineShoppingBag /></div>
      <div className='cart-menu absolute border top-full right-0 w-[30rem] p-6 min-h-[40rem] bg-white border-black'>
        {
          data?.map(item => <div key={item.id} className='flex gap-2 text-[1rem]'>
            <div>{item.product.name}</div>
            <div>{item.size}</div>
            <div>{item.color}</div>
            <div>{item.quantity}</div>
          </div>)
        }
      </div>
    </div>
  )
}

export default CartDropdown