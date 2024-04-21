'use client'
import { Formik, FormikProps } from 'formik'
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import TextInput from '@/components/TextInput';
import { isBlank, uuid } from '@/utils';
import Checkbox from '@/components/CheckBox';
import * as yup from 'yup';
import { fetcher } from '@/utils/fetcher';
import { METHOD } from '@/constants';
import { useMutation, useSWRWrapper } from '@/store/custom';
import Loader from '@/components/Loader';
import { mutate } from 'swr';
import { COMMON_SHOW_REGISTER } from '@/store/key';
import MomentUtils from '@date-io/moment';
import DateFnsUtils from '@date-io/date-fns';
import LuxonUtils from '@date-io/luxon';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { TextField } from "@material-ui/core";
import DatePicker from '@/components/DatePicker';
import { useUserInfo } from '@/store/globalSWR';
import Combobox, { ComboboxOption } from '@/components/Combobox';
import { useUser } from '@/components/CartDropdown/hook';

export interface UserPayload {
  name: string;
  phoneNumber: string;
  // password: string;
  gender: string;
  address: string;
  dob: string;
}

const registerFetcher = (key: string,) => {
  return fetcher(key, METHOD.PUT)
}

const User = () => {
  const componentId = useRef(uuid())
  const formRef = useRef<FormikProps<UserPayload>>()
  const genderOptions: ComboboxOption[] = [{ label: 'Nam', value: 'Nam' }, { label: 'Nữ', value: 'Nữ' }];
  // gửi dữ liệu từ form và chỉ kích hoạt khi có trigger và khi có trigger mình sẽ truyền data xuống server
  // khác với useSWR useMutation có trigger mình có thể truyền data xuông server rồi mình respone
  // Giá trị trigger là useMutation trả ra nó sẽ gửi xuống server thông qua url
  // Phân biệt giữa useMutation và useSWR
  // const { trigger, data, error } = useMutation('/api/verifyToken', {
  //   url: '/api/verifyToken',
  //   method: METHOD.PUT,
  //   onSuccess(data) {
  //     console.log(data)
  //   },
  //   // thực hiện loading
  //   componentId: componentId.current,
  //   loading: true,
  //   notification: {
  //     // config thông báo
  //     // title dùng chung cho thành công và thấT bại
  //     title: 'Cập nhật tài khoản',
  //     // chỉ dùng cho thành công
  //     content: 'Cập nhật tài khoản thành công',
  //     // không show thông báo lỗi lên
  //     ignoreError: true,
  //   }
  // })

  // const { data: userData } = useSWRWrapper<UserPayload>('/api/user', {
  //   url: '/api/user',
  //   method: METHOD.GET
  // })

  const { data, updateToUser } = useUser({componentId: componentId.current})


  useEffect(() => {
    if (data) {
      formRef.current?.setValues({
        name: data.name,
        phoneNumber: data.phoneNumber,
        // password: data.password,
        gender: data.gender,
        address: data.address,
        dob: data.dob,
      })
    }
  }, [data])

  const schema = yup.object().shape({
    name: yup.string().label('Họ tên').required(),
    phoneNumber: yup.string().label('Số điện thoại').required().matches(/^(?:[0-9] ?){6,14}[0-9]$/, 'Số điện thoại không hợp lệ'),
    // username: yup.string().label('Email').required().email('Phải nhập đúng định dạng'),
    // password: yup.string().label('Mật khẩu').required(),
    address: yup.string().label('Địa chỉ').required(),
    gender: yup.string().label('Giới tính').required(),

  })

  const handleUpdate = (values: UserPayload) => {
    // chứa data
    // trigger({
    //   name: values.name,
    //   // password: values.password,
    //   phoneNumber: values.phoneNumber,
    //   address: values.address,
    //   gender: values.gender,
    //   dob: values.dob
    // })
    updateToUser(values)
  }

  console.log({ data})

  return (
    <Loader id={componentId.current} className='flex items-center justify-center h-[60rem]'>
      <Formik
        innerRef={(instance) => formRef.current = instance!}
        onSubmit={handleUpdate}
        initialValues={{
          name: data?.name || '',
          phoneNumber: data?.phoneNumber || '',
          // password: usedatarData?.password || '',
          gender: data?.gender || '',
          address: data?.address || '',
          dob: data?.dob || '',
        }}
        validationSchema={schema}
        // hàm sẽ được gọi khi submit
      >
        {({
          values,
          handleBlur,
          handleChange,
          handleSubmit,
          touched,
          errors,
          setFieldValue,
          isValid
        }) => <form className='w-full flex flex-col gap-8 m-4 p-4 border border-gray-800 ' onSubmit={handleSubmit} >
            <div className='w-full text-center text-[3rem] font-bold text-black'>Thông tin cá nhân</div>
            {/* kiểm tra có lỗi hay không */}
            {/* {error?.message && <div className='text-red-500 text-center w-full'>{error.message}</div>} */}
            <TextInput
              label='Họ tên'
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
              name="name"
              hasError={!isBlank(errors.name) && touched.name}
              errorMessage={errors.name}
            />
            <TextInput
              label='Số điện thoại'
              value={values.phoneNumber}
              onBlur={handleBlur}
              onChange={handleChange}
              name="phoneNumber"
              hasError={!isBlank(errors.phoneNumber) && touched.phoneNumber}
              errorMessage={errors.phoneNumber}
            />
            {/* <TextInput
              label='Mật khẩu'
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
              name="password"
              type='password'
              hasError={!isBlank(errors.password) && touched.password}
              errorMessage={errors.password}
            /> */}
            <TextInput
              label='Địa chỉ'
              value={values.address}
              onBlur={handleBlur}
              onChange={handleChange}
              name="address"
              hasError={!isBlank(errors.address) && touched.address}
              errorMessage={errors.address}
            />
            <Combobox
              options={genderOptions}
              label='Giới tính'
              selected={values.gender}
              onChange={(option) => {
                setFieldValue('gender', option.value);
              }}
              hasError={touched.gender && !isBlank(errors.gender)}
              errorMessage={errors.gender}
            />
            <TextInput
              label='Ngày sinh'
              value={values.dob.split('T')[0]}
              className='w-[15rem]'
              onBlur={handleBlur}
              onChange={handleChange}
              name="dob"
              type='date'
              hasError={!isBlank(errors.dob) && touched.dob}
              errorMessage={errors.dob}
            />
            {/* <DatePicker
              label="Năm sinh"
              value={values.dob}
              name="dob"
              onChange={handleChange} /> */}
            <button disabled={!isValid}type='submit' className='bg-[#bc0516] disabled:opacity-[0.5] text-white uppercase px-[1.6rem] h-[4rem] flex items-center justify-center font-bold'>Lưu</button>
          </form>}
      </Formik>
    </Loader>
  )
}

export default User