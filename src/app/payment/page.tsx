
'use client'
import React, { useEffect, useState } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { Formik } from 'formik';
import * as yup from 'yup';
import TextInput from '@/components/TextInput';
import { isBlank } from '@/utils';
import Combobox, { ComboboxOption } from '@/components/Combobox';

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

const Payment = () => {
  const [cityOptions, setCityOptions] = useState<ComboboxOption[]>([])
  const [districtsOptions, setDistrictsOptions] = useState<Record<string, ComboboxOption[]>>({})
  const [wardsOptions, setWardsOptions] = useState<Record<string, ComboboxOption[]>>({})

  useEffect(() => {
    getAddressOptions();
  }, [])
  const getAddressOptions = async () => {
    try {
      const res = await fetch('/address.json');
      const data: AddressResponse[] = await res.json();
      const cityOptions: ComboboxOption[] = [];
      const districtsOptions: Record<string, ComboboxOption[]> = {}
      const wardsOptions: Record<string, ComboboxOption[]> = {}

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
      setCityOptions(cityOptions);
      setDistrictsOptions(districtsOptions);
      setWardsOptions(wardsOptions);

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
        {({ values, touched, errors, handleSubmit, handleBlur, handleChange, isValid, setFieldValue }) => // handleSubmit -> check isValid = true ? onSubmit(): null
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
                    label="Số điện thoại" />
                  <TextInput
                    name='email'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    hasError={touched.email && !isBlank(errors.email)}
                    errorMessage={errors.email}
                    placeholder='Email của bạn'
                    label="Email" />
                  <Combobox
                    options={cityOptions}
                    label='Tỉnh/thành phố'
                    selected={values.city}
                    onChange={(option) => {
                      setFieldValue('city', option.value);
                    }}
                    hasError={touched.city && !isBlank(errors.city)}
                    errorMessage={errors.city}
                  />
                  <Combobox
                    options={districtsOptions[values.city ?? ''] ?? []}
                    label='Quận/huyện'
                    selected={values.district}
                    onChange={(option) => {
                      setFieldValue('district', option?.value);
                    }}
                    hasError={touched.district && !isBlank(errors.district)}
                    errorMessage={errors.district}
                  />
                  <Combobox
                    options={wardsOptions[values.district ?? ''] ?? []}
                    label='Phường/xã'
                    selected={values.wards}
                    onChange={(option) => {
                      setFieldValue('wards', option?.value);
                    }}
                    hasError={touched.wards && !isBlank(errors.wards)}
                    errorMessage={errors.wards}
                  />

                  <TextInput
                    name='address'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    hasError={touched.address && !isBlank(errors.address)}
                    errorMessage={errors.address}
                    placeholder='Địa chỉ của bạn'
                    label="Địa chỉ" />
                  <TextInput
                    name='note'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder='Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn.'
                    className='col-span-2'
                    type='textarea'
                    rows={5}
                    label="Ghi chú đơn hàng (tuỳ chọn)" />
                </div>

              </div>
              <div className='bg-[#f7f8fa] w-[40rem]  p-[3rem] border border-gray-950'>
                <div className="font-bold text-[1.8rem]">ĐƠN HÀNG CỦA BẠN</div>
                <div className=" py-[0.8rem] text-[1.6rem] flex items-center justify-between border-b border-gray-200">
                  <div className="font-bold uppercase">SẢN PHẨM</div>
                  <div className="font-bold uppercase">Tạm tính</div>
                </div>
                <div className=" py-[0.8rem] text-[1.6rem] flex items-center justify-between border-b border-gray-200">
                  <div>
                    <div className="font-bold">Áo nỉ nam ANHTK409  × 1</div>
                    <div>Màu sắc: Đen Cỡ:S</div>
                  </div>
                  <div>399.000 VND</div>

                </div>
                <div className=" py-[0.8rem] text-[1.6rem] flex items-center justify-between border-b border-gray-200">
                  <div className="font-bold">Tạm tính</div>
                  <div>399.000 VND</div>
                </div>
                <div className=" py-[0.8rem] text-[1.6rem] flex items-center justify-between border-b border-gray-200">
                  <div className="font-bold">Tổng</div>
                  <div className="font-bold">399.000 VND</div>
                </div>
                <div className='font-semibold text-[1.4rem] mt-[1.6rem]'>Trả tiền mặt khi nhận hàng</div>
                <div className='mb-[0.8rem] text-[1.4rem]'>Trả tiền mặt khi giao hàng</div>
                <button disabled={!isValid} type="submit" className='bg-black disabled:opacity-[0.5] text-white uppercase px-[1.6rem] h-[4rem] flex items-center font-bold'>Đặt hàng</button>
              </div>
            </div>
          </form>}
      </Formik>
    </div>
  )
}

export default Payment