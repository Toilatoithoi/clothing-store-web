import { Formik } from 'formik'
import Link from 'next/link';
import React, { useRef } from 'react';
import TextInput from '../TextInput';
import { isBlank, uuid } from '@/utils';
import Checkbox from '../CheckBox';
import * as yup from 'yup';
import { useMutation } from '@/store/custom';
import { METHOD } from '@/constants';
import { APP_STATUS, COMMON_SHOW_LOGIN, USER_INFO } from '@/store/key';
import { mutate } from 'swr';
import Loader from '../Loader';
import { setKey } from '@/utils/localStorage';

interface LoginPayload {
  username: string;
  password: string;
  saveLogin?: boolean;
}

const LoginForm = (props: { onShowRegister(): void }) => {
  // tại sao lại phải dùng useRef vì compomentId sẽ chỉ lấy 1 lần nếu để uuid() sẽ mỗi lần chạy lại sẽ lấy id mới
  const componentId = useRef(uuid())
  const { trigger, data, error } = useMutation<{ accessToken: string, userInfo: Record<string, unknown> }>('/api/login', {
    url: '/api/login',
    method: METHOD.POST,
    onSuccess(data, key, config) {
      console.log({ data })
      // dùng để set localStorage
      setKey('access_token', data.accessToken);
      mutate(USER_INFO, data.userInfo);
      // thành công sẽ cập nhật APP_STATUS là true 
      mutate(APP_STATUS, { isAuthenticated: true });
      mutate(COMMON_SHOW_LOGIN, false);
    },
    componentId: componentId.current,
    loading: true,
    notification: {
      title: 'Đăng nhập ',
      content: 'Đăng nhập thành công',
      ignoreError: true,
    }
  })
  const schema = yup.object().shape({
    username: yup.string().label('Tên đăng nhập').required(),
    password: yup.string().label('Mật khẩu').required(),
  })

  const handleLogin = (values: LoginPayload) => {
    console.log({ values })
    trigger({ ...values })
  }
  return (
    <Loader id={componentId.current} className='w-screen max-w-xl'>
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
          isValid,
          touched,
          errors,
          setFieldValue
        }) => <form className='flex flex-col gap-8' onSubmit={handleSubmit} >
            <div className='w-full text-center text-[3rem] font-bold text-black'>Đăng nhập</div>
            <div>Trở thành thành viên của 360 Boutique <strong className='text-blue-500 cursor-pointer' onClick={props.onShowRegister} >Đăng ký ngay</strong></div>
            {error?.message && <div className='text-red-500 text-center w-full'>{error.message}</div>}

            <TextInput
              label='Tên người dùng'
              value={values.username}
              onBlur={handleBlur}
              onChange={handleChange}
              name="username"
              hasError={!isBlank(errors.username) && touched.username}
              placeholder='Nhập email'
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
              {/* <Checkbox selected={values.saveLogin} name='saveLogin' onChange={setFieldValue} label='Nhớ mật khẩu' />
              <div>Quên mật khẩu</div> */}
            </div>
            <button disabled={!isValid} type='submit' className='bg-[#bc0516] disabled:opacity-[0.5] text-white uppercase px-[1.6rem] h-[4rem] flex items-center justify-center font-bold'>Đăng nhập</button>
          </form>}
      </Formik>
    </Loader>
  )
}

export default LoginForm