import React, { useEffect, useRef, useState } from 'react';
import Search from '@/assets/svg/search.svg';
import { useMutation } from '@/store/custom';
import { FETCH_COUNT, METHOD } from '@/constants';
import { PaginationRes } from '@/interfaces';
import { ProductRes } from '@/interfaces/model';
import { formatNumber } from '@/utils';
import Image from 'next/image';
import anhBia from '@/assets/png/promotion.jpg';
import Link from 'next/link';

const SearchBox = () => {
  // lưu giá trị người ta tìm kiếm
  const [searchKey, setSearchKey] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const timer = useRef<NodeJS.Timeout>();
  // dùng useMutation thay vì useSWRWrapaer để kiểm soát được khi nào nó query data
  const { trigger, data } = useMutation<PaginationRes<ProductRes>>(
    '/searchProduct',
    {
      url: '/api/product',
      method: METHOD.GET,
    }
  );

  useEffect(() => {
    // để clear timeout lần đầu tiên
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isFocus) {
      // khi mà search thay đổi thì sẽ call handleSearch
      handleSearch(searchKey);
    }
  }, [searchKey]);

  const handleSearch = (key: string) => {
    // clear time out hiện tại
    if (timer.current) {
      clearTimeout(timer.current);
    }
    // sau khi nhập xong một lúc mới thử hiện tìm kiếm để tránh tìm kiếm khi người ta chưa nhập xong
    timer.current = setTimeout(() => {
      console.log(key);
      trigger({ searchKey: key, page: 1, fetchCount: FETCH_COUNT, isList: true });
      //search Theo key
    }, 500);
  };

  // khi nhấn chuột vào nhập xong mới hiển thị danh sách còn khi bỏ chuột ra không nhập nữa chuyển qua cái khác thì nó sẽ không hiển thị nữa
  const handleFocus = () => {
    setIsFocus(true);
  };

  // khi nhập xong chuyển qua cái khác
  const handleBlur = () => {
    // do khi onBlur nó sẽ ẩn focus đi nên phải setTimeout không thì khi bấm vào sản phẩm muốn chọn sẽ bị ẩn luôn do khi onBlur là sẽ ẩn focus 
    setTimeout(() => {
      setIsFocus(false);
    }, 200);
  };

  return (
    <div className="relative w-[30rem]">
      <form className="flex items-center h-[3.5rem] border border-gray-700 w-full">
        <input
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setSearchKey(e.target.value)}
          value={searchKey}
          className="h-full p-4 outline-none flex-1"
          type="text"
          placeholder="Tìm kiếm..."
        />
        <button
          type="button"
          className="bg-gray-300 h-full aspect-square flex items-center justify-center hover:bg-gray-500"
        >
          <Search className="text-[2rem]" />
        </button>
      </form>
      {isFocus && data && data.items && (
        <div className="absolute top-full left-0 w-full max-h-[40rem] overflow-y-scroll bg-white shadow-md mt-[0.8rem] z-10">
          {data.items.map((item) => (
            <Link
              href={`/product-detail/${item.id}`}
              key={item.id}
              className="cursor-pointer gap-[0.4rem] hover:bg-gray-200 w-full flex h-[8rem] items-center px-[1.6rem] border-b border-b-gray-400"
            >
              <div>
                <Image
                  className={`object-contain mr-[1rem] cursor-pointer`}
                  src={item.image ? item.image : anhBia}
                  alt={''}
                  width={50}
                  height={50}
                />
              </div>
              <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-center text-[1rem]">
                {item.name}
              </div>
              <div className="w-[6rem] text-center text-[1rem]">
                {formatNumber(item.price?.price)} VNĐ
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
