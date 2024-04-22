'use client';
import React, {
  Ref,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react'; // React Grid Logic

import './style.scss';
import {
  GridApi,
  GridReadyEvent,
  ViewportChangedEvent,
} from 'ag-grid-community';

interface DataGridProps extends AgGridReactProps {
  onScrollToBottom?: () => void;
}
export interface DataGridHandle {
  api?: GridApi;
}
// ở thằng con muốn gọi hàm hoặc thuộc tính ở thằng cha thằng cha có thể truyền xuống cho con 1 hàm hoặc thuộc tính
// khi cha muốn gọi hàm hoặc thuộc tính của thằng con nó sẽ thông qua forwardRef truyền một số hàm của thằng con cho thàng cha sử dụng
const DataGrid = forwardRef(
  (
    props: DataGridProps,
    ref:
      | ((instance: DataGridHandle) => void)
      | React.MutableRefObject<DataGridHandle | null | undefined>
      | Ref<DataGridHandle | null | undefined>
      | null
  ) => {
    // ghi đè thuộc tính mặc định
    const { defaultColDef, onGridReady, ...rest } = props;
    const [gridInit, setGridInit] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const dataGridRef = useRef<{
      // một đối tượng api 
      api?: GridApi;
    }>({});
    useImperativeHandle(
      ref,
      () => ({
        //  api có để lấy các hàm thao  tác với bảng DataGrid
        api: dataGridRef.current.api,
      }),
      [gridInit]
    );
    const loading = useRef(false)
    const handleGridReady = (event: GridReadyEvent) => {
      dataGridRef.current.api = event.api;
      setGridInit(true);
      setTimeout(() => {
        onGridReady?.(event);
      });
    };

    const onViewportChanged = (event: ViewportChangedEvent) => {
      if (containerRef.current && event.lastRow !== -1) {
        const agBodyViewport: HTMLElement = containerRef.current.querySelector(
          '.ag-body-viewport'
        ) as HTMLElement;
        if (agBodyViewport) {
          // console.log(agBodyViewport.scrollHeight,agBodyViewport.clientHeight,agBodyViewport)
          if (agBodyViewport.scrollHeight <= agBodyViewport.clientHeight) {
            if (props.onScrollToBottom) {
              props.onScrollToBottom();
            }
          }
        }
      }
    };

    return (
      <div ref={containerRef} className="ag-theme-quartz h-full data-grid">
        <AgGridReact
          onGridReady={handleGridReady}
          onBodyScroll={(event) => {
            if (event.direction === 'vertical') {
              const agBodyViewport: HTMLElement = containerRef.current?.querySelector(
                '.ag-body-viewport'
              ) as HTMLElement;
              if (agBodyViewport) {
                if (!loading.current) {
                  if (agBodyViewport.scrollHeight - agBodyViewport.offsetHeight - agBodyViewport.scrollTop <= 15) {
                    loading.current = true;
                    props.onScrollToBottom?.();
                  }
                } else {
                  if (agBodyViewport.scrollHeight - agBodyViewport.offsetHeight - agBodyViewport.scrollTop > 15) {
                    loading.current = false;
                  }
                }

              }
            }
          }}
          defaultColDef={{
            // các thuộct tính mặc định
            resizable: false,
            minWidth: 80,
            ...defaultColDef,
          }}
          overlayNoRowsTemplate="Không có dữ liệu"
          overlayLoadingTemplate="Đang tải dữ liệu..."
          suppressDragLeaveHidesColumns
          suppressRowHoverHighlight
          suppressCellFocus
          onViewportChanged={onViewportChanged}
          // tuỳ vào từng cách dùng có thể ghi đè thuộc tính là props
          {...rest}
        />
      </div>
    );
  }
);

DataGrid.displayName = 'DataGrid';

export default DataGrid;
