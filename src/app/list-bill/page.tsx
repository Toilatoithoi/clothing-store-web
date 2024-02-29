'use client'
'use strict';
import { AgGridReact } from 'ag-grid-react'; // Component AG Grid
import "ag-grid-community/styles/ag-grid.css"; // CSS bắt buộc được yêu cầu bởi grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Chủ đề tùy chọn được áp dụng cho grid
import { ColDef } from 'ag-grid-community';
import React, { useEffect, useState } from 'react'
import { Payment, useBill } from '@/components/CartDropdown/hook';
import { set } from 'date-fns';
import { useRouter } from 'next/navigation';

export interface List {
    sdt?: string;
    fullname: string;
    email: string;
    phoneNumber: string;
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
        router.push('/list-bill/' + value.toString())
    }
    const CustomButtonComponent = ({ value }: any) => {
        return <button onClick={() => handleViewBillProudtcPage(value)}>Push Me!</button>;
    };
    const { addToBill, data } = useBill({});
    const [rowData, setRowData] = useState<Payment[]>([]);
    const [colDefs, setColDefs] = useState<Array<ColDef>>([
        { headerName: "Name", field: "fullname" },
        { headerName: "Email", field: "username" },
        { headerName: "Số điện thoại", field: "phoneNumber" },
        { headerName: "City", field: "city" },
        { headerName: "District", field: "district" },
        { headerName: "Wards", field: "wards" },
        { headerName: "Address", field: "address" },
        { headerName: "Note", field: "note" },
        { headerName: "Created At", field: "created_at" },
        { headerName: "Bill Prodduct", field: 'bill_id', cellRenderer: CustomButtonComponent },
    ]);

    useEffect(() => {
        setRowData(data ?? []);
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
