import React from 'react'
import product from '@/assets/png/product-1.jpg';
import Image from 'next/image';

const ProductCard = () => {
  return (
    <div className='h-fit'>
      <Image className='aspect-[290/386] max-w-sm' src={product} alt="" />
      <div className='text-[1.6rem]'>Áo khoác nam ADLTK402</div>
      <div className='text-[1.6rem]'>789.000 VND</div>
    </div>
  )
}

export default ProductCard