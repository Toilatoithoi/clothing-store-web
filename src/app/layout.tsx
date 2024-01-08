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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    yup.setLocale({
      mixed: {
        required: ({ label }: { label: string; }) => `${label} không được để trống`
      },
    })
  }, []);


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
          onHide={() => setShowLogin(false)}
          show={showLogin}
        >
          <LoginForm onShowRegister={handleShowRegister} />
        </ModalProvider>
        <ModalProvider
          onHide={() => setShowRegister(false)}
          show={showRegister}
        >
          <SignUpForm onShowLogin={handleShowLogin} />
        </ModalProvider>
      </body>
    </html>
  )
}
