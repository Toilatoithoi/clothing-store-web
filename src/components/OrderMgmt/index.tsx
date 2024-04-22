'use client';
import DataGrid, { DataGridHandle } from '@/components/DataGrid';
import { FETCH_COUNT, METHOD, ORDER_STATUS } from '@/constants';
import { useMutation } from '@/store/custom';
import React, { useRef, useState } from 'react';
import ModalProvider from '../ModalProvider';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import ButtonCell, { Edit, Eye, Upload } from '../DataGrid/ButtonCell';
import { isBlank, uuid } from '@/utils';
import { IPagination, PaginationRes } from '@/interfaces';
import { Bill, ProductRes } from '@/interfaces/model';
import { integerFormatter, integerFormatterVND, timeFormatterFromTimestamp } from '@/utils/grid';
import Loader from '../Loader';
import BillDetail from '../BillDetail';
import OrderForm from './OrderForm';
import { Formik } from 'formik';
import TextInput from '../TextInput';
import Dropdown from '../Dropdown';
import { subMonths } from 'date-fns';
import { formatDateToString } from '@/utils/datetime';

const OrderStatusTranslate: Record<string, string> = {
  // [ORDER_STATUS.NEW]: 'Đang xử lý',
  // [ORDER_STATUS.CANCELED]: 'Đã hủy',
  // [ORDER_STATUS.REQUEST_CANCEL]: 'Yêu cầu hủy',
  // [ORDER_STATUS.CONFIRM]: 'Xác nhận',
  // [ORDER_STATUS.TRANSPORTED]: 'Đang vận chuyển',
  // [ORDER_STATUS.SUCCESS]: 'Thành công',
  // [ORDER_STATUS.FAILED]: 'Thất bại',
  // [ORDER_STATUS.REJECT]: 'Từ chối',
  [ORDER_STATUS.NEW]: 'Chờ xác nhận',
  [ORDER_STATUS.CONFIRM]: 'Đã xác nhận',
  [ORDER_STATUS.REJECT]: 'Từ chối',
  [ORDER_STATUS.TRANSPORTED]: 'Đang vận chuyển',
  [ORDER_STATUS.SUCCESS]: 'Giao hàng thành công',
  [ORDER_STATUS.FAILED]: 'Giao hàng thất bại',
  [ORDER_STATUS.CANCELED]: 'Đã hủy',
  [ORDER_STATUS.REQUEST_CANCEL]: 'Yêu cầu hủy',
};

