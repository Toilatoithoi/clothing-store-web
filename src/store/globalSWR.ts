import useSWR from 'swr';
import { APP_STATUS, USER_INFO } from './key';
import { AppStatus } from '@/interfaces';
import { useSWRWrapper } from './custom';
import { METHOD } from '@/constants';
// lưu state global
export const useAppStatus = () => {
  // dùng để check xem đã đăng nhập hay chưa
  return useSWR<AppStatus>(APP_STATUS);
};
// trả về giá trị khi có jsx
export const useUserInfo = () => {
  return useSWRWrapper(USER_INFO, {
    url: '/api/user/verifyToken',
    method: METHOD.GET,
    refreshInterval: 0,
    revalidateOnFocus: false,
  });
};
