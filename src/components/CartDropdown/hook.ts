import { METHOD } from '@/constants';
import { Bill, BillProduct, ProductDetail, ProductModel } from '@/interfaces/model';
import { useMutation, useSWRWrapper } from '@/store/custom';
import { useEffect, useState } from 'react';
import useSWR from 'swr'

export interface ProductCart extends ProductModel {
  product_model_id: number;
  quantity: number;
  product: ProductDetail
}

export interface Payment extends BillProduct {
  city: string;
  district: string;
  wards: string;
  address: string;
  note: string;
  status: string;
  created_at: string;
  bill: Bill;
}


export const useCart = () => {
  // lấy dữ liệu cart từ api
  const { data, mutate } = useSWRWrapper<ProductCart[]>('/api/cart', {
    url: '/api/cart',
    method: METHOD.GET
  });
  // gọi trigger là dữ liệu nhập vào khi cần addToCart vừa craete vừa update
  const { trigger } = useMutation<ProductCart[]>('/api/cart', {
    url: '/api/cart',
    method: METHOD.POST
  });
  const updateCart = (cart: ProductCart[]) => {
    // hiểu là truyền value cho global state /api/cart
    mutate(cart)
  }



  // global state dùng key để lấy gia 1 giá trị bất kì
  // key hiểu nôm na là id để lấy ra giá trị của state

  const addToCart = (model: ProductCart, override?: boolean) => {
    trigger({
      quantity: model.quantity,
      product_model_id: model.product_model_id,
      override
    })

  }

  return {
    // data là dữ liệu của giỏ hàng lấy từ api
    data,
    updateCart,
    addToCart
  }
}

export const useBill = () => {
  // lấy dữ liệu bill từ api
  const { data, mutate } = useSWRWrapper<Payment[]>('/api/bill', {
    url: '/api/bill',
    method: METHOD.GET
  });

  // gọi trigger là dữ liệu nhập vào khi cần addToCart vừa craete vừa update
  const { trigger } = useMutation<Payment[]>('/api/bill', {
    url: '/api/bill',
    method: METHOD.POST
  });
  
  // global state dùng key để lấy gia 1 giá trị bất kì
  // key hiểu nôm na là id để lấy ra giá trị của state

  const addToBill = (model: Payment) => {
    trigger({
      quantity: model.quantity,
      product_model_id: model.product_model_id,
      bill: model.bill.id
    })

  }

  return {
    // data là dữ liệu của giỏ hàng lấy từ api
    data,
    addToBill
  }
}



