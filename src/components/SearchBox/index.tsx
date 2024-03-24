import React, { useEffect, useRef, useState } from 'react'
import Search from "@/assets/svg/search.svg";
import { useMutation } from '@/store/custom';
import { FETCH_COUNT, METHOD } from '@/constants';
import { PaginationRes } from '@/interfaces';
import { ProductRes } from '@/interfaces/model';
import { formatNumber } from '@/utils';
import Image from 'next/image'
import anhBia from '@/assets/png/promotion.jpg'

const SearchBox = () => {
  const [searchKey, setSearchKey] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const timer = useRef<NodeJS.Timeout>();
  const { trigger, data } = useMutation<PaginationRes<ProductRes>>('/searchProduct', {
    url: '/api/product',
    method: METHOD.GET
  })

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isFocus) {
      handleSearch(searchKey)
    }
  }, [searchKey])

  const handleSearch = (key: string) => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => {
      console.log(key)
      trigger({ searchKey: key, page: 1, fetchCount: FETCH_COUNT })
      //search Theo key 
    }, 500)
  }

  const handleFocus = () => {
    setIsFocus(true)
  }

  const handleBlur = () => {
    setIsFocus(false)

  }


  return (
    <div className='relative w-[30rem]'>
      <form className="flex items-center h-[3.5rem] border border-gray-700 w-full">
        <input onFocus={handleFocus} onBlur={handleBlur} onChange={e => setSearchKey(e.target.value)} value={searchKey} className="h-full p-4 outline-none flex-1" type="text" placeholder='Tìm kiếm...' />
        <button type='submit' className="bg-gray-300 h-full aspect-square flex items-center justify-center hover:bg-gray-500">
          <Search className="text-[2rem]" />
        </button>
      </form>
      {isFocus && data && data.items && <div className='absolute top-full left-0 w-full max-h-[40rem] overflow-y-scroll bg-white shadow-md mt-[0.8rem]'>
        {data.items.map(item => <div key={item.id} className='cursor-pointer gap-[0.4rem] hover:bg-gray-200 w-full flex h-[8rem] items-center px-[1.6rem] border-b border-b-gray-400'>
          <div>
            <Image className={`object-contain mr-[1rem] cursor-pointer`} src={item.image? item.image: anhBia} alt={''} width={50} height={50} />
          </div>
          <div className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-center text-[1rem]'>{item.name}</div>
          <div className='w-[6rem] text-center text-[1rem]'>{formatNumber(item.price?.price)} VNĐ</div>
        </div>)}
      </div>}
    </div>
  )
}

export default SearchBox