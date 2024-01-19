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
import { COMMON_SHOW_LOGIN, COMMON_SHOW_REGISTER } from '@/store/key'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { getKey } from '@/utils/localStorage'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {



  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const { data: triggerShowLogin } = useSWR<boolean>(COMMON_SHOW_LOGIN);
  const { data: triggerShowRegister } = useSWR<boolean>(COMMON_SHOW_REGISTER);
  useEffect(() => {
    yup.setLocale({
      mixed: {
        required: ({ label }: { label: string; }) => `${label} không được để trống`
      },
    })

    // check xem đã đăng nhập chưa.

    const accessToken = getKey('access_token') as string;

    if (accessToken) {
      verifyAccessToken(accessToken)
    }
  }, []);

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


  const verifyAccessToken = (token: string) => {
    // call api để verify
  }


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

        <div className='flex flex-col h-screen w-screen'>
          <Header />
          <div className='flex-1 overflow-y-auto bg-white'>
            <main className="min-h-[130rem] flex flex-col max-w-screen-xl m-auto">
              {children}
            </main>
            <Footer />
          </div>
        </div>
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
