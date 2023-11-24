'use client'
import React from 'react'


interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
}

const TextInput = (props: TextInputProps) => {
  const { label, hasError, errorMessage, className, ...rest } = props;

  return (
    <div className={`input-container flex flex-col ${className}`}>
      <label >{props.label}</label>
      <input className={`h-[3.2rem] px-[0.8rem] flex items-center border
       border-gray-300 outline-none focus:border-[#052abc]
       ${hasError ? 'border-red-500' : ''}
      `} {...rest} />
      {hasError && <div className='text-red-500'>{errorMessage}</div>}
    </div>
  )
}

export default TextInput