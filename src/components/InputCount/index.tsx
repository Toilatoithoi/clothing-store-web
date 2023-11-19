'use client'
import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa'

const InputCount = () => {
  const [value, setValue] = useState(0);

  const handleAdd = () => {
    setValue(value + 1)
  }

  const handleSub = () => {
    setValue(value - 1)
  }

  console.log('re render')

  return (
    <div className='flex items-center h-[3rem] rounded-[1.5rem] border border-gray-400 overflow-hidden'>
      <div className='h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 w-[3rem] cursor-pointer' onClick={handleSub}><FaMinus className="text-[1rem]" /></div>
      <input value={value} onChange={(event) => {
        const inputValue = Number(event.target.value)
        setValue(inputValue)
      }} className='outline-none w-[6rem] text-center' type="text" />
      <div className='h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 w-[3rem] cursor-pointer' onClick={handleAdd}><FaPlus className="text-[1rem]" /></div>
    </div>
  )
}

export default InputCount