import BillDetail from '@/components/BillDetail';
import React from 'react';

const ListBillDetail = (props: { params: { billId: string } }) => {
  return <BillDetail billId={props.params.billId} />;
};

export default ListBillDetail;
