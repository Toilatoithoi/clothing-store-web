'use client'
import { Formik } from 'formik'
import Link from 'next/link';
import React, { useRef } from 'react';
import TextInput from '../TextInput';
import { isBlank, uuid } from '@/utils';
import Checkbox from '../CheckBox';
import * as yup from 'yup';
import { fetcher } from '@/utils/fetcher';
import { METHOD } from '@/constants';
import { useMutation } from '@/store/custom';
import Loader from '../Loader';
import { mutate } from 'swr';
import { COMMON_SHOW_REGISTER } from '@/store/key';
import MomentUtils from '@date-io/moment';
import DateFnsUtils from '@date-io/date-fns';
import LuxonUtils from '@date-io/luxon';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import { TextField } from "@material-ui/core";
import  DatePicker from '../DatePicker';
import { formatDateToString } from '@/utils/datetime';
import Combobox, { ComboboxOption } from '../Combobox';

interface SingUpPayload {
  surname: string;
  name: string;
  phoneNumber: string;
  username: string;
  password: string;
  gender: string;
  address: string;
  dob: string;
}

const registerFetcher = (key: string,) => {
  return fetcher(key, METHOD.POST)
}

const SignUpForm = (props: { onShowLogin(): void }) => {
  const genderOptions: ComboboxOption[] = [{ label: 'Nam', value: 'Nam' }, { label: 'Nữ', value: 'Nữ' }];
  const componentId = useRef(uuid())
  // gửi dữ liệu từ form và chỉ kích hoạt khi có trigger và khi có trigger mình sẽ truyền data xuống server
  // khác với useSWR useMutation có trigger mình có thể truyền data xuông server rồi mình respone
  // Giá trị trigger là useMutation trả ra nó sẽ gửi xuống server thông qua url
  // Phân biệt giữa useMutation và useSWR
  const { trigger, data, error } = useMutation('/api/register', {
    url: '/api/register',
    method: METHOD.POST,
    onSuccess(data, key, config) {
      console.log(data)
      // ẩn form đăng kí
      mutate(COMMON_SHOW_REGISTER, false)
    },
    // thực hiện loading
    componentId: componentId.current,
    loading: true,
    notification: {
      // config thông báo
      // title dùng chung cho thành công và thấT bại
      title: 'Đăng ký tài khoản',
      // chỉ dùng cho thành công
      content: 'Đăng ký tài khoản thành công',
      // không show thông báo lỗi lên
      ignoreError: true,
    }
  })

  const schema = yup.object().shape({
    surname: yup.string().label('Họ').required(),
    name: yup.string().label('Tên').required(),
    phoneNumber: yup.string().label('Số điện thoại').required().matches(/^(?:[0-9] ?){6,14}[0-9]$/, 'Số điện thoại không hợp lệ'),
    username: yup.string().label('Email').required().email('Phải nhập đúng định dạng'),
    password: yup.string().label('Mật khẩu').required(),
    address: yup.string().label('Địa chỉ').required(),
    gender: yup.string().label('Giới tính').required(),
    dob: yup.string().label('Ngày sinh').required(),
  })

  const handleSignUp = (values: SingUpPayload) => {
    console.log({ values })
    // chứa data
    trigger({
      name: values.surname + " " + values.name,
      username: values.username,
      password: values.password,
      phoneNumber: values.phoneNumber,
      address: values.address,
      gender: values.gender,
      dob: values.dob
    })
  }

  console.log({ data, error })

  return (
    <Loader id={componentId.current} className='w-screen max-w-xl'>
      <Formik
        onSubmit={handleSignUp}
        initialValues={{
          password: '',
          name: '',
          surname: '',
          phoneNumber: '',
          username: '',
          gender: '',
          address: '',
          dob: ''
        }}
        validationSchema={schema}
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
        }) => <form className='flex flex-col gap-8' onSubmit={handleSubmit} >
            <div className='w-full text-center text-[3rem] font-bold text-black'>Đăng ký</div>
            <div>Bạn đã có tài khoản? <strong className='text-blue-500 cursor-pointer' onClick={props.onShowLogin}>Đăng nhập ngay</strong></div>
            {/* kiểm tra có lỗi hay không */}
            {error?.message && <div className='text-red-500 text-center w-full'>{error.message}</div>}
            <TextInput
              label='Họ'
              value={values.surname}
              onBlur={handleBlur}
              onChange={handleChange}
              name="surname"
              hasError={!isBlank(errors.surname) && touched.surname}
              errorMessage={errors.surname}
            />
            <TextInput
              label='Tên'
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
            <TextInput
              label='Email'
              value={values.username}
              onBlur={handleBlur}
              onChange={handleChange}
              name="username"
              hasError={!isBlank(errors.username) && touched.username}
              errorMessage={errors.username}
            />
            <TextInput
              label='Mật khẩu'
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
              name="password"
              type='password'
              hasError={!isBlank(errors.password) && touched.password}
              errorMessage={errors.password}
            />
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
            <button disabled={!isValid} type='submit' className='bg-[#bc0516] disabled:opacity-[0.5] text-white uppercase px-[1.6rem] h-[4rem] flex items-center justify-center font-bold'>Đăng ký</button>
          </form>}
      </Formik>
    </Loader>
  )
}

export default SignUpForm