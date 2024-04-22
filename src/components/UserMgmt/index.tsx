'use client';
import DataGrid, { DataGridHandle } from '@/components/DataGrid';
import { FETCH_COUNT, METHOD, ROLES } from '@/constants';
import { useMutation } from '@/store/custom';
import React, { useRef, useState } from 'react';
import ModalProvider from '../ModalProvider';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import ButtonCell, { Edit, Eye, Lock, Trash, Unlock } from '../DataGrid/ButtonCell';
import { uuid } from '@/utils';
import { IPagination, PaginationRes } from '@/interfaces';
import { integerFormatter, integerFormatterVND } from '@/utils/grid';
import { Formik } from 'formik';
import TextInput from '../TextInput';
import ConfirmModal from '../ConfirmModal';
import Loader from '../Loader';
import ListBill from '@/components/ListBill';


const UserMgmt = ({ inDashboard }: { inDashboard?: boolean }) => {
  const gridRef = useRef<DataGridHandle>();
  const pagination = useRef<IPagination>({
    page: 0,
    totalCount: 0,
    totalPage: 1,
  });
  const componentId = useRef(uuid());
  const [modal, setModal] = useState<{ show?: boolean; data: any } | null>();
  const [modalView, setModalView] = useState<{ show?: boolean; data: any } | null>();
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

  const { trigger: updateUser } = useMutation('UPDATE_USER', {
    url: '/api/admin/user',
    method: METHOD.PUT,
    loading: true,
    componentId: componentId.current,
    notification: {
      title: 'Khóa tài khoản',
      content: 'Mở khóa tài khoản thành công'
    },
    onSuccess() {
      refreshData();
      setModal(null)
    }
  })

  const requestData = () => {
    const { page, totalPage } = pagination.current;
    if (page < totalPage) {
      gridRef.current?.api?.showLoadingOverlay();
      trigger({
        fetchCount: inDashboard ? 10 : FETCH_COUNT,
        page: page + 1,
        searchKey: filter.current?.searchKey ? filter.current?.searchKey : '',
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
  const handleShowModal = (data?: Record<string, string>) => {
    setModal({ show: true, data });
  };
  const columnDefs: Array<ColDef | ColGroupDef> = [
    {
      headerName: 'ID',
      field: 'id',
      maxWidth: 60
    },
    {
      headerName: 'Họ tên',
      field: 'name',
      minWidth: 120
    },
    {
      headerName: 'username',
      field: 'username',
      minWidth: 300,
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
      valueFormatter: integerFormatterVND,
    },
    {
      headerName: '',
      cellRenderer: ButtonCell,
      maxWidth: 120,
      cellRendererParams: {
        buttons: [
          {
            render: Lock,
            onClick: handleShowModal,
            hide: (data: any) => {
              return data.is_lock || inDashboard || data.role === ROLES.ADMIN
            },

          },
          {
            render: Unlock,
            onClick: handleShowModal,
            hide: (data: any) => {
              return !data.is_lock || inDashboard || data.role === ROLES.ADMIN
            },
          },
          {
            render: Eye,
            onClick: (data: any) => {
              setModalView({ show: true, data });
            },
          },
        ],
      },
    },
  ];

  const handleCloseModal = () => {
    setModal(null);
  };



  const handleConfirmModal = () => {
    updateUser({
      id: modal?.data.id,
      isLock: modal?.data.is_lock === 1 ? 0 : 1
    })
  }

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
              label='Tìm kiếm theo họ tên'
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

      <ModalProvider
        show={modal?.show}
        onHide={handleCloseModal}

      >
        <Loader id={componentId.current}>
          <ConfirmModal
            type='warning'
            onConfirm={handleConfirmModal}
            onCancel={handleCloseModal}
            title={modal?.data.is_lock ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
            content={modal?.data.is_lock ? 'Tài khoản sau khi bị khóa sẽ không thể đăng nhập và đặt đơn hàng. Bạn có chắc chắn muốn khóa tài khoản này không?' :
              'Tài khoản sau khi mở khóa sẽ có thể đăng nhập và đặt đơn hàng. Bạn có chắc chắn muốn mở khóa tài khoản này không'
            }
          />
        </Loader>
      </ModalProvider>

      <ModalProvider

        show={modalView?.show}
        onHide={() => setModalView(null)}
      >
        <div className='w-screen max-w-screen-lg'>
          <ListBill username={modalView?.data.username} />
          <div className="flex gap-2 h-[4rem]">
            <button
              type="submit"
              className="btn-primary flex-1"
              onClick={() => setModalView(null)}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </ModalProvider>
    </div>
  );
};

export default UserMgmt;
