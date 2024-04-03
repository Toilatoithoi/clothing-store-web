'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';
import Logout from '@/assets/svg/log-out.svg';

const cmsSideBar = [
  {
    label: 'Tổng quan',
    route: '/cms',
  },
  {
    label: 'Quản lý sản phẩm',
    route: '/cms/product-mgmt',
  },
  {
    label: 'Quản lý người dùng',
    route: '/cms/user-mgmt',
  },
  {
    label: 'Quản lý đơn hàng',
    route: '/cms/order-mgmt',
  },
  {
    label: 'Quản lý danh mục',
    route: '/cms/category-mgmt',
  },
  {
    label: 'Quản lý bài viết',
    route: '/cms/post-mgmt',
  },
];

const PrivateLayout = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();
  const activeRoute = cmsSideBar.find((item) => item.route === pathName);
  return (
    <div className="w-full h-full bg-slate-100 flex">
      <div className="w-[30rem] h-full border-r flex flex-col gap-[0.4rem] border-r-gray-200  bg-white ">
        <div className="h-[7.6rem] flex flex-col font-bold text-[2.4rem] text-center border-b border-b-gray-200">
          360 CMS
        </div>
        <div className="flex flex-col flex-1">
          {cmsSideBar.map((item, idx) => (
            <Link
              href={item.route}
              key={idx}
              className={`h-[4rem] ${activeRoute?.route === item.route
                  ? 'bg-slate-200 text-black'
                  : ''
                } hover:bg-slate-200 flex items-center px-[1.6rem] cursor-pointer !font-bold border-b border-b-gray-200`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            className={`h-[4rem] flex gap-4 mt-auto hover:bg-slate-200  items-center px-[1.6rem] cursor-pointer !font-bold border-b border-b-gray-200`}
            href={'/'}
          >
            <Logout /> Quay lại trang chủ
          </Link>
        </div>
      </div>
      <div className="flex-1 m-[0.8rem] flex flex-col bg-white rounded-md">
        <div className="title p-[1.6rem] border-b border-b-gray-200">
          <div className="font-bold text-[2.4rem]">{activeRoute?.label}</div>
        </div>
        <div className="flex-1 p-[1.6rem] overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default PrivateLayout;
