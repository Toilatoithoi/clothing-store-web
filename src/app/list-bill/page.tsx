'use client'
'use strict';
import { AgGridReact } from 'ag-grid-react'; // Component AG Grid
import "ag-grid-community/styles/ag-grid.css"; // CSS bắt buộc được yêu cầu bởi grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Chủ đề tùy chọn được áp dụng cho grid
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import React, { useEffect, useState } from 'react'
import { Payment, useBill } from '@/components/CartDropdown/hook';
import { set } from 'date-fns';
import { useRouter } from 'next/navigation';
import { timeFormatterFromTimestamp } from '@/utils/grid';

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
    const CustomButtonComponent = ({ data }: ICellRendererParams) => {
        const handleClick = () => {
            router.push(`/list-bill/${data.id}`)
        }
        return <div className='w-full h-full flex items-center justify-center'>
            <button className='h-[3.2rem] px-[0.4rem] bg-[#BC0517] text-white rounded-[0.8rem] flex items-center justify-center' onClick={handleClick}>Xem</button>
        </div>;
    };
    const { addToBill, data } = useBill({});
    const [rowData, setRowData] = useState<Payment[]>([]);
    const [colDefs, setColDefs] = useState<Array<ColDef>>([
        {
            headerName: "Thời gian",
            field: "created_at",
            minWidth: 120,
            valueFormatter: timeFormatterFromTimestamp
        },
        { headerName: "Tên", field: "fullname" },
        { headerName: "Email", field: "username" },
        { headerName: "Số điện thoại", field: "phoneNumber" },
        { headerName: "Tỉnh/Thành phố", field: "city" },
        { headerName: "Quận/Huyện", field: "district" },
        { headerName: "Phường/Xã", field: "wards" },
        { headerName: "Địa chỉ", field: "address" },
        { headerName: "Ghi chú", field: "note" },
        { headerName: "Xem", field: 'id', cellRenderer: CustomButtonComponent },
    ]);

    useEffect(() => {
        setRowData(data ?? []);
    }, [data]);

    return (
        <div className='h-full w-full p-[1.6rem] flex flex-col flex-1'>
            <div className='h-[4.5rem] w-full mb-2'>
                <div className='max-w-screen-xl m-auto h-full px-[2rem] items-center flex justify-center text-center'>
                    <div className='uppercase font-[900] text-[2rem] text-[#2d2d2d]'>
                        Lịch sử mua hàng
                    </div>
                </div>
            </div>
            <div className="ag-theme-quartz h-[70vh]" >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                />
            </div>
        </div>
    );
}

export default ListBill;
