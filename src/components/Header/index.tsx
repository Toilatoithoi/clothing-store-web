'use client'
import React from 'react';
import { formatNumber } from '@/utils';
import Logo from '@/assets/svg/logo.svg';
import { FaHeadset } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { RiGlobalLine } from "react-icons/ri";
import { IoMdSearch } from "react-icons/io";
import Image from 'next/image';
import BannerImage from '@/assets/png/set-do-3.jpg'

import './style.scss';
import { config } from 'process';
import { useAppStatus } from '@/store/globalSWR';
import { mutate } from 'swr';
import { COMMON_SHOW_LOGIN, COMMON_SHOW_REGISTER } from '@/store/key';

interface HeaderProps {

}

// 
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
        label: 'Áo khoác jean',
        path: '/ao-khoac',
      },
      {
        label: 'Áo khoác phao',
        path: '/ao-khoac',
      },
      {
        label: 'Cardigan',
        path: '/ao-khoac',
      },
      {
        label: 'Áo khoác danh lộn',
        path: '/ao-khoac',
      },
      {
        label: 'Áo khoác gió',
        path: '/ao-khoac',
      },
      {
        label: 'Áo khoác nỉ',
        path: '/ao-khoac',
      },
      {
        label: 'Blazer',
        path: '/ao-khoac',
      },
    ]
  },
  {
    label: 'Sơ mi',
    path: '/so-mi',
    children: [
      {
        label: 'Sơ mi dài',
        path: '/so-mi',
      },
    ]
  },
  {
    label: 'Quần nam',
    path: '/quan-nam',
    children: [
      {
        label: 'Quần âu',
        path: '/quan-nam',
      },
      {
        label: 'Quần jean',
        path: '/quan-nam',
      },
      {
        label: 'Quần jogger',
        path: '/quan-nam',
      },
      {
        label: 'Quần kaki',
        path: '/quan-nam',
      },
    ]
  },
  {
    label: 'Set đồ',
    path: '/set-do',
    children: [
      {
        label: 'Set đồ gió',
        path: '/set-do',
      },
      {
        label: 'Set đồ nỉ',
        path: '/set-do',
      },
    ]
  },

]

const ListConfig = [
  {
    label: 'Về chúng tôi',
    path: '/ve-chung-toi',
    children: [
      {
        label: 'Tầm nhìn-Sứ mệnh',
        path: '/tam-nhin-su-menh',
      },
    ]
  },
  {
    label: 'Bộ sưu tập',
    path: '/bo-suu-tap',
    children: [
      {
        label: "MONSOON 'S COMING",
        path: '/bo-suu-tap',
      },
      {
        label: 'NEW SEASON BEGINS',
        path: '/bo-suu-tap',
      },
      {
        label: 'THE COMPLETELY PERFECT',
        path: '/bo-suu-tap',
      },
      {
        label: 'CAREFREE',
        path: '/bo-suu-tap',
      },
    ]
  },
  {
    label: 'Tin tức',
    path: '/tin-tuc',
    children: [
      {
        label: 'Thông tin BST mới',
        path: '/tin-tuc',
      },
      {
        label: '360 Blog',
        path: '/tin-tuc',
      },
      {
        label: 'Tin tức thời trang',
        path: '/tin-tuc',
      },
      {
        label: '360 Tuyển dụng',
        path: '/tin-tuc',
      },
    ]
  },
  {
    label: 'Khuyến mãi',
    path: '/khuyen-mai',
    children: [
      {
        label: 'Sale từ 99k',
        path: '/khuyen-mai',
      },
    ]
  },

]

const Header = (props: HeaderProps) => { //jsx, không phai html 
  const { data: appStatus } = useAppStatus();

  const handleShowLogin = () => {
    mutate(COMMON_SHOW_LOGIN, true);
  }

  const handleShowRegister = () => {
    mutate(COMMON_SHOW_REGISTER, true);
  }

  return (
    <header className="header flex flex-col bg-white border border-blue-100">
      <div className="pt-[3rem] flex-1 shadow-sm">
        <div className="h-[7rem] max-w-screen-xl m-auto px-[1.6rem] flex justify-between items-center">
          <div className="flex h-full nav-bar">
            {
              NavConfig.map((item, idx) => (
                <div key={idx} className="text-[2rem] h-full relative flex items-center font-semibold mr-[2.5rem] nav-container">
                  <div className="font-semibold uppercase hover:text-[#BC0517] cursor-pointer nav-btn">
                    {item.label}
                  </div>
                  <div className="bg-white sub-nav shadow-sm z-10 border-t border-[#BC0517] absolute top-full left-0 w-[60vw] max-h-[40rem] flex p-[2.4rem] gap-[3.2rem]">
                    <div className="flex-1 grid grid-cols-2 gap-x-[2rem]">
                      {item.children?.map((subNar, idx) =>
                        <div key={idx} className="hover:text-[#BC0517] cursor-pointer text-[1.6rem] h-[4.8rem] flex items-center border-b border-gray-200">{subNar.label}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Image src={BannerImage} alt={'Banner ảnh'} />
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="h-[6rem] w-[6rem]"><Logo /></div>
          <div className="flex items-center">
            <div className="flex items-center mr-[1.6rem]">
              <strong className="flex items-center mr-[0.4rem] text-[#BC0517]"><FaHeadset className="text-[2.8rem]  mr-[0.4rem]" /> Tư vấn bán hàng:</strong>
              0973.285.886
            </div>
            {appStatus?.isAuthenticated ? <div className="flex item-center gap-[1.6rem]">
              <div className="text-[2.4rem]"><FaRegUser /></div>
              <div className="text-[2.8rem]"><HiOutlineShoppingBag /></div>
              <div className="text-[2.8rem]"><RiGlobalLine /></div>
            </div> : <div className='flex gap-4'>
              <button type="button" className='font-bold' onClick={handleShowLogin}>Đăng nhập</button>
              <button type="button" className='text-[#BC0517]' onClick={handleShowRegister}>Đăng ký</button>
            </div>}

          </div>
        </div>
      </div>
      <div className="h-[4.5rem] w-full">
        <div className="max-w-screen-xl m-auto h-full px-[1.6rem] items-center flex justify-between">
          <div className="flex h-full items-center gap-[1.5rem] list-bar">
            {
              ListConfig.map((item, idx) => (
                <div key={idx} className="text-[1.6rem] font-semibold relative cursor-pointer list-container">
                  <div className="font-semibold uppercase list-btn">
                    {item.label}
                  </div>
                  <div className="bg-white list-nav shadow-sm z-10 border-t border-[#BC0517] absolute top-full left-0 w-[35vw] max-h-[40rem] p-[2.4rem] gap-[3.2rem]">
                    <div className="grid grid-cols-2 gap-x-[2rem] flex-1">
                      {item.children?.map((subNar, idx) =>
                        <div key={idx} className="hover:text-black cursor-pointer text-[1.6rem] h-[4.8rem] flex items-center border-b border-gray-200">{subNar.label}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="flex items-center h-[3.5rem] border border-gray-700">
            <input className="h-full p-4 outline-none" type="text" placeholder='Tìm kiếm...' />
            <div className="bg-gray-300 h-full aspect-square flex items-center justify-center hover:bg-gray-500">
              <IoMdSearch className="text-[2rem]" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}


export default Header