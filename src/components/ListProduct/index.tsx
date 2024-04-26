'use client'
import React, { useEffect, useState } from 'react'
import SideBar from '../Sidebar'
import ProductCard from '../ProductCard'
import useSWR, { mutate } from 'swr'
import { fetcher } from '@/utils/fetcher'
import { useSWRWrapper } from '@/store/custom'
import { Category, ProductRes } from '@/interfaces/model'
import { PaginationRes } from '@/interfaces';
import { formatNumber } from '@/utils'
import Link from 'next/link'
import { SORT_TYPE } from '@/constants'

const FETCH_COUNT = 8;
const ListProduct = (props: { categoryId?: string; }) => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    price: {
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
    },
    categories: [] as number[]
  })
  const [orderBy, setOrderBy] = useState(SORT_TYPE.TIME);
  // lấy dữ liệu danh sách product từ api 
  // JSON.stringify(filter) để chuyển một chuyển js thành 1 chuỗi json {}
  // const filter = {
  //   priceMin: 100,
  //   priceMax: 200,
  // };
  // Kết quả sẽ là '{"priceMin":100,"priceMax":200}'
  // khi key thay đổi thì data mới load lại nếu key vẫn dữ nguyên data
  // do method searchParams.get chỉ nhận chuỗi string nên phải chuyển các category con thành chuỗi rồi khi get xong thì chuyển thành mảng 
  const { data: getProduct } = useSWRWrapper<PaginationRes<ProductRes>>(`/api/product?orderBy=${orderBy}${JSON.stringify(filter)}`, {
    url: '/api/product',
    params: {
      ...props.categoryId && { categoryId: props.categoryId },
      fetchCount: FETCH_COUNT,
      page: page,
      orderBy,
      priceMin: filter.price.min,
      priceMax: filter.price.max,
      // khi truyền filterCategories sử dụng một kĩ thuật join để tạo chuỗi là các category con
      filterCategories: filter.categories.join('|'),
      isList: true,
    }
  })

  // lấy danh mục cha hiển thị ở trang chủ/ danh mục cha
  const { data: getCategory } = useSWRWrapper<Category>(`/api/category/${props.categoryId}?level=1`, {
    url: `/api/category/${props.categoryId}`,
    params:{
      level: 1,
    }
  })

  console.log({ getProduct });

  const handleValuePage = (values: number) => {
    setPage(values)
  }

  useEffect(() => {
    mutate(`/api/product?orderBy=${orderBy}${JSON.stringify(filter)}`);
    mutate(`/api/category/${props.categoryId}?level=1`);
  }, [page]);


  const onChangeFilter = (filter: { price: number[], categories: number[] }) => {
    setFilter({
      price: {
        min: filter.price[0],
        max: filter.price[1],
      },
      categories: filter.categories
    })
  }

  return (
    <>
      <div className='h-[6rem] flex items-center text-gray-400 text-[1.6rem]'>
        <Link href={`/`}> <span className='hover:text-gray-600 cursor-pointer'>Trang chủ</span></Link>
        <span className='mx-2'>/</span>
        <span className='hover:text-gray-600 cursor-pointer'>{getCategory?.name}</span>
      </div>

      <div className='h-[4rem] mb-[1.5rem] flex justify-between items-center bg-slate-100 px-4'>
        {/* tính tổng số sản phẩm */}
        <div>{`Tổng ${formatNumber(getProduct?.pagination.totalCount)} sản phẩm `}</div>
        <div className='flex'>
          <div className='mr-4'>Sắp xếp theo</div>
          <div>
            <select className='outline-none'
              value={orderBy}
              onChange={(e) => {
                // khi onChange sẽ lấy được target.value của option ép kiểu là SORT_TYPE
                setOrderBy(e.target.value as SORT_TYPE)
              }}
            >
              <option value={SORT_TYPE.TIME}>
                Mới nhất
              </option>
              <option value={SORT_TYPE.PRICE_ASC}>
                Theo giá từ thấp đến cao
              </option>
              <option value={SORT_TYPE.PRICE_DESC}>
                Theo giá từ cao đến thấp
              </option>
            </select>
          </div>
        </div>
      </div>
      <div className='flex mb-[2rem] gap-[1.5rem]'>
        <SideBar categoryId={props.categoryId} onChangeFilter={onChangeFilter} />
        <div className='grid grid-cols-4 gap-5 h-fit'>
          {getProduct && getProduct.pagination.totalCount != 0 ?
            getProduct.items.map(item => <ProductCard data={item} key={item.id} />)
            :
            <div>Không có sản phẩm</div>
          }
        </div>
      </div>
      {
        getProduct && getProduct.pagination.totalCount != 0 ?
          <div className='flex items-center justify-center gap-4'>
            <select className='w-[5rem] flex items-end justify-end p-2 border-2 border-blue-600' onChange={(e) => handleValuePage(Number(e.target.value))}>
              {Array.from({ length: getProduct.pagination.totalPage }, (_, index) => (
                <option className="text-center" key={index} value={index + 1}>{`${index + 1}`}</option>
              ))}
            </select>
            <div>/</div>
            <div>{getProduct?.pagination.totalPage}</div>
          </div>
          : <div></div>
      }
    </>
  )
}

export default ListProduct

