'use client'
import DataGrid, { DataGridHandle } from '@/components/DataGrid'
import { METHOD } from '@/constants';
import { useMutation } from '@/store/custom';
import React, { useRef, useState } from 'react'
import ModalProvider from '../ModalProvider';
import CategoryForm from './CategoryForm';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import ButtonCell, { Edit, Trash } from '../DataGrid/ButtonCell';
import { uuid } from '@/utils';
import { Formik } from 'formik';
import TextInput from '../TextInput';
import Loader from '../Loader';
import ConfirmModal from '../ConfirmModal';


const CategoryMgmt = () => {
  const gridRef = useRef<DataGridHandle>();
  const componentId = useRef(uuid());
  const [modal, setModal] = useState<{ show?: boolean, data: any } | null>()
  const [modalDel, setModalDel] = useState<{
    show?: boolean;
    data: any;
  } | null>();
  
  const filter = useRef<{ searchKey?: string }>()

  const { trigger } = useMutation<Record<string, unknown>[]>('/api/category', {
    url: '/api/category',
    method: METHOD.GET,
    onSuccess(data, key, config) {
      gridRef.current?.api?.hideOverlay();
      gridRef.current?.api?.applyTransaction({ add: data, addIndex: gridRef.current.api.getDisplayedRowCount() })
    },
  })

  const { trigger: deleteCategory } = useMutation(`/api/category/{categoryId}`, {
    method: METHOD.DELETE,
    loading: true,
    url: `/api/category/{categoryId}`,
    notification: {
      title: 'Xóa danh mục',
      content: 'Xóa danh mục thành công'
    },
    componentId: componentId.current,
    onSuccess() {
      refreshData();
      setModalDel(null);
    }
  })

  const requestData = () => {
    gridRef.current?.api?.showLoadingOverlay();
    trigger(
      {
        searchKey: filter.current?.searchKey ? filter.current?.searchKey: '',
      }
    );
  }

  const columnDefs: Array<ColDef | ColGroupDef> = [
    {
      headerName: 'ID',
      field: 'id',
    },
    {
      headerName: 'Tên danh mục',
      field: 'name',
      flex: 1
    },

    {
      headerName: 'level',
      field: 'level'
    },
    {
      headerName: '',
      cellRenderer: ButtonCell,
      maxWidth: 120,
      cellRendererParams: {
        buttons: [
          {
            render: Edit,
            onClick: (data: any) => {
              setModal({ show: true, data })
            }
          },
          {
            render: Trash,
            onClick: (data: any) => {
              setModalDel({ show: true, data });
            },
          },
        ]
      }
    }
  ];

  const handleCloseModal = () => {
    setModal(null)
  }

  const handleShowModal = (data?: Record<string, string>) => {
    setModal({ show: true, data })
  }

  const handleDelete = () => {
    deleteCategory({ categoryId: modalDel?.data.id });
  };

  const handleCloseModalDel = () => {
    setModalDel(null);
  };

  const refreshData = () => {
    gridRef.current?.api?.updateGridOptions({ rowData: [] });
    requestData();
  }
  return (
    <div className='h-full w-full flex flex-col gap-[1.6rem]'>
      <div className='flex justify-between'>
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
              label='Tìm kiếm theo tên danh mục'
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
        <button type="button" className='btn bg-green-500 text-white' onClick={() => handleShowModal()}>Tạo danh mục</button>
      </div>
      <div className='w-full flex-1'>
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
        <CategoryForm onClose={handleCloseModal} onRefresh={refreshData} data={modal?.data} />
      </ModalProvider>
      <ModalProvider show={modalDel?.show} onHide={handleCloseModalDel}>
        <Loader id={componentId.current}>
          <ConfirmModal
            title="Xóa danh mục"
            content="Bạn có chắc chán muốn xóa danh mục này không"
            type="warning"
            onCancel={handleCloseModalDel}
            onConfirm={handleDelete}
          />
        </Loader>
      </ModalProvider>
    </div>
  )
}

export default CategoryMgmt