'use client'
import React, { useState } from 'react';
import Plus from '@/assets/svg/plus.svg'
import Minus from '@/assets/svg/minus.svg'

interface InputCountProps {
  // truyền value
  value: number;
  // thay đổi giá trị bên ngoài
  onChange?: (value: number) => void,
  min: number,
  max: number
}
const InputCount = (props: InputCountProps) => {

  const handleAdd = () => {
    if(props.value < props.max){
      // nếu onChange khác null thì sẽ thực hiện
      props.onChange?.((props.value ?? 0) + 1)
    }
  }

  const handleSub = () => {
    // nếu onChange khác null thì sẽ thực hiện
    if(props.value > props.min){
      props.onChange?.((props.value ?? 0) - 1)
    } 
  }


  return (
    <div className='flex items-center h-[3rem] rounded-[1.5rem] border border-gray-400 overflow-hidden'>
      <div className='h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 w-[3rem] cursor-pointer' onClick={handleSub}><Minus className="text-[1rem]" /></div>
      <input value={props.value ?? 0} onChange={(event) => {
        if(Number(event.target.value) <= props.max && Number(event.target.value) > props.min){
          const inputValue = Number(event.target.value)
          props.onChange?.(inputValue)
        }
      }} className='outline-none w-[6rem] text-center' type="text" />
      <div className='h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 w-[3rem] cursor-pointer' onClick={handleAdd}><Plus className="text-[1rem]" /></div>
    </div>
  )
}

export default InputCount