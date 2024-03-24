'use client'
import { METHOD } from '@/constants';
import { AgGridReact } from 'ag-grid-react'; // Component AG Grid
import "ag-grid-community/styles/ag-grid.css"; // CSS bắt buộc được yêu cầu bởi grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Chủ đề tùy chọn được áp dụng cho grid
import { ColDef } from 'ag-grid-community';
import { set } from 'date-fns';
import { Bill, BillProduct } from '@/interfaces/model';
import { useSWRWrapper } from '@/store/custom';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import { Payment, ProductCart } from '@/components/CartDropdown/hook';
import { integerFormatter } from '@/utils/grid';
import { formatNumber } from '@/utils';

export interface Product {
  name: string,
  quantity: number,
  price: string
}



const ListBillDetail = (props: { params: { billId: string; } }) => {
  const { data } = useSWRWrapper<Bill>(`/api/bill/${props.params.billId}`, {
    url: `/api/bill/${props.params.billId}`,
    method: METHOD.GET
  })
  console.log({ data })
  const router = useRouter();
  const [summary, setSummary] = useState(0);
  const [rowData, setRowData] = useState<Product[]>([]);
  const [colDefs, setColDefs] = useState<Array<ColDef>>([
    { headerName: "Name", field: "name", flex: 1 },
    { headerName: "Quantity", field: "quantity", cellClass: 'text-end' },
    {
      headerName: "Price",
      field: "price",
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
          name: product.product_model?.product.name,
          quantity: product.quantity,
          price: (formatNumber(product.product_model.price * product.quantity)).toString() + ' ' + 'VND'
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
    <div className='h-[50rem]'>
      <div className='h-[4.5rem] w-full mb-2'>
        <div className='max-w-screen-xl m-auto h-full px-[2rem] items-center flex justify-center text-center'>
          <div className='uppercase font-[900] text-[2rem] text-[#2d2d2d]'>
            Lịch sử mua hàng
          </div>
        </div>
      </div>
      <div className="ag-theme-quartz m-auto" style={{ width: 600, height: 500 }}>
        <AgGridReact
          className='h-[30rem]'
          rowData={rowData}
          columnDefs={colDefs}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 50, 100]}
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