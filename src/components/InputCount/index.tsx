'use client'
import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa'

interface InputCountProps {
  // truyền value
  value?: number;
  // thay đổi giá trị bên ngoài
  onChange?: (value: number) => void
}
const InputCount = (props: InputCountProps) => {

  const handleAdd = () => {
    // nếu onChange khác null thì sẽ thực hiện
    props.onChange?.((props.value ?? 0) + 1)
  }

  const handleSub = () => {
    // nếu onChange khác null thì sẽ thực hiện
    props.onChange?.((props.value ?? 0) - 1)
  }


  return (
    <div className='flex items-center h-[3rem] rounded-[1.5rem] border border-gray-400 overflow-hidden'>
      <div className='h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 w-[3rem] cursor-pointer' onClick={handleSub}><FaMinus className="text-[1rem]" /></div>
      <input value={props.value ?? 0} onChange={(event) => {
        const inputValue = Number(event.target.value)
        props.onChange?.(inputValue)
      }} className='outline-none w-[6rem] text-center' type="text" />
      <div className='h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 w-[3rem] cursor-pointer' onClick={handleAdd}><FaPlus className="text-[1rem]" /></div>
    </div>
  )
}

export default InputCount