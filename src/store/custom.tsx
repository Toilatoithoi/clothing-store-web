import { METHOD } from '@/constants';
import { NotificationConfig } from '@/interfaces';
import { useSWRConfig } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { COMMON_LOADING } from './key';
import { fetcher } from '@/utils/fetcher';
import { toast } from 'react-toastify';
import ToastNotification from '@/components/ToastNotification';
import { uuid } from '@/utils';

export const useMutation = <T = Record<string, unknown>,>(
  key: string,
  {
    url,
    method,
    notification,
    ...options
  }: {
    url?: string;
    method?: METHOD;
    notification?: NotificationConfig;
    componentId?: string;
    loading?: boolean;
  } & SWRMutationConfiguration<T, Record<string, unknown>>,
) => {
  const { mutate } = useSWRConfig();
  return useSWRMutation(
    key,
    (
      key: string,
      { arg: body }: { arg?: Record<string, unknown> | FormData },
    ) => {
      return new Promise<T>((resolve, reject) => {
        if (options.loading) {
          mutate(COMMON_LOADING, {
            componentId: options.componentId,
            loading: true,
          });
        }
        fetcher<T>(
          url ?? key,
          method ?? METHOD.POST,
          body as Record<string, unknown>,
          // {
          //   Authorization: `Bearer ${session?.token}`,
          // },
        )
          .then(data => resolve(data))
          .catch(err => reject(err))
          .finally(() => {
            {
              if (options.loading) {
                mutate(COMMON_LOADING, {
                  componentId: options.componentId,
                  loading: false,
                });
              }
            }
          });
      });
    },
    {
      onError(err, key, config) {
        console.log({ err });
        options.onError?.(err, key, config as any);
        if (notification && !notification.ignoreError) {
          toast(
            <ToastNotification
              type="error"
              title={notification.title}
              content={err.message || err.code}
            />,
            {
              toastId: uuid(),
              position: 'bottom-right',
              hideProgressBar: true,
              theme: 'light',
            },
          );
        }
      },
      onSuccess(data, key, config) {
        options.onSuccess?.(data as T, key, config as any);
        if (notification && !notification.ignoreSuccess) {
          toast(
            <ToastNotification
              type="success"
              title={notification.title}
              content={notification.content}
            />,
            {
              toastId: uuid(),
              position: 'bottom-right',
              hideProgressBar: true,
              theme: 'light',
            },
          );
        }
      },
    },
  );
};
