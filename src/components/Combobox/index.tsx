'use client';
import React, { useEffect, useState } from 'react';
import Down from "@/assets/svg/chevron-down.svg";

import { Combobox as ComboboxCmt, Transition } from '@headlessui/react';
import { isBlank } from '@/utils';

export interface ComboboxOption {
  label: string;
  value: string;
}

interface ComboboxProps {
  label: string;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
  options: ComboboxOption[];
  selected?: string;
  onChange?: (value: ComboboxOption) => void;
}
const Combobox = (props: ComboboxProps) => {
  // thêm undefinded vì option có thể là mảng rỗng phần từ đầu sẽ là rỗng
  // const [selectedPerson, setSelectedPerson] = useState<ComboboxOption | undefined>(props.options[0])
  // query là nội dung input của người dùng
  const [query, setQuery] = useState('');
  // đề khi chọn một địa điểm thì như chọn city thì district và ward phải thay đổi theo
  useEffect(() => {
    // .? nếu onChange tồn tại thì mới gọi 
    props.onChange?.(props.options[0] ?? { label: '', value: '' });
  }, [props.options])

  const filteredAddress =
    isBlank(query)
      ? props.options
      : props.options.filter((item) => {
        // chuyển đổi kí tự về chữ thường
        // tương tự hàm map để kết nối các dữ liệu 
        // chạy qua toàn bộ phần tử của option gọi lại connect truyền item vào 
        // nếu return true thì sẽ lấy phần tử đấy không thì sẽ không lấy
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
  // lấy option bằng giá trị truyền vào
  const selectedOption = props.options.find(item => item.value === props.selected);
  return (
    <div className={`input-container flex flex-col ${props.className}`}>
      <label className='font-bold'>{props.label}</label>
      <ComboboxCmt value={selectedOption} onChange={(value) => {
        // setSelectedPerson(value)
        // ?. nếu tồn tại onChange mới gọi
        props.onChange?.(value);
      }}>
        {({ open }) => (
          <div className='relative'>
            <div className="relative">
              {/* tương đương với thẻ input */}
              <ComboboxCmt.Input
                className={`h-[3.2rem] w-full px-[0.8rem] flex items-center border
            border-gray-300 outline-none focus:border-[#052abc]
            ${props.hasError ? 'border-red-500' : ''}
           `}
                onChange={(event) => setQuery(event.target.value)}
                // hiển thị giá trị
                displayValue={(selected: ComboboxOption) => selected?.label}
              />
              {/* dùng absolute để đè lên thẻ input */}
              {/* cách bên phải 0.8 rem */}
              {/* phần top cách phía trên 1/2 50% của lớp cha */}
              {/* nó sẽ bị lệch về bên dưới nên muốn mũi tên về chính giữa phải trừ đi 50% của lớp con là thằng mũi tên */}
              <Down className="absolute right-[0.8rem] top-1/2 -translate-y-1/2" />
            </div>

            <Transition
              show={open}
              // enter khi xuất hiện lên giao diện
              enter="transition duration-100 ease-out "
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100 "
              // leave khi ẩn trên giao diện
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
              // dùng chung khi enter và leave
              // absolute top-full đề tạo dropdown và left-0 để nó gằn liền bên trái
              // mt-2 để cách 1 khoảng 0.5 rem
              // shadow để tách khỏi nền 
              className="absolute top-full left-0 bg-white w-full rounded-[0.8rem] mt-2 shadow p-4 max-h-[30rem] overflow-y-auto z-10"
            >
              {filteredAddress.length ? <ComboboxCmt.Options >
                {filteredAddress.map((option) => (
                  <ComboboxCmt.Option className={`cursor-pointer hover:bg-slate-100 py-[0.8rem] px-[0.4rem]`} key={option.value} value={option}>
                    {option.label}
                  </ComboboxCmt.Option>
                ))}
              </ComboboxCmt.Options> : <div>Không tìm thấy dữ liệu</div>}

            </Transition>
          </div>
        )}
      </ComboboxCmt>
      {props.hasError && <div className='text-red-500'>{props.errorMessage}</div>}
    </div>

  )
}

export default Combobox;