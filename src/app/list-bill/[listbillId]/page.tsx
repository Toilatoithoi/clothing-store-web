import { METHOD } from '@/constants';
import { BillProduct } from '@/interfaces/model';
import { useSWRWrapper } from '@/store/custom';
import React from 'react'

const ListBillDetail = (props: { params: { listbillId: string; } }) => {
  // const { data } = useSWRWrapper<BillProduct[]>(`/api/bill/${props.params.listbillId}`, {
  //   url: `/api/bill/${props.params.listbillId}`,
  //   method: METHOD.GET
  // })
  return (
    <div>page</div>
  )
}

export default ListBillDetail