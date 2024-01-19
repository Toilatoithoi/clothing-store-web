import useSWR from 'swr';
import { APP_STATUS } from './key';
import { AppStatus } from '@/interfaces';

export const useAppStatus = () => {
  return useSWR<AppStatus>(APP_STATUS);
}