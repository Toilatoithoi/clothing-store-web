'use client'
import React, { useState } from 'react'
import { useKeenSlider } from "keen-slider/react"
import 'keen-slider/keen-slider.min.css'
import ProductCard from '../ProductCard'
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useSWRWrapper } from '@/store/custom'
import { PaginationRes } from '@/interfaces'
import { ProductRes } from '@/interfaces/model'

const ProductSlider = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [loaded, setLoaded] = useState(false);

  const { data } = useSWRWrapper<PaginationRes<ProductRes>>('/api/product/productOrderBySold', {
    url: '/api/product/productOrderBySold',
  })
  console.log(data)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 5,
      spacing: 15,
    },
    slideChanged(slider) {
      console.log('slider changed', slider.track.details.rel)
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      console.log('slider created')
      setLoaded(true)
    },
  })


  return (
    <div className='w-full relative'>
      <div ref={sliderRef} className="keen-slider">
        {data?.items.map(item => <div className="keen-slider__slide number-slide1"><ProductCard data={item} key={item.id} /></div>)}
        {/* <div className="keen-slider__slide number-slide1"><ProductCard /></div>
        <div className="keen-slider__slide number-slide1"><ProductCard /></div>
        <div className="keen-slider__slide number-slide1"><ProductCard /></div>
        <div className="keen-slider__slide number-slide1"><ProductCard /></div>
        <div className="keen-slider__slide number-slide1"><ProductCard /></div>
        <div className="keen-slider__slide number-slide1"><ProductCard /></div> */}

      </div>
      {loaded && instanceRef.current && (
        <>
          <IoIosArrowBack
            className="absolute left-[2rem] top-1/2 -translate-y-1/2 text-[4rem] cursor-pointer text-gray-500 hover:text-gray-900"
            onClick={(e: any) => {
              if (currentSlide === 0) {
                return
              }
              e.stopPropagation() || instanceRef.current?.prev()
            }
            }
          />

          <IoIosArrowForward
            className="absolute right-[2rem] top-1/2 -translate-y-1/2 text-[4rem] cursor-pointer text-gray-500 hover:text-gray-900"
            onClick={(e: any) => {
              if (currentSlide === (instanceRef.current?.track.details?.slides.length ?? 0) - 1) {
                return;
              }
              e.stopPropagation() || instanceRef.current?.next()
            }
            }

          />
        </>
      )}
    </div>
  )
}

export default ProductSlider