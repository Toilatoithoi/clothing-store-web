import { ProductDetail, ProductModel } from '@/interfaces/model';
import { useEffect, useState } from 'react';
import useSWR from 'swr'
export const USER_CART = 'USER_CART'

export interface ProductCart extends ProductModel {
  id: number;
  quantity: number;
  product: ProductDetail
}
export const useCart = () => {
  const { data, mutate } = useSWR<ProductCart[]>('USER_CART');
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

