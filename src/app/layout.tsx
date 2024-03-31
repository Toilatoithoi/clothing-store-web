'use client';
import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import '@/styles/globals.css';
import Header from '@/components/Header';
import '@/styles/index.scss';
const inter = Quicksand({ subsets: ['latin'] });
import * as yup from 'yup';
import 'react-rangeslider/lib/index.css';
import { useEffect, useState } from 'react';
import ModalProvider from '@/components/ModalProvider';
import LoginForm from '@/components/LoginForm';
import SignUpForm from '@/components/SignUpForm';
import useSWR, { mutate } from 'swr';
import {
  APP_STATUS,
  COMMON_SHOW_LOGIN,
  COMMON_SHOW_REGISTER,
  USER_INFO,
} from '@/store/key';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useAppStatus, useUserInfo } from '@/store/globalSWR';
import { usePathname, useRouter } from 'next/navigation';
import 'ag-grid-community/styles/ag-grid.css'; // Core CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Theme

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // pathname lấy ra từ loacalhost:3000/
  // const pathname = usePathname();
  const router = useRouter();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { data: appStatus } = useAppStatus();

  // lấy thông tin người dùng
  // isLoading khi mới vào thì khi nhập url sẽ khởi tạo trang nên loading để người tao biết đang lấy data query từ server
  const { data: userInfo, isLoading } = useUserInfo();
  // state COMMON_SHOW_LOGIN kiểu boolean
  // state COMMON_SHOW_REGISTER kiểu boolean
  // do cả hai đều trả về data nên phải thêm : tên mới vào để không nhầm
  // useSWR trả về object có chứa key và data
  // Mỗi key sẽ ứng với 1 state vd: COMMON_SHOW_LOGIN có data kiểu boolean
  // lý do dùng global state vì nó không cần phải cho thằng cha truyền vào thằng con để tráng các compoment không bị phụ thuộc
  // từ tất cả compoment đều có thể tác động lên global state đấy
  // lấy state ra để dùng useSWR<kiểu dữ liệu>(key)
  // useSWR và useMutation là useMutation khi nào gọi trigger mới query
  // Muốn khởi tạo giá trị ban đầu cho state dùng fetch
  const { data: triggerShowLogin } = useSWR<boolean>(COMMON_SHOW_LOGIN);
  const { data: triggerShowRegister } = useSWR<boolean>(COMMON_SHOW_REGISTER);

  // useEffect(() => {
  //   // khi đăng xuất thì khi ở những trang này sẽ quay về trang home
  //   const privateRoute = ['/list-bill', '/user-cart', '/payment', '/user'];
  //   console.log(appStatus)
  //   if (appStatus) {
  //     if (!appStatus.isAuthenticated) {
  //       // nếu một trong những item này trả về true thì inPrivate trả về true
  //       // every thì tất cả item này trả về true thì inPrivate mới trả về true
  //       const inPrivate = privateRoute.some(item => pathname.startsWith(item));
  //       if (inPrivate) {
  //         router.push('/')
  //       }
  //     }
  //   }
  // }, [appStatus?.isAuthenticated])

  useEffect(() => {
    yup.setLocale({
      mixed: {
        required: ({ label }: { label: string }) =>
          `${label} không được để trống`,
      },
    });
  }, []);

  useEffect(() => {
    // để thay đổi giá trị của state global dùng mutate
    // nếu userInfo == null  thì APP_STATUS set bằng false
    // APP_STATUS bằng true là đã login
    console.log({ userInfo });
    mutate(APP_STATUS, { isAuthenticated: userInfo?.username != null });
  }, [userInfo]);

  useEffect(() => {
    if (triggerShowLogin) {
      handleShowLogin();
    } else {
      setShowLogin(false);
    }
  }, [triggerShowLogin]);

  useEffect(() => {
    if (triggerShowRegister) {
      handleShowRegister();
    } else {
      setShowRegister(false);
    }
  }, [triggerShowRegister]);

  const handleShowRegister = () => {
    setShowLogin(false); // ẩn form login
    setShowRegister(true); // show form đăng ký
  };

  const handleShowLogin = () => {
    setShowLogin(true); // show form login
    setShowRegister(false); // ẩn form đăng ký
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer autoClose={3000} />
        {children}
        <ModalProvider
          onHide={() => {
            setShowLogin(false);
            // để thay đổi giá trị củ state global dùng mutate truyền key, giá trị cho state
            mutate(COMMON_SHOW_LOGIN, false);
          }}
          show={showLogin}
        >
          <LoginForm onShowRegister={handleShowRegister} />
        </ModalProvider>
        <ModalProvider
          onHide={() => {
            setShowRegister(false);
            // để thay đổi giá trị củ state global dùng mutate
            mutate(COMMON_SHOW_REGISTER, false);
          }}
          show={showRegister}
        >
          <SignUpForm onShowLogin={handleShowLogin} />
        </ModalProvider>
      </body>
    </html>
  );
}
