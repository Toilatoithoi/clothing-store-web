import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React, { ReactNode } from 'react'


const CustomerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex flex-col h-screen w-screen'>
      <Header />
      <div className='flex-1 overflow-y-auto bg-white'>
        <main className=" flex flex-col max-w-screen-xl m-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default CustomerLayout