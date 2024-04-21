'use client';
import { METHOD } from '@/constants';
import { AgGridReact } from 'ag-grid-react'; // Component AG Grid
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Bill } from '@/interfaces/model';
import { useSWRWrapper } from '@/store/custom';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { integerFormatter } from '@/utils/grid';
import { formatNumber } from '@/utils';
import './style.scss';
import Image from 'next/image';
import { formatDateToString } from '@/utils/datetime';

export interface Product {
  name: string;
  quantity: number;
  size: string;
  color: string;
  price: string;
  image: string;
  buy: string;
}

const BillDetail = (props: { billId: string }) => {
  const { data } = useSWRWrapper<Bill>(`/api/bill/${props.billId}`, {
    url: `/api/bill/${props.billId}`,
    method: METHOD.GET,
  });
  const ImageRenderer = ({ data }: ICellRendererParams) => {
    return (
      <Image
        className="object-contain overflow-hidden text-[1.3rem]"
        src={data.image}
        alt="Ảnh bìa"
        width={70}
        height={70}
        style={{ width: 'auto', height: 'auto' }}
        priority
      />
    );
  };
  console.log({ data });
  const router = useRouter();
  const [summary, setSummary] = useState(0);
  const [rowData, setRowData] = useState<Product[]>([]);
  const [colDefs, setColDefs] = useState<Array<ColDef>>([
    {
      headerName: 'Ảnh sản phẩm',
      field: 'image',
      cellClass: 'text-center p-[1rem]',
      autoHeight: true,
      cellRenderer: ImageRenderer,
    },
    { headerName: 'Tên sản phẩm', field: 'name' },
    { headerName: 'Kích cỡ', field: 'size', cellClass: 'text-end text-[1.3rem]' },
    { headerName: 'Màu sắc', field: 'color', cellClass: 'text-end text-[1.3rem]' },
    { headerName: 'Số lượng', field: 'quantity', cellClass: 'text-end text-[1.3rem]' },
    {
      headerName: 'Giá',
      field: 'price',
      cellClass: 'text-end text-[1.3rem]',
      valueFormatter: integerFormatter,
    },
    {
      headerName: 'Thành tiền',
      field: 'buy',
      cellClass: 'text-end text-[1.3rem]',
      valueFormatter: integerFormatter,
    },
  ]);
  useEffect(() => {
    const row: Product[] = [];
    let total = 0;
    if (data) {
      data.bill_product.forEach((product) => {
        row.push({
          image: product.image,
          name: product.product_name,
          size: product.size,
          color: product.color,
          quantity: product.quantity,
          price:
            formatNumber(product.price).toString() + ' ' + 'VND',
          buy:
            formatNumber(
              product.price * product.quantity
            ).toString() +
            ' ' +
            'VND',
        });
        total = Number(data.total_price);
      });
      setSummary(total);
    } else {
      console.error('Data is not an array:', data);
      // Handle the case where data is not an array
    }

    setRowData(row);
  }, [data]);

  return (
    <div className="flex flex-col w-full">
      <div className=" w-full mb-2">
        <div className="max-w-screen-xl m-auto h-full px-[2rem] items-center">
          <div className="uppercase font-[900] text-[2rem] text-[#2d2d2d]">
            {data && (
              <div className="">
                <div className="flex items-start justify-center">
                  <div className="mr-2 font-bold text-[1.3rem] ">
                    Thời gian đặt hàng:
                  </div>
                  <div className="font-bold text-[1.3rem]">
                    {formatDateToString(
                      new Date(data.created_at),
                      'HH:mm:ss dd/MM/yyyy'
                    )}
                  </div>
                </div>
                <div className="flex items-start justify-center">
                  <div className="mr-2 font-bold text-[1.3rem] ">
                    Tên người nhận:
                  </div>
                  <div className="font-bold text-[1.3rem]">
                    {data.full_name}
                  </div>
                </div>
                <div className="flex items-start justify-center">
                  <div className="mr-2 font-bold text-[1.3rem] ">
                    Số điện thoại người nhận:
                  </div>
                  <div className="font-bold text-[1.3rem]">
                    {data.phoneNumber}
                  </div>
                </div>
                <div className="flex items-start justify-center">
                  <div className="mr-2 font-bold text-[1.3rem] ">Địa chỉ:</div>
                  <div className="font-bold text-[1.3rem]">{data.city + ' ' + data.district + ' ' + data.wards + ' ' + data.address}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="ag-theme-quartz w-full m-auto" style={{ height: 500 }}>
        <AgGridReact
          className="ag-height text-[1.3rem]"
          rowData={rowData}
          columnDefs={colDefs}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          pagination={true}
          paginationPageSize={3}
          paginationPageSizeSelector={[3, 10, 100]}
        />
        <div className="h-[3.5rem] w-full border border-gray-950 flex items-center justify-between">
          <div className="text-right my-1 text-[2rem] font-bold">Tổng:</div>
          <div className="text-right my-1 text-[2rem] font-bold">
            {formatNumber(summary)} VND
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetail;
