'use client';
import React, { ChangeEventHandler, useRef, useState } from 'react';
import Image from 'next/image';
import UploadIcon from '@/assets/svg/upload.svg';
import './style.scss';

interface ImageUploaderProps {
  onChange?: (file?: File | null) => void;
  // value?: string; // linkImage to edit;
  initImage?: string | null;
}

const ImageUploader = (props: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(props.initImage ?? '');

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleFileChanged: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    const files = event.target.files;
    if (files) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
    props.onChange?.(files?.[0]);
  };

  return (
    <div
      className={`banner-uploader group relative w-full flex items-center justify-center aspect-[230/290]`}
    >
      {image ? (
        <Image
          width={400}
          height={400}
          src={image}
          alt="banner"
          className="w-full h-full object-contain aspect-[230/290]"
        />
      ) : (
        <div className="banner-placeholder" onClick={handleChooseFile}>
          <div className="icon cursor-pointer">
            <UploadIcon className="text-[var(--primary)]" />
          </div>
        </div>
      )}
      <div className="absolute hidden group-hover:flex w-full h-full  items-center justify-center bg-[#ffffff40]">
        <div className="icon cursor-pointer" onClick={handleChooseFile}>
          <UploadIcon className="text-[var(--primary)]" />
        </div>
      </div>
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
  );
};

export default ImageUploader;
