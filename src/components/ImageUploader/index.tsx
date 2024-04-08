'use client';
import React, { ChangeEventHandler, useRef, useState } from 'react';
import Image from 'next/image';
import UploadIcon from '@/assets/svg/upload.svg';
import './style.scss';

interface ImageUploaderProps {
  // khi onChange để set file ra ngoài
  onChange?: (file?: File | null) => void;
  // value?: string; // linkImage to edit;
  initImage?: string | null;
  label?: string;
  aspectRatio?: string;
}

const ImageUploader = (props: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(props.initImage ?? '');

  const handleChooseFile = () => {
    // handleChooseFile chỉ đến input
    inputRef.current?.click();
  };

  const handleFileChanged: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    // lấy ra được file
    const files = event.target.files;
    if (files) {
      const reader = new FileReader();
      reader.onload = () => {
        // khi nó loading sẽ trả về string base 64 url trả về image để render lên
        setImage(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
    props.onChange?.(files?.[0]);
  };

  const aspectRatio = props.aspectRatio ?? '230/290'

  return (
    <div className='w-full'>
      {props.label && <label className="font-bold">{props.label}</label>}
      <div
        style={{ aspectRatio }}
        className={`banner-uploader group relative w-full flex items-center justify-center aspect-[230/290]`}
      >
        {image ? (
          // render ảnh tải lên
          <Image
            width={400}
            height={400}
            src={image}
            style={{ aspectRatio }}
            alt="banner"
            className="w-full h-full object-contain aspect-[230/290]"
          />
        ) : (
          <div className="banner-placeholder" onClick={handleChooseFile}>
            <div className="icon cursor-pointer">
              {/* khi click vào uploadIcon thì sẽ gọi đến thẻ input qua handleChooseFile*/}
              <UploadIcon className="text-[var(--primary)]" />
            </div>
          </div>
        )}
        <div className="absolute hidden group-hover:flex w-full h-full  items-center justify-center bg-[#ffffff40]">
          <div className="icon cursor-pointer" onClick={handleChooseFile}>
            <UploadIcon className="text-[var(--primary)]" />
          </div>
        </div>
        {/* ẩn đi */}
        {/* mở ra chọn file */}
        <input
          className="hidden"
          ref={inputRef}
          type="file"
          onClick={(e) => ((e.target as HTMLTextAreaElement).value = '')}
          onChange={(e) => {
            handleFileChanged(e);
          }}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
