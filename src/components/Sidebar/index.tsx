'use client'
import { Disclosure, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import Plus from '@/assets/svg/plus.svg'
import Minus from '@/assets/svg/minus.svg'
import { useSWRWrapper } from '@/store/custom'
import { Category } from '@/interfaces/model'
import { formatNumber } from '@/utils'
import { Formik } from 'formik'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


const SideBar = (props: { categoryId?: string; onChangeFilter?: (filter: { price: number[], categories: number[] }) => void; }) => {
  const { data } = useSWRWrapper<Category[]>(`/api/category/${props.categoryId}?level=2`, {
    url: `/api/category/${props.categoryId}`,
    params: {
      level: 2
    }
  })

  return (
    <div className='w-[21.5rem]  h-full'>
      <Formik
        onSubmit={(values: { price: number[], categories: number[] }) => {
          console.log({ values })
          props.onChangeFilter?.(values);
        }}

        initialValues={{
          price: [10000, 3000000],
          categories: [] as number[]
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => <form onSubmit={handleSubmit}>
          <Disclosure

            defaultOpen
          >
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="flex justify-between bg-slate-100 w-full items-center p-3"
                >

                  <div className='font-bold'>Danh mục</div>
                  <div>{!open ? <Plus /> : <Minus />}</div>
                </Disclosure.Button>
                <Transition
                  show={open}
                  enter="transition duration-100 ease-out  "
                  enterFrom="transform  opacity-0"
                  enterTo="transform opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform opacity-100 "
                  leaveTo="transform  opacity-0"
                >

                  <Disclosure.Panel
                    static
                  >
                    <div className='flex flex-col p-2 gap-6  max-h-[40rem] overflow-y-auto'>
                      {
                        data && data.map((item, index) => (
                          <div className='flex w-full items-center' key={index}>
                            <input id={`category-${item.id}`} onChange={(e) => {
                              const checked = e.target.checked;
                              if (checked) {
                                setFieldValue('categories', [...values.categories, item.id])
                              } else {
                                setFieldValue('categories', values.categories.filter(category => category !== item.id))
                              }
                            }} checked={values.categories.includes(item.id)} className='mr-2' type="checkbox" name="demo" />
                            <label className='cursor-pointer' htmlFor={`category-${item.id}`}>{item.name}</label>
                          </div>
                        ))
                      }
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>

          <div className='my-[1.6rem] '>
            <div className='font-bold mb-[0.8rem]'>Khoảng giá</div>
            <div className='w-full px-[0.8rem]'>
              <Slider
                range
                defaultValue={[10000, 3000000]}
                value={values.price}
                min={10000}
                max={3000000}
                step={10000}
                onChange={(value) => setFieldValue('price', value)}
              />
            </div>
            <div className='flex items-center justify-between'>
              <div className='font-bold '>{formatNumber(values.price[0])} VND</div>
              <div className='font-bold '>{formatNumber(values.price[1])} VND</div>
            </div>
          </div>
          <button type="submit" className="bg-[#666] hover:bg-[#555] text-white w-full flex justify-center items-center p-[0.4rem] font-bold">
            Áp dụng
          </button>
        </form>}
      </Formik>
    </div>
  )
}

export default SideBar