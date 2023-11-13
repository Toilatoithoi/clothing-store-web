'use client'
import { Disclosure, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { FaPlus, FaMinus } from 'react-icons/fa'
import Slider from 'react-rangeslider'

const SideBar = () => {
  return (
    <div className='w-[21.5rem]  h-full'>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className="flex justify-between bg-slate-100 w-full items-center p-3"
            >

              <div>Danh mục</div>
              <div>{!open ? <FaPlus /> : <FaMinus />}</div>
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
                  </div>
                  <div className='flex  w-full items-center'>
                    <input className='mr-2' type="checkbox" name="demo" />
                    <div>Áo khoác nỉ</div>
                  </div>
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>

      <div>
        <div>Khoảng giá</div>
        <Slider
          value={10}
        />
      </div>
    </div>
  )
}

export default SideBar