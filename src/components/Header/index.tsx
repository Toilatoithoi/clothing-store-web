'use client'
import React from 'react';
import { formatNumber, uuid } from '@/utils';
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
import { APP_STATUS, COMMON_SHOW_LOGIN, COMMON_SHOW_REGISTER, USER_INFO } from '@/store/key';
import { useSWRWrapper } from '@/store/custom';
import { Category } from '@/interfaces/model';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import CartDropdown from '../CartDropdown';
import { GoListUnordered } from "react-icons/go";
import { setKey } from '@/utils/localStorage';
import ToastNotification from '../ToastNotification';
import { toast } from 'react-toastify';

interface HeaderProps {

}


const ListConfig = [
  {
    label: 'Về chúng tôi',
    path: 'about-shop',
    children: [
      {
        label: 'Tầm nhìn-Sứ mệnh',
        path: '/tam-nhin-su-menh',
      },
    ]
  },
  {
    label: 'Bộ sưu tập',
    path: 'look-book',
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
    path: 'new',
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
    path: 'promotion',
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
  const { categoryId } = useParams();
  const { data } = useSWRWrapper<Category[]>('/api/category?level=1', {
    url: '/api/category?level=1',
  })

  const handleShowLogin = () => {
    // chỉ cần thay đổi mutate thì sẽ hiển thị form đăng nhập
    mutate(COMMON_SHOW_LOGIN, true);
  }

  const handleShowLogout = () => {
    // chỉ cần thay đổi mutate thì sẽ hiển thị form đăng nhập
    setKey('access_token', '');
    mutate(USER_INFO, '');
    // thành công sẽ cập nhật APP_STATUS là true 
    mutate(APP_STATUS, { isAuthenticated: false });
    toast(
      <ToastNotification
        type="success"
        title="Đăng xuất"
        content="Đăng xuất thành công"
      />,
      {
        toastId: uuid(),
        position: 'bottom-right',
        hideProgressBar: true,
        theme: 'light',
      },
    );
  }

  const handleShowRegister = () => {
    // chỉ cần thay đổi mutate thì sẽ hiển thị form đăng kí
    mutate(COMMON_SHOW_REGISTER, true);
  }

  return (
    <header className="header flex flex-col bg-white border border-blue-100">
      <div className="pt-[3rem] flex-1 shadow-sm">
        <div className="h-[7rem] max-w-screen-xl m-auto px-[1.6rem] flex justify-between items-center">
          <div className="flex h-full nav-bar">
            {
              data?.map((item, idx) => (
                <Link href={`/products/${item.id}`} key={idx} className="text-[2rem] h-full relative flex items-center font-semibold mr-[2.5rem] nav-container">
                  <div className={`font-semibold uppercase hover:text-[#BC0517] cursor-pointer nav-btn ${Number(categoryId) === item.id ? 'text-[#BC0517]' : ''}`}>
                    {item.name}
                  </div>
                </Link>
              ))
            }
          </div>
          <div className="h-[6rem] w-[6rem]"><Logo /></div>
          <div className="flex items-center">
            <div className="flex items-center mr-[1.6rem]">
              <strong className="flex items-center mr-[0.4rem] text-[#BC0517]"><FaHeadset className="text-[2.8rem]  mr-[0.4rem]" /> Tư vấn bán hàng:</strong>
              0973.285.886
            </div>
            {/* nếu đăng nhập rồi isAuthenticated là true sẽ show ra biểu tượng */}
            {appStatus?.isAuthenticated ? <div className="flex item-center gap-[1.6rem]">
              <div className="text-[2.4rem]"><FaRegUser /></div>
              <div className="text-[2.8rem] cursor-pointer z-10"><CartDropdown /></div>
              <div className="text-[2.8rem]"><Link href={'/list-bill'}><GoListUnordered /></Link></div>
              <button type="button" className='font-bold' onClick={handleShowLogout}>Đăng xuất</button>
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
                  <Link href={`/${item.path}`} key={idx}>
                    <div className="font-semibold uppercase list-btn">
                      {item.label}
                    </div>
                  </Link>
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