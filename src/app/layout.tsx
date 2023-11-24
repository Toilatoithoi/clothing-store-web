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
import { useEffect } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    yup.setLocale({
      mixed: {
        required: ({ label }: { label: string; }) => `${label} không được để trống`
      },
    })
  }, [])
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
      </body>
    </html>
  )
}
