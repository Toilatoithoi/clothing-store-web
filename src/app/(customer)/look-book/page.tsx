'use client'
import React from 'react'
import DynamicImage from '@/components/DynamicImage'
import Image from 'next/image'
import LookBook1 from'@/assets/png/lookbook1.jpg'
import LookBook2 from'@/assets/png/lookbook2.jpg'
import LookBook3 from'@/assets/png/lookbook3.jpg'
import LookBook4 from'@/assets/png/lookbook4.jpg'
import LookBook5 from'@/assets/png/lookbook5.jpg'
import LookBook6 from'@/assets/png/lookbook6.jpg'
import LookBook7 from'@/assets/png/lookbook7.jpg'
import LookBook8 from'@/assets/png/lookbook8.jpg'
import LookBook9 from'@/assets/png/lookbook9.jpg'
import LookBook10 from'@/assets/png/lookbook10.png'
import LookBook11 from'@/assets/png/lookbook11.jpg'
import LookBook12 from'@/assets/png/lookbook12.jpg'
import LookBook13 from'@/assets/png/lookbook13.jpg'

const LookBook = () => {
  return (
      <div>
            <div className='min-h-[130rem] flex flex-col max-w-screen-xl m-auto'>
                <div className='h-[4.5rem] w-full mb-4'>
                  <div className='max-w-screen-xl m-auto h-full px-[2rem] items-center flex justify-center text-center'>
                      <div className='uppercase font-[900] text-[2rem] text-[#2d2d2d]'>
                         BỘ SƯU TẬP
                      </div>
                  </div>
                </div>
                <div className='w-full mb-3'>
                    <div className='text-[1rem] pl-8 font-semibold w-fit'>Hệ thống thời trang nam 360 trân trọng giới thiệu tới bạn những BST mới nhất của chúng tôi. Ngoài cảm hứng thiết kế thời trang theo từng mùa, 360 còn tập trung khai thác những chất liệu mới nhằm mang tới trải nghiệm phong phú cho khách hàng.</div>
                </div>
                <div className='flex-1 w-full flex items-start justify-between'>
                    <div className='bg-white pl-8'>
                      <div className='flex flex-col items-start justify-start w-fit h-fit gap-10 mb-10'>
                        <DynamicImage  
                           url={LookBook1}
                           width={400}
                           height={300}
                        />
                        <DynamicImage  
                           url={LookBook2}
                           width={400}
                           height={300}
                        />
                        <DynamicImage  
                           url={LookBook3}
                           width={400}
                           height={300}
                        />
                        <DynamicImage  
                           url={LookBook4}
                           width={400}
                           height={300}
                        />
                        <DynamicImage  
                           url={LookBook5}
                           width={400}
                           height={300}
                        />
                      </div>
                    </div>
                    <div className='bg-white'>
                      <div className='flex flex-col items-start justify-start w-fit h-fit gap-10 mb-10'>
                        <DynamicImage  
                           url={LookBook6}
                           width={400}
                           height={300}
                        />
                        <DynamicImage  
                           url={LookBook7}
                           width={400}
                           height={300}
                        />
                        <DynamicImage  
                           url={LookBook8}
                           width={400}
                           height={300}
                        />
                        <DynamicImage  
                           url={LookBook9}
                           width={400}
                           height={300}
                        />
                      </div>  
                    </div>
                    <div className='bg-white'>
                      <div className='flex flex-col items-start justify-start w-fit h-fit gap-10 mb-10'>
                        <DynamicImage  
                           url={LookBook10}
                           width={400}
                           height={300}
                        />
                        <DynamicImage  
                           url={LookBook11}
                           width={400}
                           height={300}
                        />
                        <DynamicImage  
                           url={LookBook12}
                           width={400}
                           height={300}
                        />
                        <DynamicImage  
                           url={LookBook13}
                           width={400}
                           height={300}
                        />
                      </div>
                    </div>
                </div>
            </div>
      </div>
  )
}

export default LookBook