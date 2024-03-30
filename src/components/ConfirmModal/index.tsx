'use client';
import React from 'react';
import SuccessIcon from '@/assets/svg/notice-success.svg';
import WaringIcon from '@/assets/svg/notice-warning.svg';
import ErrorIcon from '@/assets/svg/notice-error.svg';

interface NoticeModalProps {
  type: 'error' | 'warning' | 'success';
  title?: string;
  content?: string;
  labelConfirm?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const MapIcon = {
  success: <SuccessIcon />,
  warning: <WaringIcon />,
  error: <ErrorIcon />,
};

const ConfirmModal = (props: NoticeModalProps) => {
  return (
    <div className="w-[35rem] flex flex-col items-center p-4">
      <div className="mb-4">{MapIcon[props.type]}</div>
      <div
        className="text-[1.8rem] font-bold text-gray-900 mb-2"
        dangerouslySetInnerHTML={{ __html: props.title ?? '' }}
      ></div>
      <div
        className="w-full text-center text-[1.4rem] font-normal text-gray-500 mb-6"
        dangerouslySetInnerHTML={{ __html: props.content ?? '' }}
      ></div>
      <div className="w-full flex gap-2">
        {props.onCancel && (
          <button
            className="btn  !w-full"
            type="button"
            onClick={props.onCancel}
          >
            Hủy
          </button>
        )}
        <button
          className="btn btn-primary !w-full"
          type="button"
          onClick={props.onConfirm}
        >
          {props.labelConfirm ?? 'Xác nhận'}
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
