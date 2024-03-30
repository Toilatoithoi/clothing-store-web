'use client'
import { METHOD } from '@/constants';
import { AgGridReact } from 'ag-grid-react'; // Component AG Grid
import "ag-grid-community/styles/ag-grid.css"; // CSS bắt buộc được yêu cầu bởi grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Chủ đề tùy chọn được áp dụng cho grid
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { set } from 'date-fns';
import { Bill, BillProduct } from '@/interfaces/model';
import { useSWRWrapper } from '@/store/custom';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Payment, ProductCart } from '@/components/CartDropdown/hook';
import { integerFormatter } from '@/utils/grid';
import { formatNumber } from '@/utils';
import './style.scss';
import Image from 'next/image';
import { da } from 'date-fns/locale';
import { formatDateToString } from '@/utils/datetime';

export interface Product {
  name: string;
  quantity: number;
  size: number;
  color: string;
  price: string;
  image: string;
  buy: string;
}

const ListBillDetail = (props: { params: { billId: string; } }) => {
  const { data } = useSWRWrapper<Bill>(`/api/bill/${props.params.billId}`, {
    url: `/api/bill/${props.params.billId}`,
    method: METHOD.GET
  })
  const ImageRenderer = ({ data }: ICellRendererParams) => {
    return <Image className="object-contain overflow-hidden" src={data.image} alt="Ảnh bìa" width={70} height={70}  style={{ width: 'auto', height: 'auto' }} priority />;
  };
  console.log({ data })
  const router = useRouter();
  const [summary, setSummary] = useState(0);
  const [rowData, setRowData] = useState<Product[]>([]);
  const [colDefs, setColDefs] = useState<Array<ColDef>>([
    { headerName: "Image", field: "image", cellClass: 'text-start p-[1rem]', autoHeight: true, cellRenderer: ImageRenderer},
    { headerName: "Name", field: "name"},
    { headerName: "Size", field: "size", cellClass: 'text-end'},
    { headerName: "Color", field: "color", cellClass: 'text-end'},
    { headerName: "Quantity", field: "quantity", cellClass: 'text-end' },
    {
      headerName: "Price",
      field: "price",
      cellClass: 'text-end',
      valueFormatter: integerFormatter
    },
    {
      headerName: "Thành tiền",
      field: "buy",
      cellClass: 'text-end',
      valueFormatter: integerFormatter
    },
  ]);
  useEffect(() => {
    const row: Product[] = [];
    let total = 0;
    if (data) {
      data.bill_product.forEach((product) => {
        row.push({
          image: product.product_model.image,
          name: product.product_model?.product.name,
          size: product.product_model.size,
          color: product.product_model.color,
          quantity: product.quantity,
          price: formatNumber(product.product_model.price).toString() + ' ' + 'VND',
          buy: (formatNumber(product.product_model.price * product.quantity)).toString() + ' ' + 'VND'
        })
        total = Number(total + product.product_model.price * product.quantity)
      })
      setSummary(total)
      // if (data.bill_product && Object.keys(data.bill_product).length > 0) {
      //   for (const p of data.bill_product) {
      //     if (p && Object.keys(p).length > 0) {
      //       row.push({
      //         name: p.product_detail?.name || '',
      //         quantity: p.quantity || 0,
      //       });
      //     } else {
      //       console.error("Product or productCart is empty:", p);
      //     }
      //   }
      // }
    } else {
      console.error("Data is not an array:", data);
      // Handle the case where data is not an array
    }

    setRowData(row);
  }, [data]);



  return (
    <div className=''>
      <div className='h-[7rem] w-full mb-2'>
        <div className='max-w-screen-xl m-auto h-full px-[2rem] items-center'>
          <div className='uppercase font-[900] text-[2rem] text-[#2d2d2d]'>
            {data && (
              <div className=''>
                <div className='flex items-start justify-center'>
                  <div className='mr-2 font-bold text-[1.6rem] '>Thời gian đặt hàng:</div>
                  <div className='font-bold text-[1.6rem]'>{formatDateToString(new Date(data.created_at), 'HH:mm:ss dd/MM/yyyy')}</div>  
                </div>
                <div className='flex items-start justify-center'>
                  <div className='mr-2 font-bold text-[1.6rem] '>Tên người nhận:</div>
                  <div className='font-bold text-[1.6rem]'>{data.full_name}</div>
                </div>
                <div className='flex items-start justify-center'>
                  <div className='mr-2 font-bold text-[1.6rem] '>Số điện thoại:</div>
                  <div className='font-bold text-[1.6rem]'>{data.user.phoneNumber}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="ag-theme-quartz m-auto" style={{ width: 1400, height: 500 }}>
        <AgGridReact
          className='ag-height'
          rowData={rowData}
          columnDefs={colDefs}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          pagination={true}
          paginationPageSize={3}
          paginationPageSizeSelector={[3, 10, 100]}
        />
        <div className='h-[3.5rem] w-full border border-gray-950 flex items-center justify-between'>
          <div className='text-right my-1 text-[2rem] font-bold'>Tổng:</div>
          <div className='text-right my-1 text-[2rem] font-bold'>{formatNumber(summary)} VND</div>
        </div>
      </div>
    </div>
  )
}

export default ListBillDetail
