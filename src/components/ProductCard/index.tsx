'use client'
import React from 'react'
import product from '@/assets/png/product-1.jpg';
import Image from 'next/image';
import { ProductRes } from '@/interfaces/model';
import { formatNumber } from '@/utils';
import { useRouter } from 'next/navigation';

const ProductCard = (props: { data: ProductRes }) => {
  // Sử dụng hook useRouter để lấy đối tượng router
  const route = useRouter();
  const handleClickDetail = () => {
    route.push(`/product-detail/${props.data.id}`)
  }
  // lấy giá trị price max
  const priceMin = props.data.price.priceMin;
  // lấY giá trị price min
  const priceMax = props.data.price.priceMax;
  // hàm formatNumber để thêm dấu , giữa số dài
  // nếu priceMin == priceMax thì sẽ in ra priceMax còn không thì in ra cả priceMin và priceMax
  const formatPrice = priceMin === priceMax ? `${formatNumber(priceMax)} VNĐ` : `${formatNumber(priceMin)} VNĐ - ${formatNumber(priceMax)} VNĐ`
  return (
    <div className='h-fit cursor-pointer' onClick={handleClickDetail}>
      {
        props.data.image ? <Image className='aspect-[290/386] max-w-sm' src={props.data.image} alt="" width={400} height={600} /> : <Image className='aspect-[290/386] max-w-sm' src={product} alt="" />
      }
      <div className='text-[1.6rem]'>{props.data.name ?? '' + ' ' + props.data.product_model?.size ?? '' + ' ' + props.data.product_model?.color ?? ''}</div>
      <div className='text-[1.6rem]'>{formatPrice}</div>
    </div>
  )
}

export default ProductCard