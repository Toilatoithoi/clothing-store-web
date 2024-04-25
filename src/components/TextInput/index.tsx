'use client';
import React from 'react';

interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
  inputClassName?: string;
  rows?: number;
  cols?: number;
  type?: string;
}

const TextInput = (props: TextInputProps) => {
  // loại bỏ label ra khỏi props
  // lấy những thứ ngoài label về rest từ props
  const { label, hasError, errorMessage, className, cols, rows, inputClassName, ...rest } = props;
  // thuộc tính cùng tên khi ghép thì tên nào lấy sau sẽ được lấy
  //  const a = {name: 'a'}
  //  const b = {age: 12, name: 'b'}

  //  const c = {...a, ...b}
  //  c là giá trị của a và b
  //  console.log(c)

  //  const {name, age} = c
  //  gán giá trị của c cho 2 biến name và age
  //  console.log('c',name, age)

  // nối 2 Object vào thành 1 Object
  // c = Object.assign(a, b)

  return (
    <div className={`input-container flex flex-col ${className}`}>
      {props.label && <label className="font-bold">{props.label}</label>}
      {props.type === 'textarea' ? (
        <textarea
          cols={cols}
          rows={rows}
          className={` px-[0.8rem] flex items-center border
       border-gray-300 outline-none focus:border-[#052abc] h-[12rem]
       ${hasError ? 'border-red-500' : ''}
      `}
          {...rest}
        ></textarea>
      ) : (
        <input
          // ...rest là lấy lại rest bỏ vào props
          className={`h-[3.2rem] px-[0.8rem] flex items-center border
      border-gray-300 outline-none focus:border-[#052abc]
      ${hasError ? 'border-red-500' : ''}
      ${inputClassName ?? ''}
     `}
          {...rest}
        />
      )}

      {/* nếu touchEmail == True và errorEmail !== '' -> hiển thị thông báo lỗi <div className="text-red-500">{errorEmail}</div>  */}
      {hasError && <div className="text-red-500">{errorMessage}</div>}
      {/* loggic của react js là cái phía trước false cái phía sau sẽ không thực hiện */}
    </div>
  );
};

export default TextInput;
