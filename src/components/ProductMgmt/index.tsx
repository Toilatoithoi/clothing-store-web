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
import { integerFormatter, integerFormatterVND} from '@/utils/grid';
import ProductForm from '../ProductForm';
import ConfirmModal from '../ConfirmModal';
import Loader from '../Loader';
import { Formik } from 'formik';
import TextInput from '../TextInput';

const ProductStatusTranslate: Record<string, string> = {
  [PRODUCT_STATUS.DRAFT]: 'Nháp',
  [PRODUCT_STATUS.PUBLISHED]: 'Đã đăng',
};

const ProductMgmt = () => {
  // ???
  const gridRef = useRef<DataGridHandle>();
  // khởi tạo pagination
  const pagination = useRef<IPagination>({
    // để page = 0 và totalPage = 1 để nó luôn bé hơn để query
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
  const filter = useRef<{ searchKey?: string }>()

  const { trigger: getProduct } = useMutation<PaginationRes<ProductRes>>('/api/product', {
    url: '/api/product',
    method: METHOD.GET,
    // lần đầu tiên nó query rồi nó add vào
    onSuccess(data, key, config) {
      gridRef.current?.api?.hideOverlay();
      // khi thành công thì sẽ có data.pagination
      pagination.current = data.pagination;
      // khi thành công sẽ gọi hàm này để add vào bảng DataGrid
      // add thêm các phần tử vào bảng
      gridRef.current?.api?.applyTransaction({
        // add là add những phần tử
        add: data.items,
        // add index là add vào đâu: getDisplayedRowCount() là add vào cuối
        // add vào đầu addIndex: 0
        addIndex: gridRef.current.api.getDisplayedRowCount(),
      });
      console.log(pagination.current.page)
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
    // có totalPage thì nếu check page bé hơn totalPage thì mới query
    // từ thằng gridRef có thể gọi ra các hàm của thăng fcon cho thằng cha sử dụng
    const { page, totalPage } = pagination.current;
    if (page < totalPage) {
      // trước khi query thì showLoadingOverlay để cho người ta biết không thao tác 
      gridRef.current?.api?.showLoadingOverlay();
      // query data truyền page hiện tại và fetchCount
      getProduct({
        fetchCount: FETCH_COUNT,
        page: page + 1,
        searchKey: filter.current?.searchKey ? filter.current?.searchKey: '',
      });
    }
    // console.log({page, totalPage})
  };

  const columnDefs: Array<ColDef | ColGroupDef> = [
    {
      headerName: 'ID',
      field: 'id',
      maxWidth: 60,
    },
    {
      headerName: 'Tên sản phẩm',
      field: 'name',
      flex: 1,
    },

    {
      headerName: 'Giá',
      field: 'price.price',
      cellClass: 'text-right',
      valueFormatter: integerFormatterVND,
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
        // danh sách các button
        buttons: [
          {
            // render ra cái gì
            render: Edit,
            // khi onClick
            // data là dữ liệu của cả hàng cell 
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
            // khi tạo product thì có thể quyết định đăng sản phẩm hay không
            render: Upload,
            onClick: (data: any) => {
              setModalPub({ show: true, data });
            },
            // khi ẩn
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
    // hàm của api để update rowdata
    gridRef.current?.api?.updateGridOptions({ rowData: [] });
    requestData();
  };
  return (
    <div className="h-full w-full flex flex-col gap-[1.6rem]">
      <div className="flex justify-between">
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
              label='Tìm kiếm theo tên sản phẩm'
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
        <button
          type="button"
          className="btn bg-green-500 text-white"
          onClick={() => handleShowModal()}
        >
          Tạo
        </button>
      </div>
      <div className="w-full flex-1">
        {/* lúc grid được load lên sẽ chạy requestData */}
        <DataGrid
          // gán vào thì nó đã forward vào thằng gridRef này rồi
          ref={gridRef}
          columnDefs={columnDefs}
          // phải chờ onGridReady thì mới query data
          onGridReady={requestData}
          // lần thứ 2 trở đi là scoll đến cuối bảng thì hàm onScrollToBottom sẽ check xem là còn data không nếu còn data sẽ query tiếp
          // rồi add vào cho đến khi nào hết thì thôi
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
