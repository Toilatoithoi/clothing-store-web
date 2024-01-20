import useSWR from 'swr';
import { APP_STATUS, USER_INFO } from './key';
import { AppStatus } from '@/interfaces';
import { useSWRWrapper } from './custom';
import { METHOD } from '@/constants';

export const useAppStatus = () => {
  return useSWR<AppStatus>(APP_STATUS);
};

export const useUserInfo = () => {
  return useSWRWrapper(USER_INFO, {
    url: '/api/user/verifyToken',
    method: METHOD.GET,
  });
};
