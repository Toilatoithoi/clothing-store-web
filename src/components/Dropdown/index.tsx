'use client';
import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import CheckIcon from '@/assets/svg/check.svg';
import ChevronDown from '@/assets/svg/chevron-down.svg';
import './style.scss';
export type DropdownProps = {
  options?: DropdownOption[];
  placeholder?: string;
  selected?: string;
  onChange?: (value: string | number) => void;
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
  initial?: boolean;
  menuAlignRight?: boolean;
  inSearch?: boolean;
};

interface DropdownOption {
  label: string;
  value: string | number;
  // disabled?: boolean;
}

const Dropdown = (props: DropdownProps) => {
  const [mapLabel, setMapLabel] = useState<Record<string, string>>({});
  const { label, hasError, errorMessage, className } = props;

  const [selected, setSelected] = useState<string | number | undefined>(
    props.options?.find(item => item.value === props.selected)?.value,
  );

  useEffect(() => {
    if (props.selected !== selected) {
      setSelected(props.selected);
    }
  }, [props.selected]);

  useEffect(() => {
    const mapRecord: Record<string, string> = {};
    props.options?.forEach(option => {
      mapRecord[option.value] = option.label;
    });
    setMapLabel(mapRecord);
    if (props.initial && props.options?.length) {
      const active = props.options?.find(item => item.value === props.selected);
      if (active == null) {
        handleChange(props.options[0].value);
      }
    }
  }, [props.options]);

  const handleChange = (value: string | number) => {
    setSelected(value);
    props.onChange?.(value);
  };
  return (
    <div
      className={`input-container flex flex-col ${className ?? ''}  ${hasError ? 'has-error' : ''
        }`}
    >
      {label != null && (
        <label className="dropdown-label font-bold" htmlFor="">
          {label}
        </label>
      )}
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative w-full">
          <Listbox.Button className={`${props.inSearch ? 'h-[4rem]' : 'h-[3.2rem]'}  w-full px-[0.8rem] flex items-center justify-between border
            border-gray-300 outline-none focus:border-[#052abc]
            ${props.hasError ? 'border-red-500' : ''}
           `}>
            <span className="block  truncate font-normal">
              {mapLabel[selected ?? ''] ?? props.placeholder ?? ''}
            </span>
            <span className=" ">
              <ChevronDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={`absolute mt-1 max-h-60 min-w-full !w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10 ${props.menuAlignRight ? 'right-0' : ''
                }`}
            >
              {props.options?.map((option, idx) => (
                <Listbox.Option
                  key={idx}
                  className={({ active }) =>
                    `relative cursor-pointer flex items-center h-[3rem] select-none  pl-10 pr-4 ${active
                      ? 'bg-slate-200 text-primary-900'
                      : 'text-gray-900'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={` text-[1.4rem] h-full flex items-center truncate ${selected ? 'font-medium ' : 'font-normal'
                          }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {props.hasError && <div className="error-message text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default Dropdown;
