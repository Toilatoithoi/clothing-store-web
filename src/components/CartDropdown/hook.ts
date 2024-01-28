import { METHOD } from '@/constants';
import { ProductDetail, ProductModel } from '@/interfaces/model';
import { useSWRWrapper } from '@/store/custom';
import { useEffect, useState } from 'react';
import useSWR from 'swr'

export interface ProductCart extends ProductModel {
  id: number;
  quantity: number;
  product: ProductDetail
}
export const useCart = () => {
  const { data, mutate } = useSWRWrapper<ProductCart[]>('/api/cart', {
    url: '/api/cart',
    method: METHOD.GET
  });
  const updateCart = (cart: ProductCart[]) => {
    mutate(cart)
  }





  const addToCart = (model: ProductCart) => {
    const idx = data?.findIndex(item => item.id === model.id);
    let newCart = data ? [...data] : [];
    if (idx != null && idx >= 0) {
      newCart = newCart.map((item, index) => {
        if (idx === index) {
          return {
            ...item,
            quantity: item.quantity + model.quantity
          }
        }
        return item
      })
    } else {
      newCart.push(model)
    }
    mutate([...newCart])

  }

  return {
    data,
    updateCart,
    addToCart
  }
}

