'use client'
import React from 'react';
import { formatNumber } from '@/utils';
import Logo from '@/assets/svg/logo.svg'
import './style.scss';
import { FaHeadset } from 'react-icons/fa6'
import { CiUser, CiSearch } from 'react-icons/ci'
import { BsHandbag } from 'react-icons/bs'
import { AiOutlineGlobal } from 'react-icons/ai'

interface HeaderProps {

}


const Header = (props: HeaderProps) => { //jsx, không phai html 
  return (
    <header className=" flex flex-col bg-white border border-blue-100">
      <div className='pt-[3rem] shadow-sm'>
        <div className="h-[7rem] max-w-screen-xl m-auto px-[1.6rem] flex justify-between items-center">
          <div className='flex'>
            <div className='text-[2rem] uppercase font-semibold mr-[2.5rem] hover:text-[#BC0517] cursor-pointer'>Áo nam</div>
            <div className='text-[2rem] uppercase font-semibold mr-[2.5rem] hover:text-[#BC0517] cursor-pointer'> sơ mi</div>
            <div className='text-[2rem] uppercase font-semibold mr-[2.5rem] hover:text-[#BC0517] cursor-pointer'>Quần nam</div>
            <div className='text-[2rem] uppercase font-semibold mr-[2.5rem] hover:text-[#BC0517] cursor-pointer'>sét đồ</div>
          </div>
          <div className='w-[7rem]'><Logo /></div>
          <div className='flex items-center'>
            <div className='flex items-center mr-[1.6rem]'><strong className='text-[#BC0517] flex items-center mr-[0.4rem]'><FaHeadset className="text-[2.8rem] mr-[0.4rem]" /> Tư vấn mua hàng:</strong>  0973.285.886</div>
            <div className="flex items-center gap-[1.6rem]">
              <div><CiUser className="text-[2.8rem]" /></div>
              <div><BsHandbag className="text-[2.8rem]" /></div>
              <div><AiOutlineGlobal className="text-[2.8rem]" />
              </div></div>
          </div>
        </div>
      </div>
      <div className='h-[4.5rem] w-full '>
        <div className='max-w-screen-xl m-auto h-full px-[1.6rem] items-center flex justify-between'>
          <div className='flex items-center h-full gap-[1.5rem]'>
            <div className="text-[1.6rem] font-semibold uppercase cursor-pointer">Về chúng tôi</div>
            <div className="text-[1.6rem] font-semibold uppercase cursor-pointer">Hàng mới về</div>
            <div className="text-[1.6rem] font-semibold uppercase cursor-pointer">SP Thu đông</div>
            <div className="text-[1.6rem] font-semibold uppercase cursor-pointer">Bộ sưu tập</div>
            <div className="text-[1.6rem] font-semibold uppercase cursor-pointer">Tin tức</div>
            <div className="text-[1.6rem] font-semibold uppercase cursor-pointer">Khuyến mãi</div>
          </div>
          <div className='flex items-center  border h-[3.4rem] border-gray-700'>
            <input type="text" className='h-full p-4  outline-none' placeholder='Tìm kiếm ...' />
            <div className='h-full aspect-square flex items-center justify-center bg-gray-500'>
              <CiSearch className="text-[2rem] text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header