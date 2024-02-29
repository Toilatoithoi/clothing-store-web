'use client'
'use strict';
import { AgGridReact } from 'ag-grid-react'; // Component AG Grid
import "ag-grid-community/styles/ag-grid.css"; // CSS bắt buộc được yêu cầu bởi grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Chủ đề tùy chọn được áp dụng cho grid
import { ColDef } from 'ag-grid-community';
import React, { useEffect, useState} from 'react'
import { useBill } from '@/components/CartDropdown/hook';
import { set } from 'date-fns';
import { useRouter } from 'next/navigation';

export interface List {
    sdt?: string;
    name: string;
    username: string;
    city?: string;
    district?: string;
    wards?: string;
    address?: string;
    note?: string;
    status?: string;
    created_at?: string;
    bill_id: number;
}

const ListBill = () => {
    // điều hướng route
    const router = useRouter();
    const handleViewBillProudtcPage = (value: number) => {
        // nếu muốn ghi đè thì thêm / không nó sẽ hiển thị tiếp nối url hiện tại
        router.push('/list-bill/' +  value.toString())
      }
    const CustomButtonComponent = ({ value }: any) => {
        return <button onClick={() => handleViewBillProudtcPage(value)}>Push Me!</button>;
    };
    const { addToBill, data } = useBill({});
    console.log(data)
    const [rowData, setRowData] = useState<List[]>([]);
    const [colDefs, setColDefs] = useState<Array<ColDef>>([
        { headerName: "City", field: "city" },
        { headerName: "District", field: "district" },
        { headerName: "Wards", field: "wards" },
        { headerName: "Address", field: "address" },
        { headerName: "Note", field: "note" },
        { headerName: "Created At", field: "created_at" },
        { headerName: "Số điện thoại", field: "sdt"},
        { headerName: "Email", field: "username"},
        { headerName: "Name", field: "name"},
        { headerName: "Bill Prodduct",field: 'bill_id', cellRenderer: CustomButtonComponent},
    ]);

    useEffect(() => {
        const row: List[] = [];
        if (data) {
            for (const item of data) {
                // Kiểm tra xem item có tồn tại và không rỗng không
                if (item && Object.keys(item ).length > 0) {
                    row.push({
                        city: item.city || '',
                        district: item.district || '',
                        wards: item.wards || '',
                        address: item.address || '',
                        note: item.note || '',
                        created_at: item.created_at.split('T')[0] || '',
                        sdt: item.phone,
                        name: item.name,
                        username: item.username,              
                        bill_id: item.id
                    });
                } else {
                    // Xử lý trường hợp item rỗng
                    console.log("item rỗng hoặc không tồn tại:", item);
                }
            }
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
            <div className="ag-theme-quartz" style={{ height: 500 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                />
            </div>
        </div>
    );
}

export default ListBill;
