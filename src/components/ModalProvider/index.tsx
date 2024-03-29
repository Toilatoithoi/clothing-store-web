'use client'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react';

interface ModalProviderProps {
  // provider có mục đích show và ẩn phần nội dung
  children?: React.ReactNode;
  show?: boolean;
  onHide: () => void;
}

// ModalProvider gồm 2 thành phần cơ bản 1 là phẩn mờ bảo phủ toàn bộ (overlay) và phần nội dung 
const ModalProvider = (props: ModalProviderProps) => {

  const handleCloseModal = () => {
    // khi click sẽ tắt form login
    props.onHide();
  }

  return (
    <Transition appear show={Boolean(props.show)} as={Fragment}>
      {/*  Thành phần Dialog chính từ @headlessui/react. Nó đại diện cho container chính của modal, với một class để tùy chỉnh kiểu dáng và một prop onClose kích hoạt hàm handleCloseModal khi modal được đóng */}
      <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* là phần nội dung */}
              <Dialog.Panel className={`w-fit transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}>
                {/* children là nhưng thứ nằm trong ModalProvider */}
                {props.children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>

  )
}

export default ModalProvider