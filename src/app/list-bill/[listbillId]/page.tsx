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

export interface Product {
 name: string,
 quantity: number
}



const ListBillDetail = (props: { params: { listbillId: string; } }) => {
  const { data } = useSWRWrapper<Bill>(`/api/bill/${props.params.listbillId}`, {
    url: `/api/bill/${props.params.listbillId}`,
    method: METHOD.GET
  })
  console.log({data})
  const router = useRouter();
  const [rowData, setRowData] = useState<Product[]>([]);
    const [colDefs, setColDefs] = useState<Array<ColDef>>([
        { headerName: "Name", field: "name" },
        { headerName: "Quantity", field: "quantity" },
    ]);
    useEffect(() => {
      const row: Product[] = [];
      if (data) {
        if (data.bill_product && Object.keys(data.bill_product).length > 0) {
          for (const p of data.bill_product) {
            if (p && Object.keys(p).length > 0) {
              row.push({
                name: p.product_detail.name || '',
                quantity: p.quantity || 0,
              });
            } else {
              console.error("Product or productCart is empty:", p);
            }
          }
        }
      } else {
        console.error("Data is not an array:", data);
        // Handle the case where data is not an array
      }
    
      setRowData(row);
    }, [data]);
    
    
    
  return (
    <div>
      <div className='h-[4.5rem] w-full mb-2'>
        <div className='max-w-screen-xl m-auto h-full px-[2rem] items-center flex justify-center text-center'>
          <div className='uppercase font-[900] text-[2rem] text-[#2d2d2d]'>
            Lịch sử mua hàng
          </div>
        </div>
      </div>
      <div className="ag-theme-quartz m-auto" style={{ width: 500, height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
        />
      </div>
    </div>
  )
}

export default ListBillDetail