const OrderMgmt = () => {
  const gridRef = useRef<DataGridHandle>();
  const pagination = useRef<IPagination>({
    page: 0,
    totalCount: 0,
    totalPage: 1,
  });
  const componentId = useRef(uuid());
  const filter = useRef<{ searchKey?: string; status?: string; toDate?: string; fromDate?: string }>()
  const [modal, setModal] = useState<{ show?: boolean; data: any } | null>();
  const [modalDel, setModalDel] = useState<{
    show?: boolean;
    data: any;
  } | null>();
  const [modalEdit, setModalEdit] = useState<{
    show?: boolean;
    data: any;
  } | null>();
  const { trigger } = useMutation<PaginationRes<Bill>>('/api/bill', {
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

  const requestData = () => {
    const { page, totalPage } = pagination.current;
    if (page < totalPage) {
      gridRef.current?.api?.showLoadingOverlay();
      trigger({
        fetchCount: FETCH_COUNT,
        page: page + 1,
        searchKey: filter.current?.searchKey ? filter.current?.searchKey : '',
        ...!isBlank(filter.current?.status ?? '') && filter.current?.status !== 'ALL' && {
          status: filter.current?.status,
        },
        fromDate: filter.current?.fromDate,
        toDate: filter.current?.toDate,
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
      headerName: 'Tài khoản',
      field: 'user.username',
      minWidth: 300,
      flex: 1,
    },
    {
      headerName: 'Tên người nhận',
      field: 'full_name',
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: 'Email người nhận',
      field: 'email',
      minWidth: 300,
    },
    {
      headerName: 'Thành phố',
      field: 'city',
    },
    {
      headerName: 'Tổng tiền',
      field: 'total_price',
      maxWidth: 150,
      valueFormatter: integerFormatterVND,
    },
    {
      headerName: 'Trạng thái',
      field: 'status',
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
            render: Edit,
            onClick: (data: any) => {
              setModalEdit({ show: true, data });
            },
          },
        ],
      },
    },
  ];

  const handleCloseModal = () => {
    setModal(null);
  };
  const handleCloseModalEdit = () => {
    setModalEdit(null);
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
    <div className="h-full w-full flex flex-col gap-[1.6rem]">
      <div className="flex justify-between">
        <Formik
          initialValues={{ searchKey: '', status: 'ALL', fromDate: formatDateToString(subMonths(new Date(), 1), 'yyyy-MM-dd') || '', toDate: formatDateToString(new Date(), 'yyyy-MM-dd') || '' }}
          onSubmit={(values) => {
            filter.current = values;
            refreshData();
          }}
        >
          {({ values, handleSubmit, handleChange, setFieldValue }) => <form
            className='flex gap-8 items-end'
            onSubmit={handleSubmit}>
            <TextInput
              label='Tìm kiếm theo tên người nhận'
              inputClassName='h-[4rem]'
              placeholder='Nhập từ khóa tìm kiếm...'
              name='searchKey'
              className='w-[25rem]'
              onChange={handleChange}
              value={values.searchKey}
            />

            <Dropdown
              label="Trạng thái"
              inSearch
              className='w-[20rem]'
              options={[
                {
                  label: 'Tất cả',
                  value: 'ALL',
                },
                {
                  label: 'Chờ xác nhận',
                  value: ORDER_STATUS.NEW,
                },
                {
                  label: 'Đã xác nhận',
                  value: ORDER_STATUS.CONFIRM,
                },
                {
                  label: 'Từ chối',
                  value: ORDER_STATUS.REJECT,
                },
                {
                  label: 'Đang vận chuyển',
                  value: ORDER_STATUS.TRANSPORTED,
                },
                {
                  label: 'Giao hàng thành công',
                  value: ORDER_STATUS.SUCCESS,
                },
                {
                  label: 'Giao hàng thất bại',
                  value: ORDER_STATUS.FAILED,
                },
                {
                  label: 'Đã hủy',
                  value: ORDER_STATUS.CANCELED,
                },
                {
                  label: 'Yêu cầu hủy',
                  value: ORDER_STATUS.REQUEST_CANCEL,
                },
              ]}
              selected={values.status}
              onChange={(value) => setFieldValue('status', value)}
            />

            <div className="flex gap-4">
              <TextInput
                label='Từ Ngày'
                inputClassName='h-[4rem]'
                name='fromDate'
                className='w-[20rem]'
                onChange={handleChange}
                type='date'
                value={values.fromDate as string}
              />
              <TextInput
                label='Đến ngày'
                inputClassName='h-[4rem]'
                name='toDate'
                className='w-[20rem]'
                onChange={handleChange}
                type='date'
                value={values.toDate as string}
              />
            </div>
            <button
              type="submit"
              className="btn  bg-[#bc0517] text-white"
            >
              Tìm kiếm
            </button>
          </form>}
        </Formik>
      </div>
      <div className="w-full flex-1">
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
          <div className="flex gap-2 h-[3.2rem]">
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
      <ModalProvider show={modalEdit?.show} onHide={handleCloseModalEdit}>
        {modalEdit?.data && (
          <OrderForm
            data={modalEdit?.data}
            onClose={handleCloseModalEdit}
            onRefresh={refreshData}
          />
        )}
      </ModalProvider>
    </div>
  );
};

export default OrderMgmt;
