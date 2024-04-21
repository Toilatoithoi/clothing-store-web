'use client';
import DataGrid, { DataGridHandle } from '@/components/DataGrid';
import { FETCH_COUNT, METHOD, PRODUCT_STATUS } from '@/constants';
import { useMutation } from '@/store/custom';
import React, { useRef, useState } from 'react';
import ModalProvider from '../ModalProvider';
import { ColDef, ColGroupDef, ICellRendererParams } from 'ag-grid-community';
import ButtonCell, { Edit, Eye, Trash, Upload } from '../DataGrid/ButtonCell';
import { uuid } from '@/utils';
import { IPagination, PaginationRes } from '@/interfaces';
import { integerFormatter, timeFormatterFromTimestamp } from '@/utils/grid';
import ProductForm from '../ProductForm';
import ConfirmModal from '../ConfirmModal';
import Loader from '../Loader';
import Image from 'next/image';
import { PostRes } from '@/interfaces/model';
import PostForm from '../PostForm';
import { useRouter } from 'next/navigation';
import { Formik } from 'formik';
import TextInput from '../TextInput';


const PostMgmt = () => {
    const gridRef = useRef<DataGridHandle>();
    const pagination = useRef<IPagination>({
        page: 0,
        totalCount: 0,
        totalPage: 1,
    });
    const filter = useRef<{ searchKey?: string }>()
    const router = useRouter();
    const componentId = useRef(uuid());
    const [modal, setModal] = useState<{ show?: boolean, data: any } | null>()
    const [modalDel, setModalDel] = useState<{
        show?: boolean;
        data: any;
    } | null>();
    const { trigger: getPost } = useMutation<PaginationRes<PostRes>>('/api/post', {
        url: '/api/post',
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
    // const ImageRenderer = ({ data }: ICellRendererParams) => {
    //     if (!data || !data.image) {
    //         return null;
    //     }
    //     return (
    //         <Image
    //             className="object-contain overflow-hidden"
    //             src={data.image}
    //             alt="Ảnh bìa"
    //             width={70}
    //             height={70}
    //             style={{ width: 'auto', height: 'auto' }}
    //             priority
    //         />
    //     );
    // };

    const stripHtmlTags = (htmlString: string) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        return tempDiv.textContent || tempDiv.innerText || '';
    };

    const { trigger: deletePost } = useMutation(`/api/post/{postId}`, {
        method: METHOD.DELETE,
        loading: true,
        url: `/api/post/{postId}`,
        notification: {
            title: 'Xóa bài viết',
            content: 'Xóa bài viết thành công'
        },
        componentId: componentId.current,
        onSuccess() {
            refreshData();
            setModalDel(null);
        }
    })

    const requestData = () => {
        const { page, totalPage } = pagination.current;
        if (page < totalPage) {
            gridRef.current?.api?.showLoadingOverlay();
            getPost({
                fetchCount: FETCH_COUNT,
                page: page + 1,
                searchKey: filter.current?.searchKey ? filter.current?.searchKey: '',
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
            headerName: 'Thời gian',
            field: 'createAt',
            valueFormatter: timeFormatterFromTimestamp,
            minWidth: 150,
        },
        {
            headerName: 'Tiêu đề',
            field: 'title',
            flex: 1,
        },
        {
            headerName: 'Tóm tắt',
            field: 'sapo',
            valueGetter: (params) => stripHtmlTags(params.data.sapo),
            cellClass: 'text-right overflow',
            minWidth: 400,
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
                            setModal({ show: true, data })
                        }
                    },
                    {
                        render: Trash,
                        onClick: (data: any) => {
                            setModalDel({ show: true, data });
                        }
                    },
                    {
                        render: Eye,
                        onClick: (data: any) => {
                            window.open(`${window.location.origin}/promotion/${data.id}`, 'blank')
                        }
                    },
                ],
            },
        },
    ];

    const handleCloseModal = () => {
        setModal(null);
    };

    const handleDelete = () => {
        deletePost({ postId: modalDel?.data.id });
    };
    const handleShowModal = (data?: Record<string, string>) => {
        setModal({ show: true, data });
    };
    const handleCloseModalDel = () => {
        setModalDel(null);
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
                            label='Tìm kiếm theo tiêu đề'
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
                <DataGrid
                    ref={gridRef}
                    columnDefs={columnDefs}
                    onGridReady={requestData}
                    onScrollToBottom={requestData}
                />
            </div>
            <ModalProvider show={modal?.show} onHide={handleCloseModal}>
                <PostForm
                    onClose={handleCloseModal}
                    onRefresh={refreshData}
                    data={modal?.data}
                />
            </ModalProvider>
            <ModalProvider show={modalDel?.show} onHide={handleCloseModalDel}>
                <Loader id={componentId.current}>
                    <ConfirmModal
                        title="Xóa bài viết"
                        content="Bạn có chắc chán muốn xóa bài viết này không"
                        type="warning"
                        onCancel={handleCloseModalDel}
                        onConfirm={handleDelete}
                    />
                </Loader>
            </ModalProvider>
        </div>
    );
};

export default PostMgmt;
