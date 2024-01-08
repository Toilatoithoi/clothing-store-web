import { Formik } from 'formik'
import Link from 'next/link';
import React from 'react';
import TextInput from '../TextInput';
import { isBlank } from '@/utils';
import Checkbox from '../CheckBox';
import * as yup from 'yup';

interface SingUpPayload {
  surname: string;
  name: string;
  phone: string;
  email:string;
  password: string;
}

const SignUpForm = () => {

  const schema = yup.object().shape({
    surname: yup.string().label('Họ').required(),
    name: yup.string().label('Tên').required(),
    phone: yup.string().label('Số điện thoại').required().matches(/^(?:[0-9] ?){6,14}[0-9]$/, 'Số điện thoại không hợp lệ'),
    email: yup.string().label('Email').required().email('Phải nhập đúng định dạng'),
    password: yup.string().label('Mật khẩu').required(),
  })

  const handleSignUp = (values: SingUpPayload) => {
    console.log({ values })
  }

  return (
    <div className='w-screen max-w-xl'>
      <Formik
        onSubmit={handleSignUp}
        initialValues={{
          password: '',
          name: '',
          surname: '',
          phone: '',
          email: ''
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
          setFieldValue
        }) => <form className='flex flex-col gap-8' onSubmit={handleSubmit} >
            <div className='w-full text-center text-[3rem] font-bold text-black'>Đăng ký</div>
            <div>Bạn đã có tài khoản? <Link className='text-blue-500' href={'/'}>Đăng nhập ngay</Link></div>
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
              value={values.phone}
              onBlur={handleBlur}
              onChange={handleChange}
              name="phone"
              hasError={!isBlank(errors.phone) && touched.phone}
              errorMessage={errors.phone}
            />
            <TextInput
              label='Email'
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
              name="email"
              hasError={!isBlank(errors.email) && touched.email}
              errorMessage={errors.email}
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
            <button type='submit' className='bg-[#bc0516] disabled:opacity-[0.5] text-white uppercase px-[1.6rem] h-[4rem] flex items-center justify-center font-bold'>Đăng ký</button>
          </form>}
      </Formik>
    </div>
  )
}

export default SignUpForm