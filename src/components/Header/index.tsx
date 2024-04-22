'use client'
import React, { useEffect, useRef, useState } from 'react';
import { formatNumber, uuid } from '@/utils';
import Logo from '@/assets/svg/logo.svg';
import HeadPhone from "@/assets/svg/headphones.svg";
import User from "@/assets/svg/user.svg";
// import { HiOutlineShoppingBag } from "react-icons/hi";
// import { RiGlobalLine } from "react-icons/ri";
// import Image from 'next/image';
// import BannerImage from '@/assets/png/set-do-3.jpg'

import './style.scss';
// import { config } from 'process';
import { useAppStatus, useUserInfo } from '@/store/globalSWR';
import { mutate } from 'swr';
import { APP_STATUS, COMMON_LOADING, COMMON_SHOW_LOGIN, COMMON_SHOW_REGISTER, USER_INFO } from '@/store/key';
import { useSWRWrapper } from '@/store/custom';
import { Category, ProductRes } from '@/interfaces/model';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import CartDropdown from '../CartDropdown';
import Menu from "@/assets/svg/menu.svg";
import { removeKey, setKey } from '@/utils/localStorage';
import ToastNotification from '../ToastNotification';
import { toast } from 'react-toastify';
// import Loader from '../Loader';
import { useRouter } from 'next/navigation';
import { PaginationRes } from '@/interfaces';
import SearchBox from '../SearchBox';
import { ROLES } from '@/constants';
import { Tooltip } from 'react-tooltip';

interface HeaderProps {

}


const ListConfig = [
  {
    label: 'Về chúng tôi',
    path: 'about-shop',
    children: [
      {
        label: 'Giới thiệu về chúng tôi',
        path: 'about-shop',
      },
    ]
  },
  {
    label: 'Tin tức',
    path: 'new',
    // children: [
    //   {
    //     label: "MONSOON 'S COMING",
    //     path: 'look-book-detail/1',
    //   },
    //   {
    //     label: 'NEW SEASON BEGINS',
    //     path: 'look-book-detail/2',
    //   },
    //   {
    //     label: 'THE COMPLETELY PERFECT',
    //     path: 'look-book-detail/3',
    //   },
    //   {
    //     label: 'AUTUMN COMING',
    //     path: 'look-book-detail/4',
    //   },
    // ]
  },
  {
    label: 'Blog',
    path: 'promotion',
    // children: [
    //   {
    //     label: 'Blog',
    //     path: 'promotion',
    //   },
    //   // {
    //   //   label: '360 Blog',
    //   //   path: '/tin-tuc',
    //   // },
    //   // {
    //   //   label: 'Tin tức thời trang',
    //   //   path: '/tin-tuc',
    //   // },
    //   // {
    //   //   label: '360 Tuyển dụng',
    //   //   path: '/tin-tuc',
    //   // },
    // ]
  },
  // {
  //   label: 'Khuyến mãi',
  //   path: 'promotion',
  //   children: [
  //     {
  //       label: 'Sale từ 99k',
  //       path: '/khuyen-mai',
  //     },
  //   ]
  // },

]

const Header = (props: HeaderProps) => { //jsx, không phai html 
  const [fetchCount, setFetchCount] = useState(8);
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const { data: appStatus } = useAppStatus();
  const { data: userInfo } = useUserInfo();
  console.log({ userInfo })
  // điều hướng route
  const router = useRouter();
  // tại sao lại phải dùng useRef vì compomentId sẽ chỉ lấy 1 lần nếu để uuid() sẽ mỗi lần chạy lại sẽ lấy id mới
  const componentId = useRef(uuid())
  const { categoryId } = useParams();
  const { data } = useSWRWrapper<Category[]>('/api/category?level=1', {
    url: '/api/category?level=1',
  })

  const handleShowLogin = () => {
    // chỉ cần thay đổi mutate thì sẽ hiển thị form đăng nhập
    mutate(COMMON_SHOW_LOGIN, true);
  }

  const handleHome = () => {
    // nếu muốn ghi đè thì thêm / không nó sẽ hiển thị tiếp nối url hiện tại
    router.push('/')
  }

  const handleUser = () => {
    // nếu muốn ghi đè thì thêm / không nó sẽ hiển thị tiếp nối url hiện tại
    router.push('/user')
  }

  const Logout = () => {
    // chỉ cần thay đổi mutate thì sẽ hiển thị form đăng nhập
    // xoá access_token đi để user_info set lại
    removeKey('access_token')
    mutate(USER_INFO, null);
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
    // khi đăng xuất thì khi ở những trang này sẽ quay về trang home
    const privateRoute = ['/list-bill', '/user-cart', '/payment', '/user'];
    // nếu một trong những item này trả về true thì inPrivate trả về true
    // every thì tất cả item này trả về true thì inPrivate mới trả về true
    const inPrivate = privateRoute.some(item => pathname.startsWith(item));
    if (inPrivate) {
      router.push('/')
    }
  }

  const handleShowRegister = () => {
    // chỉ cần thay đổi mutate thì sẽ hiển thị form đăng kí
    mutate(COMMON_SHOW_REGISTER, true);
    // nếu làm thế này thì sẽ luôn loading ở đúng phải tử này
    mutate(COMMON_LOADING, {
      componentId: componentId.current,
      loading: true
    })
  }

  useEffect(() => {
    mutate('/api/category?level=1')
  }, [data])

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
          <button type="button" onClick={handleHome} className="h-[6rem] w-[6rem] cursor-pointer"><Logo /></button>
          <div className="flex items-center">
            <div className="flex items-center mr-[1.6rem]">
              <strong className="flex items-center mr-[0.4rem] text-[#BC0517]"><HeadPhone className="text-[2.8rem]  mr-[0.4rem]" /> Tư vấn bán hàng:</strong>
              0973.285.886
            </div>
            {/* nếu đăng nhập rồi isAuthenticated là true sẽ show ra biểu tượng */}
            {appStatus?.isAuthenticated ? <div className="flex item-center gap-[1.6rem]">
              <button type="button" onClick={handleUser} className="text-[1.6rem] z-10">
                <User data-tooltip-id="my-tooltip" data-tooltip-content={'Thông tin cá nhân'} />
                <Tooltip id="my-tooltip" />
              </button>
              <div className="text-[1.6rem] cursor-pointer z-10">
                <CartDropdown  />
              </div>
              <div className="text-[1.6rem] z-10">
                <Link href={'/list-bill'}><Menu data-tooltip-id="my-tooltip" data-tooltip-content={'Lịch sử mua hàng'}/></Link>
                <Tooltip id="my-tooltip" />
              </div>
              <button type="button" className='font-bold' onClick={Logout}>Đăng xuất</button>
              {
                userInfo?.role === ROLES.ADMIN && <Link href={`/cms`} className='font-bold text-[#BC0517]'>Quản trị</Link>
              }
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
                  {
                     item.children && (
                      <div className="bg-white list-nav shadow-sm z-10 border-t border-[#BC0517] absolute top-full left-0 w-[35vw] max-h-[40rem] p-[2.4rem] gap-[3.2rem]">
                        <div className="grid grid-cols-2 gap-x-[2rem] flex-1">
                          {item.children.map((subNar, idx) =>
                            <div key={idx} className="hover:text-black cursor-pointer text-[1.6rem] h-[4.8rem] flex items-center border-b border-gray-200"><Link href={`/${item.children[idx].path}`}>{subNar.label}</Link></div>
                          )}
                        </div>
                      </div>
                     )
                  }     
                </div>
              ))
            }
          </div>
          <SearchBox />
        </div>
      </div>
    </header>
  )
}


export default Header