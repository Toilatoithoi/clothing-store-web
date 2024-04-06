'use client';
import { METHOD } from '@/constants';
import { useSWRWrapper } from '@/store/custom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';

const OrderSummary = () => {
  const { data: orderSummary, isLoading } = useSWRWrapper<
    Record<string, number>
  >('/api/admin/summary/order', {
    method: METHOD.GET,
    url: '/api/admin/summary/order',
  });
  function getSubtitle(total: number) {
    return `<span style="font-size: 32px; z-index: 0; text-align: center;">${total}</span>
        <br>
        <span style="font-size: 18px">
            Đơn hàng
        </span>`;
  }

  console.log({orderSummary});
  const options: Highcharts.Options = {
    title: {
      text: '',
    },
    chart: {
      height: 400
    },
    credits: { enabled: false },
    subtitle: {
      useHTML: true,
      text: getSubtitle(orderSummary?.total ?? 0),
      floating: true,
      verticalAlign: 'middle',
      y: 10,
      style: {
        textAlign: 'center',
      },
    },

    legend: {
      enabled: true,
      itemStyle: {
        fontSize: '14px'
      }
    },
    tooltip: {
      valueDecimals: 0,
      valueSuffix: ' Đơn',
      style: {
        fontSize: '14px',
      },
      outside: true,
    },

    plotOptions: {
      pie: {
        borderWidth: 0,
        size: 250,
        innerSize: '70%',
      },
    },
    colors: ['#4ade80', '#F8C4B4', '#f6e1ea', '#B8E8FC', '#BCE29E'],
    series: [
      {
        type: 'pie',
        name: 'Đơn hàng',
        minSize: 10,
        showInLegend: true,
        data: [
          ['Giao hàng thành công', orderSummary?.success ?? 0],
          ['Giao hàng thất bại', orderSummary?.failed ?? 0],
          ['Đã hủy', orderSummary?.canceled ?? 0],
          ['Từ chối', orderSummary?.reject ?? 0],
          [
            'Khác',
            (orderSummary?.total ?? 0) -
            (orderSummary?.success ?? 0) -
            (orderSummary?.failed ?? 0) -
            (orderSummary?.reject ?? 0) -
            (orderSummary?.canceled ?? 0),
          ],
        ],
        dataLabels: {
          enabled: false,
          style: {
            fontWeight: 'bold',
            fontSize: '14px',
          },
        },
      },
    ],
  };

  if (isLoading) {
    return null;
  }
  return (
    <div className="h-full w-full">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        allowChartUpdate={true}
      />{' '}
    </div>
  );
};

export default OrderSummary;
