'use client';
import React, { useEffect, useState } from 'react';
import { FaChevronDown } from "react-icons/fa6";

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
  const [query, setQuery] = useState('');
  useEffect(() => {

    props.onChange?.(props.options[0] ?? { label: '', value: '' });
  }, [props.options])

  const filteredPeople =
    isBlank(query)
      ? props.options
      : props.options.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
  const selectedOption = props.options.find(item => item.value === props.selected);
  return (
    <div className={`input-container flex flex-col ${props.className}`}>
      <label >{props.label}</label>
      <ComboboxCmt value={selectedOption} onChange={(value) => {
        props.onChange?.(value);
      }}>
        {({ open }) => (
          <div className='relative'>
            <div className="relative">
              <ComboboxCmt.Input
                className={`h-[3.2rem] w-full px-[0.8rem] flex items-center border
            border-gray-300 outline-none focus:border-[#052abc]
            ${props.hasError ? 'border-red-500' : ''}
           `}
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(selected: ComboboxOption) => selected?.label}
              />
              <FaChevronDown className="absolute right-[0.8rem] top-1/2 -translate-y-1/2" />
            </div>

            <Transition
              show={open}
              enter="transition duration-100 ease-out "
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100 "
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
              className="absolute top-full left-0 bg-white w-full rounded-[0.8rem] mt-2 shadow p-4 max-h-[30rem] overflow-y-auto z-10"
            >
              {filteredPeople.length ? <ComboboxCmt.Options >
                {filteredPeople.map((option) => (
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