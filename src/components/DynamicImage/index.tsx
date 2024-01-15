'use client'
import React, { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image'
import LookBook1 from '@/assets/png/lookbook1.jpg'
import LookBook2 from '@/assets/png/lookbook2.jpg'
import LookBook3 from '@/assets/png/lookbook3.jpg'
import LookBook4 from '@/assets/png/lookbook4.jpg'
import LookBook5 from '@/assets/png/lookbook5.jpg'
import LookBook6 from '@/assets/png/lookbook6.jpg'
import LookBook7 from '@/assets/png/lookbook7.jpg'
import LookBook8 from '@/assets/png/lookbook8.jpg'
import LookBook9 from '@/assets/png/lookbook9.jpg'
import LookBook10 from '@/assets/png/lookbook10.jpg'
import LookBook11 from '@/assets/png/lookbook11.jpg'
import LookBook12 from '@/assets/png/lookbook12.jpg'
import LookBook13 from '@/assets/png/lookbook13.jpg'

interface DynamicImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  url: StaticImageData;
  height?: number;
  width: number;
  alt?: string;
}

const DynamicImage = (props: DynamicImageProps) => {
  const [imageSrc, setImageSrc] = useState(props.width);

  return (
    <div className='w-full overflow-hidden'>
      <Image className={`object-contain mr-[1rem] cursor-pointer hover:scale-125 transition-all`} src={props.url} alt={`${props.alt}`} width={props.width} />
    </div>
  );
};

export default DynamicImage;