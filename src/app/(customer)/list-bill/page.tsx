'use client';
import { AgGridReact } from 'ag-grid-react'; // Component AG Grid
import { ColDef, ColGroupDef, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import React, { useEffect, useRef, useState } from 'react';
import { Payment, ProductCart, useBill } from '@/components/CartDropdown/hook';
import { useRouter } from 'next/navigation';
import { integerFormatter, timeFormatterFromTimestamp } from '@/utils/grid';
import { FETCH_COUNT, METHOD, ORDER_STATUS, ROLES } from '@/constants';
import DataGrid, { DataGridHandle } from '@/components/DataGrid';
import ButtonCell, { Cancel, Eye, Upload } from '@/components/DataGrid/ButtonCell';
import { IPagination, PaginationRes } from '@/interfaces';
import BillDetail from '@/components/BillDetail';
import OrderForm from '@/components/OrderMgmt/OrderForm';
import { uuid } from '@/utils';
import { useMutation } from '@/store/custom';
import { ProductRes } from '@/interfaces/model';
import ModalProvider from '@/components/ModalProvider';
import Loader from '@/components/Loader';
import { useUserInfo } from '@/store/globalSWR';

// const BILL_STATUS_TRANSLATE: Record<string, string> = {
//   SUCCESS: 'Thành công',
//   REJECT: 'Từ chối',
//   CANCELED: 'Đã hủy',
//   NEW: 'Đã đặt',
//   CONFIRM: 'Đã xác nhận',
//   FAILED: 'Thất bại',
//   TRANSPORTED: 'Đang giao hàng'
// };

const OrderStatusTranslate: Record<string, string> = {
  [ORDER_STATUS.NEW]: 'Chờ xác nhận',
  [ORDER_STATUS.CONFIRM]: 'Đã xác nhận',
  [ORDER_STATUS.REJECT]: 'Từ chối',
  [ORDER_STATUS.TRANSPORTED]: 'Đang vận chuyển',
  [ORDER_STATUS.SUCCESS]: 'Giao hàng thành công',
  [ORDER_STATUS.FAILED]: 'Giao hàng thất bại',
  [ORDER_STATUS.CANCELED]: 'Đã hủy',
  [ORDER_STATUS.REQUEST_CANCEL]: 'Yêu cầu hủy',
};

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
  const gridRef = useRef<DataGridHandle>();
  const pagination = useRef<IPagination>({
    page: 0,
    totalCount: 0,
    totalPage: 1,
  });
  const componentId = useRef(uuid());
  const [modal, setModal] = useState<{ show?: boolean; data: any } | null>();
  const [modalDel, setModalDel] = useState<{
    show?: boolean;
    data: any;
  } | null>();
  const [modalCancel, setModalCancel] = useState<{
    show?: boolean;
    data: any;
  } | null>();


  const { trigger } = useMutation<PaginationRes<ProductRes>>('/api/bill', {
    url: '/api/bill',
    method: METHOD.GET,
    onSuccess(data, key, config) {
      gridRef.current?.api?.hideOverlay();
      pagination.current = data.pagination;
      gridRef.current?.api?.applyTransaction({
        add: data.items,
        addIndex: gridRef.current.api.getDisplayedRowCount(),
      });
    },
  });

  const { data: userInfo } = useUserInfo();
  console.log(userInfo)

  const requestData = () => {
    const { page, totalPage } = pagination.current;
    if (page < totalPage) {
      gridRef.current?.api?.showLoadingOverlay();
      trigger({
        fetchCount: FETCH_COUNT,
        page: page + 1,
        username: userInfo?.username,
        isMine: true
      });
    }
  };


  const columnDefs: Array<ColDef | ColGroupDef> = [
    {
      headerName: 'Thời gian',
      field: 'created_at',
      valueFormatter: timeFormatterFromTimestamp,
      minWidth: 150,
    },
    {
      headerName: 'Tên',
      field: 'full_name',
      minWidth: 150,
      flex: 1,
    },
    {
      headerName: 'Email',
      field: 'email',
      minWidth: 180,
    },
    {
      headerName: 'Thành phố',
      field: 'city',
    },
    {
      headerName: 'Tổng tiền',
      field: 'total_price',
      maxWidth: 150,
      valueFormatter: integerFormatter,
    },
    {
      headerName: 'Trạng thái',
      field: 'status',
      // parms là ColGroupDef
      valueFormatter: (params) => {
        return OrderStatusTranslate[params.value];
      },
    },
    {
      headerName: 'Ghi chú',
      field: 'note',
    },
    {
      headerName: 'Lý do',
      field: 'reason',
    },
    {
      headerName: '',
      cellRenderer: ButtonCell,
      maxWidth: 120,
      pinned: 'right',
      cellRendererParams: {
        buttons: [
          {
            render: Eye,
            onClick: (data: any) => {
              setModal({ show: true, data });
            },
          },
          {
            render: Cancel,
            onClick: (data: any) => {
              (data.status == ORDER_STATUS.NEW || userInfo?.role == ROLES.ADMIN) && setModalCancel({ show: true, data });
            },
            hide(data: Record<string, unknown>) {
              return data.status !== ORDER_STATUS.NEW;
            },
          },
        ],
      },
    },
  ];

  const handleCloseModal = () => {
    setModal(null);
  };
  const handleCloseModalCancel = () => {
    setModalCancel(null);
  };

  const refreshData = () => {
    pagination.current = {
      page: 0,
      totalCount: 0,
      totalPage: 1,
    };
    gridRef.current?.api?.updateGridOptions({ rowData: [] });
    requestData();
  };

  return (
    <div className="h-full w-full p-[1.6rem] flex flex-col flex-1">
      <div className="h-[4.5rem] w-full mb-2">
        <div className="max-w-screen-xl m-auto h-full px-[2rem] items-center flex justify-center text-center">
          <div className="uppercase font-[900] text-[2rem] text-[#2d2d2d]">
            Lịch sử mua hàng
          </div>
        </div>
      </div>
      <div className="ag-theme-quartz h-[70vh]">
        <DataGrid
          ref={gridRef}
          columnDefs={columnDefs}
          onGridReady={requestData}
          onScrollToBottom={requestData}
        />
      </div>
      <ModalProvider show={modal?.show} onHide={handleCloseModal}>
        <Loader id={componentId.current} className="w-screen max-w-screen-md">
          {modal?.data?.id && <BillDetail billId={modal?.data.id} />}
          <div className="flex gap-2">
            <button
              type="submit"
              className="btn-primary flex-1"
              onClick={handleCloseModal}
            >
              Xác nhận
            </button>
          </div>
        </Loader>
      </ModalProvider>
      <ModalProvider show={modalCancel?.show} onHide={handleCloseModalCancel}>
        {modalCancel?.data && (
          <OrderForm
            data={modalCancel?.data}
            onClose={handleCloseModalCancel}
            onRefresh={refreshData}
          />
        )}
      </ModalProvider>
    </div>
  );
};

export default ListBill;
