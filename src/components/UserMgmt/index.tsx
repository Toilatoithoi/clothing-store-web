'use client';
import DataGrid, { DataGridHandle } from '@/components/DataGrid';
import { FETCH_COUNT, METHOD } from '@/constants';
import { useMutation } from '@/store/custom';
import React, { useRef, useState } from 'react';
import ModalProvider from '../ModalProvider';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import ButtonCell, { Edit, Trash } from '../DataGrid/ButtonCell';
import { uuid } from '@/utils';
import { IPagination, PaginationRes } from '@/interfaces';
import { integerFormatter } from '@/utils/grid';
import { Formik } from 'formik';
import TextInput from '../TextInput';

const UserMgmt = ({ inDashboard }: { inDashboard?: boolean }) => {
  const gridRef = useRef<DataGridHandle>();
  const pagination = useRef<IPagination>({
    page: 0,
    totalCount: 0,
    totalPage: 1,
  });
  const componentId = useRef(uuid());
  const [modal, setModal] = useState<{ show?: boolean; data: any } | null>();
  const filter = useRef<{ searchKey?: string }>()

  const { trigger } = useMutation<PaginationRes<Record<string, unknown>>>(
    '/api/admin/user',
    {
      url: '/api/admin/user',
      method: METHOD.GET,
      onSuccess(data, key, config) {
        gridRef.current?.api?.hideOverlay();
        pagination.current = data.pagination;
        gridRef.current?.api?.applyTransaction({
          add: data.items,
          addIndex: gridRef.current.api.getDisplayedRowCount(),
        });
      },
    }
  );

  const requestData = () => {
    const { page, totalPage } = pagination.current;
    if (page < totalPage) {
      gridRef.current?.api?.showLoadingOverlay();
      trigger({
        fetchCount: inDashboard ? 10 : FETCH_COUNT,
        page: page + 1,
        searchKey: filter.current?.searchKey ? filter.current?.searchKey: '',
      });
    }
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

  const columnDefs: Array<ColDef | ColGroupDef> = [
    {
      headerName: 'ID',
      field: 'id',
      maxWidth: 60
    },
    {
      headerName: 'Tên',
      field: 'name',
      minWidth: 120
    },
    {
      headerName: 'username',
      field: 'username',
      flex: 1,
    },
    {
      headerName: 'Số điện thoại',
      field: 'phone_number',
    },
    {
      headerName: 'Giới tính',
      field: 'gender',
      hide: inDashboard
    },
    {
      headerName: 'Tổng chi',
      field: 'totalPrice',
      valueFormatter: integerFormatter,
    },
    // {
    //   headerName: '',
    //   cellRenderer: ButtonCell,
    //   maxWidth: 120,
    //   cellRendererParams: {
    //     buttons: [
    //       {
    //         render: Edit,
    //         onClick: (data: any) => {
    //           setModal({ show: true, data });
    //         },
    //       },
    //     ],
    //   },
    // },
  ];

  const handleCloseModal = () => {
    setModal(null);
  };

  const handleShowModal = (data?: Record<string, string>) => {
    setModal({ show: true, data });
  };

  return (
    <div className="h-full w-full flex flex-col gap-[1.6rem]">
      {!inDashboard && <div className="flex justify-between">
        <Formik
          initialValues={{ searchKey: '' }}
          onSubmit={(values) => {
            filter.current = values;
            refreshData();
          }}
        >
          {({ values, handleSubmit, handleChange }) => <form
            className='flex gap-4 items-center'
            onSubmit={handleSubmit}>
            <TextInput
              inputClassName='h-[4rem]'
              placeholder='Nhập từ khóa tìm kiếm...'
              name='searchKey'
              className='w-[20rem]'
              onChange={handleChange}
              value={values.searchKey}
            />

            <button
              type="submit"
              className="btn  bg-[#bc0517] text-white"
            >
              Tìm kiếm
            </button>
          </form>}
        </Formik>
      </div>}
      <div className="w-full flex-1">
        <DataGrid
          ref={gridRef}
          columnDefs={columnDefs}
          onGridReady={requestData}
        />
      </div>
    </div>
  );
};

export default UserMgmt;
