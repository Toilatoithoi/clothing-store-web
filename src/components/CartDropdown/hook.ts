import { METHOD } from '@/constants';
import { ProductDetail, ProductModel } from '@/interfaces/model';
import { useMutation, useSWRWrapper } from '@/store/custom';
import { useEffect, useState } from 'react';
import useSWR from 'swr'

export interface ProductCart extends ProductModel {
  product_model_id: number;
  quantity: number;
  product: ProductDetail
}
export const useCart = () => {
  const { data, mutate } = useSWRWrapper<ProductCart[]>('/api/cart', {
    url: '/api/cart',
    method: METHOD.GET
  });
  // gọi trigger khi cần update
  const { trigger } = useMutation<ProductCart[]>('/api/cart', {
    url: '/api/cart',
    method: METHOD.POST
  });
  const updateCart = (cart: ProductCart[]) => {
    mutate(cart)
  }





  const addToCart = (model: ProductCart) => {
    trigger({
      quantity: model.quantity,
      product_model_id: model.product_model_id
    })

  }

  return {
    data,
    updateCart,
    addToCart
  }
}

