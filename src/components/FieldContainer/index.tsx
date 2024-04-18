'use client'
import React, { ReactNode } from 'react'


interface FieldContainerProps {
  label: string;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
  children: ReactNode
}
const FieldContainer = (props: FieldContainerProps) => {

  const { label, hasError, errorMessage, className } = props;

  return (
    <div className={`input-container flex flex-col ${className}`}>
      <label className='font-bold'>{props.label}</label>
      {props.children}
      {hasError && <div className='text-red-500'>{errorMessage}</div>}
    </div>
  )
}

export default FieldContainer