
'use client'
import React, { useEffect } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { Formik } from 'formik';
import * as yup from 'yup';
import TextInput from '@/components/TextInput';
import { isBlank } from '@/utils';

interface PaymentForm {
  name: string;
  email: string;
  phone: string;
  city?: string;
  district?: string;
  wards?: string;
  address?: string;
  note?: string;
}

interface Wards {
  Id: string;
  Name: string;
}


interface Districts {
  Id: string;
  Name: string;
  Wards: Wards[]
}

interface AddressResponse {
  Name: string;
  Id: string;
  Districts: Districts[]
}
interface DropdownOptions {
  label: string;
  value: string;
}
const Payment = () => {
  useEffect(() => {
    getAddressOptions();
  }, [])
  const getAddressOptions = async () => {
    try {
      const res = await fetch('/address.json');
      const data: AddressResponse[] = await res.json();
      const cityOptions: DropdownOptions[] = [];
      const districtsOptions: Record<string, DropdownOptions[]> = {}
      const wardsOptions: Record<string, DropdownOptions[]> = {}

      data.forEach((city) => {
        cityOptions.push({ label: city.Name, value: city.Id })
        city.Districts.forEach(district => {
          districtsOptions[city.Id] = (districtsOptions[city.Id] ?? []).concat([{
            label: district.Name,
            value: district.Id,
          }])
          wardsOptions[district.Id] = district.Wards.map(ward => ({ label: ward.Name, value: ward.Id }))
        })
      })

      console.log({ cityOptions, districtsOptions, wardsOptions })

    } catch (error) {
      console.log(error)
    }


  }

  const handlePayment = (values: PaymentForm) => {
    console.log('payment', values)

    // call api với values
  }

  const schema = yup.object().shape({
    name: yup.string().label('Họ và tên').required(),
    email: yup.string().label('Email').required().email('Email không hợp lệ'),
    phone: yup.string().label('Số điện thoại').required().matches(/^(?:[0-9] ?){6,14}[0-9]$/, 'Số điện thoại không hợp lệ'),
    city: yup.string().label('Tỉnh/Thành phố').required(),
    district: yup.string().label('Quận/huyện').required(),
    wards: yup.string().label('Phường/xã').required(),
    address: yup.string().label('Địa chỉ').required(),
  })

  return (
    <div>
      <div className='flex items-center justify-center my-[3.2rem]'>
        <div>Giỏ hàng</div><IoIosArrowForward />
        <div>Thanh toán</div><IoIosArrowForward />
        <div>Hoàn tất</div>
      </div>
      <Formik
        initialValues={{
          name: '',
          email: '',
          phone: ''
        }}

        validationSchema={schema}
        onSubmit={handlePayment}
      >
        {({ values, touched, errors, handleSubmit, handleBlur, handleChange }) =>
          <form className='w-full' onSubmit={handleSubmit}>
            <div className='flex w-full gap-[3.2rem]'>
              <div className='bg-[#f7f8fa] flex-1 p-[3rem]  h-fit gap-4'>
                <div className='font-bold mb-[1.6rem] text-[1.8rem]'>ĐỊA CHỈ GIAO HÀNG</div>
                <div className='list-input grid grid-cols-2 gap-x-[2.4rem] gap-y-[1.6rem]'>
                  <TextInput
                    name='name'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    hasError={touched.name && !isBlank(errors.name)}
                    errorMessage={errors.name}
                    placeholder='Họ và tên của bạn'
                    className='col-span-2'
                    label="Họ và tên" />
                  <TextInput
                    name='phone'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    hasError={touched.phone && !isBlank(errors.phone)}
                    errorMessage={errors.phone}
                    placeholder='Số điện thoại của bạn'
                    label="Phone" />
                  <TextInput
                    name='email'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    hasError={touched.email && !isBlank(errors.email)}
                    errorMessage={errors.email}
                    placeholder='Email của bạn'
                    label="Email" />

                </div>

              </div>
              <div className='bg-[#f7f8fa] w-[40rem]  p-[3rem]'>
                <button type="submit" className=' btn-primary'>Thanh toán</button>
              </div>
            </div>
          </form>}
      </Formik>
    </div>
  )
}

export default Payment