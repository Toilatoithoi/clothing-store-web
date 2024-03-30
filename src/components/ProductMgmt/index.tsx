'use client';
import DataGrid, { DataGridHandle } from '@/components/DataGrid';
import { FETCH_COUNT, METHOD, PRODUCT_STATUS } from '@/constants';
import { useMutation } from '@/store/custom';
import React, { useRef, useState } from 'react';
import ModalProvider from '../ModalProvider';
// import CategoryForm from './CategoryForm';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import ButtonCell, { Edit, Trash, Upload } from '../DataGrid/ButtonCell';
import { uuid } from '@/utils';
import { IPagination, PaginationRes } from '@/interfaces';
import { ProductRes } from '@/interfaces/model';
import { integerFormatter } from '@/utils/grid';
import ProductForm from '../ProductForm';
import ConfirmModal from '../ConfirmModal';
import Loader from '../Loader';

const ProductStatusTranslate: Record<string, string> = {
  [PRODUCT_STATUS.DRAFT]: 'Nháp',
  [PRODUCT_STATUS.PUBLISHED]: 'Đã đăng',
};

const ProductMgmt = () => {
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
  const [modalPub, setModalPub] = useState<{
    show?: boolean;
    data: any;
  } | null>();
  const { trigger } = useMutation<PaginationRes<ProductRes>>('/api/product', {
    url: '/api/product',
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

  const { trigger: updateProductStatus } = useMutation(
    `/api/product/{productId}/status`,
    {
      method: METHOD.PUT,
      loading: true,
      url: `/api/product/{productId}/status`,
      notification: {
        title: modalPub?.show ? 'Đăng sản phẩm' : 'Xóa sản phầm',
        content: modalPub?.show
          ? 'Đăng sản phẩm thành công'
          : 'Xóa sản phầm thành công',
      },
      componentId: componentId.current,
      onSuccess() {
        refreshData();
        setModalDel(null);
        setModalPub(null);
      },
    }
  );

  const requestData = () => {
    const { page, totalPage } = pagination.current;
    if (page < totalPage) {
      gridRef.current?.api?.showLoadingOverlay();
      trigger({
        fetchCount: FETCH_COUNT,
        page: page + 1,
      });
    }
  };

  const columnDefs: Array<ColDef | ColGroupDef> = [
    {
      headerName: 'ID',
      field: 'id',
      maxWidth: 60,
    },
    {
      headerName: 'Tên',
      field: 'name',
      flex: 1,
    },

    {
      headerName: 'Giá',
      field: 'price.price',
      cellClass: 'text-right',
      valueFormatter: integerFormatter,
      maxWidth: 120,
    },
    {
      headerName: 'Đã bán',
      field: 'sold',
      cellClass: 'text-right',
      valueFormatter: integerFormatter,
      maxWidth: 80,
    },
    {
      headerName: 'Còn lại',
      field: 'stock',
      cellClass: 'text-right',
      valueFormatter: integerFormatter,
      maxWidth: 80,
    },
    {
      headerName: 'Trạng thái',
      field: 'status',
      valueFormatter: (params) => {
        return ProductStatusTranslate[params.value];
      },
    },
    {
      headerName: '',
      cellRenderer: ButtonCell,
      maxWidth: 180,
      pinned: 'right',
      cellRendererParams: {
        buttons: [
          {
            render: Edit,
            onClick: (data: any) => {
              setModal({ show: true, data });
            },
          },
          {
            render: Trash,
            onClick: (data: any) => {
              setModalDel({ show: true, data });
            },
          },
          {
            render: Upload,
            onClick: (data: any) => {
              setModalPub({ show: true, data });
            },
            hide(data: Record<string, unknown>) {
              return data.status !== 'DRAFT';
            },
          },
        ],
      },
    },
  ];

  const handlePublish = () => {
    updateProductStatus({
      productId: modalPub?.data.id,
      status: PRODUCT_STATUS.PUBLISHED,
    });
  };

  const handleDelete = () => {
    updateProductStatus({
      productId: modalDel?.data.id,
      status: PRODUCT_STATUS.DELETED,
    });
  };

  const handleCloseModal = () => {
    setModal(null);
  };
  const handleCloseModalDel = () => {
    setModalDel(null);
  };
  const handleCloseModalPub = () => {
    setModalPub(null);
  };

  const handleShowModal = (data?: Record<string, string>) => {
    setModal({ show: true, data });
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
        <button
          type="button"
          className="btn  bg-[#bc0517] text-white"
          onClick={refreshData}
        >
          Tìm kiếm
        </button>
        <button
          type="button"
          className="btn bg-green-500 text-white"
          onClick={() => handleShowModal()}
        >
          Tạo
        </button>
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
        <ProductForm
          onClose={handleCloseModal}
          onRefresh={refreshData}
          data={modal?.data}
        />
      </ModalProvider>
      <ModalProvider show={modalPub?.show} onHide={handleCloseModalPub}>
        <Loader id={componentId.current}>
          <ConfirmModal
            title="Đăng sản phẩm"
            content="Sau khi đăng mọi khách hàng có thể mua sản phẩm này.Bạn có chắc chán muốn đăng sản phầm này không?"
            type="warning"
            onCancel={handleCloseModalPub}
            onConfirm={handlePublish}
          />
        </Loader>
      </ModalProvider>
      <ModalProvider show={modalDel?.show} onHide={handleCloseModalDel}>
        <Loader id={componentId.current}>
          <ConfirmModal
            title="Xóa sản phẩm"
            content="Bạn có chắc chán muốn xóa sản phầm này không"
            type="warning"
            onCancel={handleCloseModalDel}
            onConfirm={handleDelete}
          />
        </Loader>
      </ModalProvider>
    </div>
  );
};

export default ProductMgmt;
