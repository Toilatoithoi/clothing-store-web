'use client';
import { METHOD } from '@/constants';
import { Summary } from '@/interfaces/request';
import { useSWRWrapper } from '@/store/custom';
import { formatNumber } from '@/utils';
import React from 'react';
import OrderSummary from '../OrderSummary';

const Dashboard = () => {
  const { data: summary } = useSWRWrapper<Summary>('/api/admin/summary', {
    method: METHOD.GET,
    url: '/api/admin/summary',
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col rounded-lg  overflow-hidden  items-center shadow-md bg-white">
          <div className="h-[1rem] bg-blue-400 w-full"></div>
          <div className="flex flex-col w-full items-center p-2 gap-2">
            <div className="text-[1.8rem] flex gap-2 items-center">
              Tổng sản phẩm
            </div>
            <div className="font-bold text-[2.4rem]">
              {formatNumber(summary?.count?.product ?? 0)}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-lg  overflow-hidden  items-center shadow-md bg-white">
          <div className="h-[1rem] bg-red-400 w-full"></div>
          <div className="flex flex-col w-full items-center p-2 gap-2">
            <div className="text-[1.8rem] flex gap-2 items-center">
              Tổng lượt bán
            </div>
            <div className="font-bold text-[2.4rem]">
              {formatNumber(summary?.count?.sold ?? 0)}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-lg  overflow-hidden  items-center shadow-md bg-white">
          <div className="h-[1rem] bg-yellow-400 w-full"></div>
          <div className="flex flex-col w-full items-center p-2 gap-2">
            <div className="text-[1.8rem] flex gap-2 items-center">
              Tổng đơn hàng
            </div>
            <div className="font-bold text-[2.4rem]">
              {formatNumber(summary?.count?.bill ?? 0)}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-lg  overflow-hidden  items-center shadow-md bg-white">
          <div className="h-[1rem] bg-green-400 w-full"></div>
          <div className="flex flex-col w-full items-center p-2 gap-2">
            <div className="text-[1.8rem] flex gap-2 items-center">
              Tổng doanh thu
            </div>
            <div className="font-bold text-[2.4rem]">
              {formatNumber(summary?.count?.revenue ?? 0)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 flex-wrap">
        <div className=" flex-1 min-w-[50rem] rounded-md border border-gray-200 bg-white shadow-md ">
          <div className="text-[1.8rem] flex gap-2 items-center p-8 font-bold">
            Doanh thu
          </div>
          <OrderSummary />
        </div>
        <div className=" w-[50rem] rounded-md border border-gray-200 bg-white shadow-md ">
          <div className="text-[1.8rem] flex gap-2 items-center p-8 font-bold">
            Đơn hàng
          </div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
