'use client'
import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'
import '@/styles/globals.css'
import Header from '@/components/Header'
import '@/styles/index.scss';
const inter = Quicksand({ subsets: ['latin'] })
import * as yup from 'yup';
import 'react-rangeslider/lib/index.css';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react'
import ModalProvider from '@/components/ModalProvider'
import LoginForm from '@/components/LoginForm'
import SignUpForm from '@/components/SignUpForm'
import useSWR, { mutate } from 'swr'
import { APP_STATUS, COMMON_SHOW_LOGIN, COMMON_SHOW_REGISTER } from '@/store/key'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { getKey } from '@/utils/localStorage'
import { useUserInfo } from '@/store/globalSWR'
import Preload from '@/components/Preload'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {



  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { data: userInfo, isLoading } = useUserInfo();
  const { data: triggerShowLogin } = useSWR<boolean>(COMMON_SHOW_LOGIN);
  const { data: triggerShowRegister } = useSWR<boolean>(COMMON_SHOW_REGISTER);

  console.log({ userInfo })
  useEffect(() => {
    yup.setLocale({
      mixed: {
        required: ({ label }: { label: string; }) => `${label} không được để trống`
      },
    })

    // check xem đã đăng nhập chưa.

    const accessToken = getKey('access_token') as string;

  }, []);

  useEffect(() => {
      mutate(APP_STATUS, { isAuthenticated: userInfo != null })
  }, [userInfo])

  useEffect(() => {
    if (triggerShowLogin) {
      handleShowLogin()
    } else {
      setShowLogin(false)
    }
  }, [triggerShowLogin])

  useEffect(() => {
    if (triggerShowRegister) {
      handleShowRegister();
    } else {
      setShowRegister(false)
    }
  }, [triggerShowRegister])




  const handleShowRegister = () => {
    setShowLogin(false); // ẩn form login
    setShowRegister(true);  // show form đăng ký
  }

  const handleShowLogin = () => {
    setShowLogin(true); // show form login
    setShowRegister(false); // ẩn form đăng ký
  }



  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer autoClose={3000} />
        {
          isLoading ? <div className='h-full w-full flex items-center justify-center bg-white'><Preload /> </div> :
            <div className='flex flex-col h-screen w-screen'>
              <Header />
              <div className='flex-1 overflow-y-auto bg-white'>
                <main className="min-h-[130rem] flex flex-col max-w-screen-xl m-auto">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
        }
        <ModalProvider
          onHide={() => {
            setShowLogin(false);
            mutate(COMMON_SHOW_LOGIN, false);
          }}
          show={showLogin}
        >
          <LoginForm onShowRegister={handleShowRegister} />
        </ModalProvider>
        <ModalProvider
          onHide={() => {
            setShowRegister(false);
            mutate(COMMON_SHOW_REGISTER, false);
          }}
          show={showRegister}
        >
          <SignUpForm onShowLogin={handleShowLogin} />
        </ModalProvider>
      </body>
    </html>
  )
}
