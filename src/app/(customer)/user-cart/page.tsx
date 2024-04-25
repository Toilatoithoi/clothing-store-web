
'use client'
import React, { useEffect, useRef, useState } from 'react';
import Right from "@/assets/svg/chevron-right.svg";
import Pay from '@/assets/svg/pay.svg'
import ShoppingTag from "@/assets/svg/tag.svg";
import ProductImage from '@/assets/png/product-1.jpg'
import Image from 'next/image'
import InputCount from '@/components/InputCount';
import { ProductCart, useCart } from '@/components/CartDropdown/hook';
import { useMutation, useSWRWrapper } from '@/store/custom';
import { METHOD } from '@/constants';
import { formatNumber } from '@/utils';
import { Formik, FormikProps } from 'formik';
import { useRouter } from 'next/navigation';

interface UserCartForm {
  data: ProductCart[]
}

const UserCart = () => {

  const formRef = useRef<FormikProps<UserCartForm>>()
  // điều hướng route
  const router = useRouter();
  const { updateCart, deleteToCart, data } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [summary, setSummary] = useState({ totalPrice: 0, totalQuantity: 0 });
  const timer = useRef<NodeJS.Timeout>()
  useEffect(() => {
    if (data) {
      // reduce là một phương thức của JavaScript được sử dụng để tính toán một giá trị duy nhất từ các phần tử của mảng
      // acc tham số này là giá trị tích lũy, nghĩa là giá trị tạm tính tính đến thời điểm hiện tại trong quá trình duyệt qua mảng
      // item tham số này là phần tử hiện tại trong mảng, trong trường hợp này là một đối tượng sản phẩm
      const summaryQty = data.reduce((acc, item) => ({
        totalPrice: acc.totalPrice + item.quantity * item.price,
        totalQuantity: acc.totalQuantity + item.quantity,
      }), { totalPrice: 0, totalQuantity: 0 });
      setSummary(summaryQty)
      // setValue cho formik
      formRef.current?.setValues({
        data
      })
    }
  }, [data])


  const handleSubmit = (values: UserCartForm) => {
    // value phải cùng kiểu với initialValues
    // nếu muốn ghi đè thì thêm / không nó sẽ hiển thị tiếp nối url hiện tại
    router.push('/payment')
  }

  const handleChangeQty = (qty: number, idx: number, item: ProductCart) => {
    // setFieldValues cho field truyền value
    // data[${idx}].quantity từng phần tử trong data.quantity truyền giá trị
    formRef.current?.setFieldValue(`data[${idx}].quantity`, qty)
    if (timer.current) {
      clearTimeout(timer.current)
    }
    // call api để update value của user-cart
    updateCart({ ...item, quantity: qty }, true);
  }

  const handledelete = (item: ProductCart) => {
    // setFieldValues cho field truyền value
    // data[${idx}].quantity từng phần tử trong data.quantity truyền giá trị
    // call api để update value của user-cart
    deleteToCart({ ...item });
  }
  return (
    <div className='h-[60rem] overflow-y-auto mb-4'>
      <div className='flex items-center justify-center my-[3.2rem]'>
        <div className='font-bold'>Giỏ hàng</div><Right />
        <div>Thanh toán</div><Right />
        <div>Hoàn tất</div>
      </div>
      <Formik
        // để điều khiển formik
        innerRef={(instance) => formRef.current = instance!}
        onSubmit={handleSubmit}
        initialValues={{ data: [] } as UserCartForm}
      >
        {({ values, handleSubmit, setFieldValue }) => {
          return <form className='w-full' onSubmit={handleSubmit}>
            <div className='flex w-full gap-[3.2rem]'>
              <div className='bg-[#f7f8fa] flex-1 p-[3rem] grid grid-cols-5 h-fit gap-4'>
                <div className='col-span-2'>Sản phẩm</div>
                <div className='text-center'>Giá </div>
                <div className='text-center'>Số lượng</div>
                <div className='text-center'>Tạm tính</div>
                {
                  values.data.map((item, idx) => (
                    <>
                      {/*  do đang dùng<> khi render ra no sẽ không có thằng này nếu không truyền key no sẽ có nhưng lỗi hiển thị ở console.log */}
                      <div key={idx + values.data.length} className='flex col-span-2'>
                        <Image src={item.image} className='object-contain mr-4' alt="product" width={80} height={100} />
                        <div>
                          <div>{item.product.name}</div>
                          <div>{item.size}</div>
                          <div>{item.color}</div>
                          <button type='button' onClick={() => handledelete(item)} className='cursor-pointer px-1  border-2 border-gray-500 bg-blue-200 text-red-500 hover:border-red-500 hover:bg-yellow-500'>Xóa</button>
                        </div>
                      </div>
                      <div key={idx + values.data.length + 2} className='text-center'>{formatNumber(item.price)} VND</div>
                      <div key={idx + values.data.length + 3} className='flex justify-center'><InputCount min={1} max={item.stock} value={item.quantity} onChange={(qty) => handleChangeQty(qty, idx, item)} /></div>
                      <div key={idx + values.data.length + 4} className='text-center'>{formatNumber(item.price * item.quantity)} VND</div>
                    </>
                  ))}
              </div>
              <div className='bg-[#f7f8fa] w-[40rem]  p-[3rem]'>
                <div className='h-[4rem] flex items-center text-[2rem] font-bold mb-[1.6rem]'>Tóm tắt đơn hàng</div>
                <div className=' w-full flex justify-between h-[3.6rem] items-center text-[1.6rem]'>
                  <div className='font-bold'>Tạm tính</div>
                  <div>{formatNumber(summary.totalPrice)} VND</div>
                </div>
                <div className='w-full flex justify-between h-[3.6rem] items-center text-[1.6rem] mb-[2.4rem]'>
                  <div className='font-bold'>Tổng</div>
                  <div className='font-bold'>{formatNumber(summary.totalPrice)} VNĐ</div>
                </div>
                <div className='w-full mb-[2.4rem]'>
                  {
                    summary.totalPrice > 0 && values.data.length != 0 ?
                    <button type="submit" className='h-[4rem] w-full flex items-center justify-center tex-[1.6rem] font-bold text-white uppercase bg-[#bc0516] flex-1'>Thanh toán</button>
                    : <button disabled={true} type="submit" className='h-[4rem] w-full flex items-center justify-center tex-[1.6rem] font-bold text-white uppercase bg-gray-300 flex-1'>Thanh toán</button>
                  }
                </div>
                {/* <div className='flex text-[1.6rem] items-center mb-[1.4rem]'> <ShoppingTag className=" font-bold mr-[0.4rem]" /> <div className='font-bold'>Phiếu ưu đãi</div> </div>
                <div className='flex h-[3.8rem] border border-gray-900 mb-[1rem]'>
                  <input type="text" placeholder='Mã ưu đãi' className='outline-none flex-1 px-4' />
                  <button type='button' className='bg-[#2d2d2d]  px-4 text-white'>Áp dụng</button>
                </div>
                <div className='text-[1.6rem] font-bold mb-[1.5rem]'>Free ship cho đơn hàng từ 500.000đ</div> */}
                {/* <div className='text-[1.6rem] font-bold py-[1.5rem] border-t border-gray-200'>Chùng tôi chấp nhận</div>
                <div><Pay className="w-[10rem]" /></div> */}
              </div>
            </div>
          </form>
        }}
      </Formik>
    </div>
  )
}

export default UserCart