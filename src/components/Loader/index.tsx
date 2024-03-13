'use client';
import React, { memo, useEffect, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay-ts';
import Preload from '@/components/Preload';
import useSWR from 'swr';
import { COMMON_LOADING } from '@/store/key';
LoadingOverlay.propTypes = undefined;

interface LoaderProps {
  className?: string;
  id?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

interface LoaderState {
  componentId: string;
  loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  className,
  children,
  // loading là trang thái của loader
  loading,
  id,
}) => {
  const { data: loaderState } = useSWR<LoaderState>(COMMON_LOADING, null);
  const [innerLoading, setInnerLoading] = useState(false);
  useEffect(() => {
    // nếu loader và id thay đổi thì sẽ check xem componentId = id không
    if (loaderState && loaderState.componentId === id) {
      // nếu đùng thì setInnerLoading bằng state
      setInnerLoading(loaderState.loading);
    }
  }, [id, loaderState]);

  return (
    // LoadingOverlay là thằng loader mà mình bao bọc childern
    <LoadingOverlay
      className={className}
      // là hình ảnh xoay xoay ở giữa
      spinner={<Preload />}
      // active là có loading hay không
      // có thể active qua hai lựa chọn:
      // 1 là qua loading
      // 2 qua lú qua global state loaderState
      active={loading || innerLoading}
    >
      {children}
    </LoadingOverlay>
  );
};

export default memo<React.FC<LoaderProps>>(Loader);
