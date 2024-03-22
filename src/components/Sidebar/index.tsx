'use client'
import { Disclosure, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import Plus from '@/assets/svg/plus.svg'
import Minus from '@/assets/svg/minus.svg'
import Slider from 'react-rangeslider'
import { useSWRWrapper } from '@/store/custom'
import { Category } from '@/interfaces/model'
import { formatNumber } from '@/utils'


const SideBar = () => {
  const { data } = useSWRWrapper<Category[]>('/api/category?level=2', {
    url: '/api/category',
    params:{
      level: 2
    }
  })
  const [price, setPrice] = useState(0);
  useEffect(()=>{

  }, [price])
  return (
    <div className='w-[21.5rem]  h-full'>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className="flex justify-between bg-slate-100 w-full items-center p-3"
            >

              <div>Danh mục</div>
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
                  {/* <div className='flex  w-full items-center'>
                    <input className='mr-2' type="checkbox" name="demo" />
                    <div>Áo khoác nỉ</div>
                  </div>
                  <div className='flex  w-full items-center'>
                    <input className='mr-2' type="checkbox" name="demo" />
                    <div>Áo khoác nỉ</div>
                  </div>
                  <div className='flex  w-full items-center'>
                    <input className='mr-2' type="checkbox" name="demo" />
                    <div>Áo khoác nỉ</div>
                  </div>
                  <div className='flex  w-full items-center'>
                    <input className='mr-2' type="checkbox" name="demo" />
                    <div>Áo khoác nỉ</div>
                  </div>
                  <div className='flex  w-full items-center'>
                    <input className='mr-2' type="checkbox" name="demo" />
                    <div>Áo khoác nỉ</div>
                  </div>
                  <div className='flex  w-full items-center'>
                    <input className='mr-2' type="checkbox" name="demo" />
                    <div>Áo khoác nỉ</div>
                  </div>
                  <div className='flex  w-full items-center'>
                    <input className='mr-2' type="checkbox" name="demo" />
                    <div>Áo khoác nỉ</div>
                  </div>
                  <div className='flex  w-full items-center'>
                    <input className='mr-2' type="checkbox" name="demo" />
                    <div>Áo khoác nỉ</div>
                  </div>
                  <div className='flex  w-full items-center'>
                    <input className='mr-2' type="checkbox" name="demo" />
                    <div>Áo khoác nỉ</div>
                  </div>
                  <div className='flex  w-full items-center'>
                    <input className='mr-2' type="checkbox" name="demo" />
                    <div>Áo khoác nỉ</div>
                  </div>
                  <div className='flex  w-full items-center'>
                    <input className='mr-2' type="checkbox" name="demo" />
                    <div>Áo khoác nỉ</div>
                  </div>
                  <div className='flex  w-full items-center'>
                    <input className='mr-2' type="checkbox" name="demo" />
                    <div>Áo khoác nỉ</div>
                  </div>
                  <div className='flex  w-full items-center'>
                    <input className='mr-2' type="checkbox" name="demo" />
                    <div>Áo khoác nỉ</div>
                  </div> */}
                   {
                    data && data.map((item, index) => (
                      <div className='flex w-full items-center' key={index}>
                        <input className='mr-2' type="checkbox" name="demo" />
                        <div>{item.name}</div>
                      </div>
                    ))
                  }
                </div> 
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>

      <div>
        <div>Khoảng giá</div>
        <Slider
          value={price}
          min={0}
          max={3000000}
          onChange={setPrice}
          tooltip= {false}
          className=''
          step={10000}
        />
        <div className='flex items-center justify-between'>
          {
            price != 0 && <div className='font-bold '>0</div>
          }
          {
            price != 0 && <div className='font-bold '>{formatNumber(price)} VND</div>
          }
        </div>
      </div>
    </div>
  )
}

export default SideBar