'use client'
'use strict';
import { AgGridReact } from 'ag-grid-react'; // Component AG Grid
import "ag-grid-community/styles/ag-grid.css"; // CSS bắt buộc được yêu cầu bởi grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Chủ đề tùy chọn được áp dụng cho grid
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import React, { useEffect, useState } from 'react'
import { Payment, ProductCart, useBill } from '@/components/CartDropdown/hook';
import { set } from 'date-fns';
import { useRouter } from 'next/navigation';
import { timeFormatterFromTimestamp } from '@/utils/grid';

const BILL_STATUS_TRANSLATE: Record<string, string> = {
    SUCCESS: 'Thành công', REJECT: 'Từ chối', CANCEL: 'Đã hủy', NEW: 'Đã đặt', CONFIRM: 'Đã xác nhận'
}

export interface List {
    sdt?: string;
    full_name: string;
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
    bill_product: ProductCart[];
    id: number;
}

const ListBill = () => {
    // điều hướng route
    const router = useRouter();
    // const handleViewBillProudtcPage = (value: number) => {
    //     // nếu muốn ghi đè thì thêm / không nó sẽ hiển thị tiếp nối url hiện tại
    //     router.push('/list-bill/' + value.toString())
    // }
    const CustomButtonComponent = ({ data }: ICellRendererParams) => {
        const handleClick = () => {
            router.push(`/list-bill/${data.id}`)
        }
        return <div className='w-full h-full flex items-center justify-center'>
            <button className='h-[3.2rem] px-[0.4rem] bg-[#BC0517] text-white rounded-[0.8rem] flex items-center justify-center' onClick={handleClick}>Xem</button>
        </div>;
    };
    const DeleteButtonComponent = ({ data }: ICellRendererParams) => {
        const handleClick = () => {
           updateToBill(data)
        }
        return <div className='w-full h-full flex items-center justify-center'>
            {
                data.status != "SUCCESS" && data.status != "CANCEL" ? <button className='h-[3.2rem] px-[0.4rem] bg-[#BC0517] text-white rounded-[0.8rem] flex items-center justify-center' onClick={handleClick}>Huỷ đơn</button>
                : <button disabled={true} className='h-[3.2rem] px-[0.4rem] bg-gray-300 text-white rounded-[0.8rem] flex items-center justify-center'>Huỷ đơn</button>
            }
        </div>;
    };
    
    const { addToBill, data, updateToBill } = useBill({});
    const [rowData, setRowData] = useState<Payment[]>([]);
    const [colDefs, setColDefs] = useState<Array<ColDef>>([
        {
            headerName: "Thời gian",
            field: "created_at",
            minWidth: 120,
            // có 2 hàm hay dùng 
            // valueGetter và valueFormatter hai cái này hoạt động giống nhau đều trả về giá trị để render ra cell fleid
            valueFormatter: timeFormatterFromTimestamp
        },
        { headerName: "Tên", field: "full_name" },
        { headerName: "Email", field: "email" },
        { headerName: "Số điện thoại", field: "phoneNumber" },
        { headerName: "Tỉnh/Thành phố", field: "city" },
        { headerName: "Quận/Huyện", field: "district" },
        { headerName: "Phường/Xã", field: "wards" },
        { headerName: "Địa chỉ", field: "address" },
        {
            headerName: "Trạng thái",
            field: "status",
            valueFormatter: (params) => {
                return BILL_STATUS_TRANSLATE[params.value]
            }
        },
        { headerName: "Ghi chú", field: "note" },
        { headerName: "Xem", field: 'id', cellRenderer: CustomButtonComponent },
        { headerName: "Huỷ đơn hàng", field: 'id', cellRenderer: DeleteButtonComponent },
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
                    rowSelection="multiple"
                    suppressRowClickSelection={true}
                    pagination={true}
                    paginationPageSize={20}
                    paginationPageSizeSelector={[10, 50, 100]}
                />
            </div>
        </div>
    );
}

export default ListBill;
