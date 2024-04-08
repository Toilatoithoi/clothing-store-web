import { ICellRendererParams } from 'ag-grid-community';
import React from 'react';
import TrashIcon from '@/assets/svg/trash.svg';
import CancelIcon from '@/assets/svg/x.svg';
import EditIcon from '@/assets/svg/edit.svg';
import UploadIcon from '@/assets/svg/upload.svg';
import EyeIcon from '@/assets/svg/eye.svg';
import LockIcon from '@/assets/svg/lock.svg';
import UnlockIcon from '@/assets/svg/unlock.svg';
interface ButtonCell extends ICellRendererParams {
  buttons?: Array<{
    render: React.FunctionComponent<{ onClick(): void; className?: string }>;
    onClick: (data?: Record<string, unknown>) => void;
    hide?: (data?: Record<string, unknown>) => boolean;
  }>;
}
const ButtonCell = (props: ButtonCell) => {
  return (
    <div className="flex gap-4 h-full  items-center">
      {props.buttons?.map((item, idx) => {
        if (item.hide?.(props.data)) {
          return null;
        }
        return (
          <div key={idx}>
            {
              <item.render
                onClick={() => item.onClick(props.data)}
              ></item.render>
            }
          </div>
        );
      })}
    </div>
  );
};

export default ButtonCell;

export const Trash = (props: { onClick(): void }) => {
  return (
    <div
      onClick={props.onClick}
      title="Xóa"
      className="bg-red-200 hover:opacity-80 text-red-500 w-[3.4rem] h-[3.4rem] flex items-center justify-center rounded-md"
    >
      <TrashIcon className="hover:cursor-pointer" />
    </div>
  );
};

export const Cancel = (props: { onClick(): void }) => {
  return (
    <div
      onClick={props.onClick}
      title="Huỷ đơn"
      className="bg-red-200 hover:opacity-80 text-red-500 w-[3.4rem] h-[3.4rem] flex items-center justify-center rounded-md"
    >
      <CancelIcon className="hover:cursor-pointer" />
    </div>
  );
};

export const Edit = (props: { onClick(): void }) => {
  return (
    <div
      onClick={props.onClick}
      title="Sửa"
      className="bg-blue-200 hover:opacity-80 text-blue-500 w-[3.4rem] h-[3.4rem] flex items-center justify-center rounded-md"
    >
      <EditIcon className="hover:cursor-pointer" />
    </div>
  );
};

export const Upload = (props: { onClick(): void }) => {
  return (
    <div
      onClick={props.onClick}
      title="Đăng"
      className="bg-yellow-200 hover:opacity-80 text-yellow-500 w-[3.4rem] h-[3.4rem] flex items-center justify-center rounded-md"
    >
      <UploadIcon className="hover:cursor-pointer" />
    </div>
  );
};

export const Eye = (props: { onClick(): void }) => {
  return (
    <div
      onClick={props.onClick}
      title="Xem"
      className="bg-yellow-200 hover:opacity-80 text-yellow-500 w-[3.4rem] h-[3.4rem] flex items-center justify-center rounded-md"
    >
      <EyeIcon className="hover:cursor-pointer" />
    </div>
  );
};
export const Lock = (props: { onClick(): void }) => {
  return (
    <div
      onClick={props.onClick}
      title="Khóa"
      className="bg-pink-200 hover:opacity-80 text-pink-500 w-[3.4rem] h-[3.4rem] flex items-center justify-center rounded-md"
    >
      <LockIcon className="hover:cursor-pointer" />
    </div>
  );
};
export const Unlock = (props: { onClick(): void }) => {
  return (
    <div
      onClick={props.onClick}
      title="Mở khóa"
      className="bg-green-200 hover:opacity-80 text-green-500 w-[3.4rem] h-[3.4rem] flex items-center justify-center rounded-md"
    >
      <UnlockIcon className="hover:cursor-pointer" />
    </div>
  );
};
