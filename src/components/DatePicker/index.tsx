import React from 'react'
import Datetime from 'react-datetime'
import "react-datetime/css/react-datetime.css";
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
const DatePicker = (props: TextInputProps) => {
  const { label, ...rest } = props;
  return (
    <div>
      {/* <Datetime value={new Date()} className='overflow-y-auto appearance-none shadow border rounded py-3 px-2 text-gray-900' />
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="relative left-[33rem] -top-10 w-8 h-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg> */}
      <label className='font-bold mr-7'>{props.label}: </label>
      <input
        className='overflow-y-auto appearance-none shadow border rounded py-3 px-2 text-gray-900'
        type="datetime-local"
        id="meeting-time"
        name="meeting-time"
        min="2018-06-07T00:00" 
        {...rest}/>
    </div>
  )
}

export default DatePicker