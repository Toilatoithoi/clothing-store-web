'use client';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './style.scss';

import React from 'react';
import { useSWRWrapper } from '@/store/custom';
import { METHOD } from '@/constants';
import { formatDateToString } from '@/utils/datetime';
import { subMonths } from 'date-fns';
import { integerFormatterVND } from '@/utils/grid';

const RevenueChart = (props:{toDate?: string; fromDate?: string }) => {

  const { data } = useSWRWrapper<{ ti: string, sum: number }[]>(`/api/admin/summary/revenue?fromDate=${props.fromDate}&toDate=${props.toDate}`, {
    url: '/api/admin/summary/revenue',
    method: METHOD.GET,
    params: {
      fromDate: props.fromDate,
      toDate: props.toDate,
    }
  })

  const options: Highcharts.Options = {
    chart: {
      height: 400
    },
    credits: { enabled: false },
    title: {
      text: '',
    },
    xAxis: {
      type: 'datetime',
      startOnTick: true,
      endOnTick: true,
      tickPixelInterval: 100,
      labels: {
        formatter: function () {
          return Highcharts.dateFormat('%d/%m', Number(this.value));
        }
      }
    },
    yAxis: {
      title: {
        text: '',
      },
      gridLineWidth: 0,
      lineWidth: 1,
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      xDateFormat: '%d/%m/%Y',
      valueSuffix: ' VND',
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false,
        },
      },
    },
    series: [
      {
        type: 'line',
        name: 'Doanh thu',
        // truyền dữ liệu
        data: data?.map(item => [
          new Date(item.ti).getTime(),
          item.sum,
        ]),

      },
    ],
  };
  // console.log(options)
  console.log({data})
  console.log(props.fromDate)
  console.log(props.toDate)
  if (!data) {
    return null
  }
  return (
    <div className="h-full exam-chart">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        allowChartUpdate={true}
      />
    </div>
  );
};

export default RevenueChart;
