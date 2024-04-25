'use client';
import { METHOD } from '@/constants';
import { Summary } from '@/interfaces/request';
import { useSWRWrapper } from '@/store/custom';
import { formatNumber } from '@/utils';
import React, { useEffect, useRef, useState } from 'react';
import OrderSummary from '../OrderSummary';
import RevenueChart from '../RevenueChart';
import UserMgmt from '../UserMgmt';
import { Formik } from 'formik';
import TextInput from '../TextInput';
import { subMonths } from 'date-fns';

const Dashboard = () => {
  const { data: summary } = useSWRWrapper<Summary>('/api/admin/summary', {
    method: METHOD.GET,
    url: '/api/admin/summary',
  });
  const filter = useRef<{ fromDate?: string; toDate?: string }>()
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleRevenue = (values: { fromDate?: string; toDate?: string }) => {
    setFromDate(values.fromDate || '')
    setToDate(values.toDate || '')
  }
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col rounded-lg  overflow-hidden  items-center shadow-md bg-white">
          <div className="h-[1rem] bg-blue-400 w-full"></div>
          <div className="flex flex-col w-full items-center p-2 gap-2">
            <div className="text-[1.8rem] flex gap-2 items-center">
              Tổng sản phẩm đang bán
            </div>
            <div className="font-bold text-[2.4rem]">
              {formatNumber(summary?.count?.product_count ?? 0)}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-lg  overflow-hidden  items-center shadow-md bg-white">
          <div className="h-[1rem] bg-red-400 w-full"></div>
          <div className="flex flex-col w-full items-center p-2 gap-2">
            <div className="text-[1.8rem] flex gap-2 items-center">
              Tổng sản phẩm bán thành công
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
              Tổng đơn hàng thành công
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
      <div className="flex gap-4 flex-wrap h">
        <div className=" flex-1 min-w-[50rem] rounded-md border border-gray-200 bg-white shadow-md ">
          <div className="text-[1.2rem] flex gap-2 items-center p-8 font-bold">
            <div className='text-[1.8rem] font-bold'>Doanh thu từ: </div>
            <Formik
              initialValues={{ fromDate: formatDateToString(subMonths(new Date(), 1), 'yyyy-MM-dd') || '', toDate: formatDateToString(new Date(), 'yyyy-MM-dd') || '' }}
              onSubmit={handleRevenue}
            >
              {({ values, handleSubmit, handleChange, setFieldValue }) => <form
                className='flex gap-8 items-end'
                onSubmit={handleSubmit}>
                <div className="flex gap-4">
                  <TextInput
                    label='Từ Ngày'
                    inputClassName='h-[3rem]'
                    name='fromDate'
                    className='w-[14rem]'
                    onChange={handleChange}
                    type='date'
                    value={values.fromDate as string}
                  />
                  <TextInput
                    label='Đến ngày'
                    inputClassName='h-[3rem]'
                    name='toDate'
                    className='w-[14rem]'
                    onChange={handleChange}
                    type='date'
                    value={values.toDate as string}
                  />
                </div>
                <button
                  type="submit"
                  className="btn  bg-[#bc0517] text-white "
                >
                  Tìm kiếm
                </button>
              </form>}
            </Formik>
          </div>
        <RevenueChart fromDate={fromDate} toDate={toDate} />
        </div>
        <div className=" w-[50rem] rounded-md border border-gray-200 bg-white shadow-md ">
          <div className="text-[1.8rem] flex gap-2 items-center p-8 font-bold">
            Đơn hàng
          </div>
          <OrderSummary />
        </div>
      </div>
      <div>
        <div className=" flex-1 min-w-[50rem] rounded-md border border-gray-200 bg-white shadow-md ">
          <div className="text-[1.8rem] flex gap-2 items-center p-8 font-bold">
            Top khách hàng
          </div>
          <div className='h-[50rem]'>
            <UserMgmt inDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
