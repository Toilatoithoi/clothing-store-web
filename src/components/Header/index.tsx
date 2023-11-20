'use client'
import React from 'react';
import BannerImg from '@/assets/png/set-do-3.jpg'
import { formatNumber } from '@/utils';
import Logo from '@/assets/svg/logo.svg'
import './style.scss';

import { FaHeadset } from 'react-icons/fa6'
import { CiUser, CiSearch } from 'react-icons/ci'
import { BsHandbag } from 'react-icons/bs'
import { AiOutlineGlobal } from 'react-icons/ai'
import Image from 'next/image';

interface HeaderProps {

}

const NavConfig = [
  {
    label: 'Áo khoác',
    path: '/ao-khoac',
    children: [
      {
        label: 'Áo khoác bomber',
        path: '/ao-khoac',
      },
      {
        label: 'Áo khoác dáng parka',
        path: '/ao-khoac',
      },
      {
        label: 'Áo khoác Jean',
        path: '/ao-khoac',
      },
      {
        label: 'Áo khoác Phao',
        path: '/ao-khoac',
      },
      {
        label: 'Cardigan',
        path: '/ao-khoac',
      },
      {
        label: 'Áo khoác bomber',
        path: '/ao-khoac',
      },
      {
        label: 'Áo khoác bomber',
        path: '/ao-khoac',
      },
      {
        label: 'Áo khoác bomber',
        path: '/ao-khoac',
      },
      {
        label: 'Áo khoác bomber',
        path: '/ao-khoac',
      },
    ]
  },
  {
    label: 'Sơ mi',
    path: '/ao-khoac',
  },
  {
    label: 'QUần nam',
    path: '/ao-khoac',
  },
  {
    label: 'Sét đồ',
    path: '/ao-khoac',
  },
]

const Header = (props: HeaderProps) => {
  return (
    <header className=" header flex flex-col bg-white border border-blue-100">
      <div className='pt-[3rem] shadow-sm'>
        <div className="h-[7rem] max-w-screen-xl m-auto px-[1.6rem] flex justify-between items-center">
          <div className='flex h-full nav-bar'>
            {
              NavConfig.map((item, idx) => (
                <div key={idx} className='text-[2rem] relative h-full flex items-center uppercase font-semibold mr-[2.5rem] nav-container'>
                  <div className='hover:text-[#BC0517] cursor-pointer nav-btn'>
                    {item.label}
                  </div>
                  <div className=' sub-nav border-t z-10 bg-white shadow-md  border-[#BC0517] absolute top-full left-0 w-[60vw] max-h-[40rem] flex p-[2.4rem] gap-[3.2rem]'>
                    <div className='flex-1 grid grid-cols-2 gap-[1.6rem]'>
                      {item.children?.map((subNav, idx) =>
                        <div key={idx} className='hover:text-[#BC0517] cursor-pointer text-[1.6rem] h-[4.8rem] flex   items-center border-b border-gray-200'>
                          {subNav.label}
                        </div>)}

                    </div>
                    <div className='flex-1'>
                      <Image src={BannerImg} alt={'Banner'} />
                    </div>
                  </div>
                </div>
              ))
            }
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