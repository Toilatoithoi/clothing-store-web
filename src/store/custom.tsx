import { METHOD } from '@/constants';
import { NotificationConfig } from '@/interfaces';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { COMMON_LOADING } from './key';
import { fetcher } from '@/utils/fetcher';
import { toast } from 'react-toastify';
import ToastNotification from '@/components/ToastNotification';
import { isBlank, uuid } from '@/utils';
import { PublicConfiguration } from 'swr/_internal';
import { RestError } from '@/utils/service';
import { getKey } from '@/utils/localStorage';

// truyen cho useSWR một url, method, notification rồi call api nếu lỗi sẽ gọi hàm onError nếu thành công onSuccess gửi request từ client xuống server
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
    // thêm notification, componentId, loading
    notification?: NotificationConfig;
    // 
    componentId?: string;
    loading?: boolean;
  } & SWRMutationConfiguration<T, Record<string, unknown>>,
) => {
  const { mutate } = useSWRConfig();
  // trả về một hook useSWRMutation thư viện
  // nếu để đây thì dù đã xoá đi access_token rồi nhưng do câu lệnh này chỉ được chạy một lần thôi nên nó chỉ dữ giá trị ban đầu
  // const accessToken = getKey('access_token') as string;
  return useSWRMutation(
    key,
    (
      key: string,
      // thêm body để mỗi khi dùng không phải thêm mà map sẵn vào useMution
      { arg: body }: { arg?: Record<string, unknown> | FormData },
    ) => {
      return new Promise<T>((resolve, reject) => {
        // bắt đầu fetcher thì sẽ set lại COMMON_LOADING để bằng true show loading
        // phải để nó ở đâu do nếu khi đăng xuất nó sẽ gọi lại user_info để get data mới về do nó không chạy lại nên vẫn có giá trị nên không đăng xuất thành công
        const accessToken = getKey('access_token') as string;

        if (options.loading) {
          mutate(COMMON_LOADING, {
            componentId: options.componentId,
            loading: true,
          });
        }
        // thêm fetcher để mỗi khi dùng không phải thêm mà map sẵn vào useMution
        fetcher<T>(
          url ?? key,
          method ?? METHOD.POST,
          body as Record<string, unknown>,
          {
            // bước xác thực bằng accessToken
            Authorization: `Bearer ${accessToken}`,
          },
        )
          // lúc call api thành công
          .then(data => resolve(data))
          // lúc  call api thất bại
          .catch(err => reject(err))
          // khi thực hiện qua hai cái trên thì sẽ chạy vào 
          .finally(() => {
            {
              if (options.loading) {
                mutate(COMMON_LOADING, {
                  // disable COMMON_LOADING để nó không loading nữa
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
              // chỉnh vị trí
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



export function useSWRWrapper<T = Record<string, unknown>>(
  key: string | null | (() => string | null),
  {
    url,
    ignoreKeyParse,
    method,
    params,
    auth,
    ...config
  }: {
    url?: string;
    method?: METHOD;
    params?: Record<string, unknown>;
    auth?: boolean;
    ignoreKeyParse?: boolean;
  } & Partial<PublicConfiguration<T, RestError, (arg: string) => any>>,
) {
  let keyParse = typeof key === 'string' ? key : key?.();
  // lấy ra accessToken
  // trả về một hook useSWRMutation thư viện nhưng chỉ chạy lần đầu
  // const accessToken = getKey('access_token') as string;
  return useSWR<T>(
    isBlank(keyParse!) ? null : (keyParse as any),
    () => {
      return new Promise((resolve, reject) => {
        // thêm fetcher để mỗi khi dùng không phải thêm mà map sẵn vào useMution
        const accessToken = getKey('access_token') as string;

        fetcher<T>(
          url ?? (typeof key === 'string' ? key : key?.()) ?? '',
          method ?? METHOD.GET,
          params,
          {
            // bước xác thực bằng accessToken
            Authorization: `Bearer ${accessToken}`,
          },
        )
          .then(data => {
            resolve(data!);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    config,
  );
}