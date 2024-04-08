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
      // ???
      api?: GridApi;
    }>({});
    useImperativeHandle(
      ref,
      () => ({
        api: dataGridRef.current.api,
      }),
      [gridInit]
    );

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
              const { bottom } = event.api.getVerticalPixelRange()!;

              const rowHeight = event.api.getSizesForCurrentTheme().rowHeight;
              const rowCount = event.api.getDisplayedRowCount();
              if (rowHeight * rowCount - bottom <= 0) {
                props.onScrollToBottom?.();
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
