import { Formik } from 'formik'
import Link from 'next/link';
import React from 'react';
import TextInput from '../TextInput';
import { isBlank } from '@/utils';
import Checkbox from '../CheckBox';
import * as yup from 'yup';

interface LoginPayload {
  username: string;
  password: string;
  saveLogin?: boolean;
}

const LoginForm = (props: { onShowRegister(): void }) => {

  const schema = yup.object().shape({
    username: yup.string().label('Tên đăng nhập').required(),
    password: yup.string().label('Mật khẩu').required(),
  })

  const handleLogin = (values: LoginPayload) => {
    console.log({ values })
  }
  return (
    <div className='w-screen max-w-xl'>
      <Formik
        onSubmit={handleLogin}
        initialValues={{
          password: '',
          username: ''
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
            <div className='w-full text-center text-[3rem] font-bold text-black'>Đăng nhập</div>
            <div>Trở thành thành viên của 360 Boutique <strong className='text-blue-500 cursor-pointer' onClick={props.onShowRegister} >Đăng ký ngay</strong></div>
            <TextInput
              label='Số điện thoại / Tên người dùng'
              value={values.username}
              onBlur={handleBlur}
              onChange={handleChange}
              name="username"
              hasError={!isBlank(errors.username) && touched.username}
              errorMessage={errors.username}
              autoComplete='off'
            />
            <TextInput
              label='Mật khẩu'
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
              name="password"
              type='password'
              autoComplete='off'
              hasError={!isBlank(errors.password) && touched.password}
              errorMessage={errors.password}
            />
            <div className="flex justify-between" >
              {/* dùng để set lại setFieldValue khi click vào */}
              {/* values.saveLogin xem có phải true hay không nếu true nó sẽ hiện svg tích*/}
              <Checkbox selected={values.saveLogin} name='saveLogin' onChange={setFieldValue} label='Nhớ mật khẩu' />
              <div>Quên mật khẩu</div>
            </div>
            <button type='submit' className='bg-[#bc0516] disabled:opacity-[0.5] text-white uppercase px-[1.6rem] h-[4rem] flex items-center justify-center font-bold'>Đăng nhập</button>
          </form>}
      </Formik>
    </div>
  )
}

export default LoginForm